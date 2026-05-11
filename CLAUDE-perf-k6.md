# CLAUDE.md — Performance / k6
# File location: qa-lab-playwright/performance/CLAUDE.md

> **This file is the authoritative specification for Claude Code.**
> Read it completely before writing any script, any config, any CI step.
> This is an augmentation of the existing Playwright + TypeScript framework — not a standalone project.
> When in doubt — ask. Do not invent thresholds. Do not add npm packages outside this spec.

**Author:** Evgenii Subbotin
**Parent project:** qa-lab-playwright (Stack 1 — Cross-Stack Series)
**Performance tool:** k6 (Grafana)
**Target:** https://subbotin.es/QA-Lab/qa-lab.html (S3 + CloudFront)
**Language:** JavaScript — natively consistent with the TypeScript/Node ecosystem of this repo
**Version:** 1.0 | May 2026

---

## 1. What This Augmentation Does

Adds SLO compliance performance testing to the existing Playwright + TypeScript framework.
k6 is the natural performance companion to this stack: JavaScript DSL, CI-native,
Grafana Cloud integration, zero friction with the Node ecosystem.

**Narrative for portfolio / interviews:**
> "Performance tooling follows the same language-ecosystem principle as the test framework.
> k6 lives here because it's JavaScript-native. Migrating from portfolio-scale to
> production-scale means changing thresholds and VU counts — not changing tools."

**What this does NOT do:**
This target is S3 + CloudFront. It does not have application server logic, DB queries,
or connection pools. Performance testing here measures **SLO compliance** — not capacity.
The target cannot degrade under reasonable load by design. This is documented honestly.

**Honest scope:**
```
✅ p95 / p99 response time thresholds as CI quality gate
✅ Cold vs warm CDN comparison (first hit vs cached hit)
✅ Error rate assertion (< 1%)
✅ HTTP status code verification under load
✅ Grafana Cloud dashboard (optional, free tier)
❌ Capacity testing — not applicable to static CDN
❌ Degradation curves — no application server to degrade
```

---

## 2. Absolute Rules

```
NEVER use k6 browser module — this is HTTP-level load testing, not UI automation
NEVER hardcode BASE_URL — always use __ENV.BASE_URL with fallback
NEVER set VU count above 50 in CI — respect free tier runner resources
NEVER add npm packages — k6 runs its own JS runtime, not Node.js
NEVER use async/await — k6 uses synchronous VU model
ALWAYS use thresholds as CI quality gates — test fails pipeline if violated
ALWAYS document that CDN is the target — no fake capacity claims
ALWAYS use checks() for response validation — not bare assertions
ALWAYS keep scripts in performance/k6/ — never mix with Playwright tests
ALWAYS run k6 locally before pushing — verify thresholds are achievable
```

---

## 3. Tech Stack

| Layer | Technology | Version | Why |
|---|---|---|---|
| Load tool | k6 (Grafana) | 0.51+ | JS DSL, CI-native, free OSS, Grafana integration |
| Language | JavaScript | ES6 | Native to this repo's ecosystem |
| Metrics output | k6 built-in JSON + summary | — | Zero extra dependencies |
| Optional dashboard | Grafana Cloud | free tier | Live metrics during test run |
| CI | GitHub Actions | current | Existing pipeline — add one job |
| Install method | `grafana/setup-k6-action` | v1 | Official GitHub Action, one line |

**No Node.js. No npm install for k6. No extra reporters.**

---

## 4. Directory Structure

```
qa-lab-playwright/          ← existing repo root
└── performance/
    └── k6/
        ├── scripts/
        │   ├── slo-smoke.js        # 5 VU, 30s — smoke: is the site up?
        │   ├── slo-baseline.js     # 10 VU, 60s — baseline measurement
        │   └── cdn-cold-warm.js    # sequential: cold hit vs warm hit comparison
        ├── thresholds.js           # shared threshold definitions
        └── README.md               # explains scope honestly
```

---

## 5. Thresholds — Define First

```javascript
// performance/k6/thresholds.js
// Shared thresholds — import in all scripts

export const defaultThresholds = {
  // p95 under 500ms — CloudFront warm cache should be well under this
  http_req_duration: ['p(95)<500', 'p(99)<1000'],
  // Error rate under 1%
  http_req_failed: ['rate<0.01'],
  // All checks pass
  checks: ['rate>0.99'],
};
```

---

## 6. Scripts — Exact Implementation

### slo-smoke.js
```javascript
// performance/k6/scripts/slo-smoke.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { defaultThresholds } from '../thresholds.js';

const BASE_URL = __ENV.BASE_URL || 'https://subbotin.es';
const QA_LAB_PATH = '/QA-Lab/qa-lab.html';

export const options = {
  vus: 5,
  duration: '30s',
  thresholds: defaultThresholds,
};

export default function () {
  const res = http.get(`${BASE_URL}${QA_LAB_PATH}`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'page contains QA Lab': (r) => r.body.includes('QA Lab'),
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

### slo-baseline.js
```javascript
// performance/k6/scripts/slo-baseline.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { defaultThresholds } from '../thresholds.js';

const BASE_URL = __ENV.BASE_URL || 'https://subbotin.es';

export const options = {
  stages: [
    { duration: '10s', target: 10 },  // ramp up
    { duration: '40s', target: 10 },  // hold
    { duration: '10s', target: 0 },   // ramp down
  ],
  thresholds: defaultThresholds,
};

export default function () {
  const pages = [
    '/QA-Lab/qa-lab.html',
    '/QA-Lab/index.html',
  ];

  const url = `${BASE_URL}${pages[Math.floor(Math.random() * pages.length)]}`;
  const res = http.get(url);

  check(res, {
    'status 200': (r) => r.status === 200,
    'under 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

### cdn-cold-warm.js
```javascript
// performance/k6/scripts/cdn-cold-warm.js
// Measures cold vs warm CDN hit — single VU, sequential requests
import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://subbotin.es';
const TARGET = `${BASE_URL}/QA-Lab/qa-lab.html`;

export const options = {
  vus: 1,
  iterations: 10,
  thresholds: {
    // Warm cache must be fast — cold hit may be slower
    'http_req_duration{cache:warm}': ['p(95)<200'],
    'http_req_duration{cache:cold}': ['p(95)<1500'],
  },
};

export default function () {
  // First request — potentially cold (CloudFront edge miss)
  const cold = http.get(TARGET, { tags: { cache: 'cold' } });
  check(cold, { 'cold hit 200': (r) => r.status === 200 });

  // Second request — warm (CloudFront edge hit)
  const warm = http.get(TARGET, { tags: { cache: 'warm' } });
  check(warm, { 'warm hit 200': (r) => r.status === 200 });
}
```

---

## 7. CI Integration — Add to Existing Pipeline

Add a new job to `.github/workflows/ci.yml` in the parent repo.
Do NOT modify existing Playwright jobs.

```yaml
  performance:
    name: k6 SLO Check
    runs-on: ubuntu-latest
    needs: test          # run after Playwright tests pass
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v4

      - name: Setup k6
        uses: grafana/setup-k6-action@v1

      - name: Run smoke performance test
        run: k6 run performance/k6/scripts/slo-smoke.js
        env:
          BASE_URL: https://subbotin.es

      - name: Run baseline performance test
        if: github.ref == 'refs/heads/main'
        run: k6 run performance/k6/scripts/slo-baseline.js
        env:
          BASE_URL: https://subbotin.es

      - name: Upload k6 summary
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: k6-results
          path: '**/k6-summary.json'
          retention-days: 14
```

---

## 8. Infrastructure Setup — Step by Step

### Step 1: Verify k6 locally

```bash
# macOS
brew install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring \
  --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
  --keyserver hkp://keyserver.ubuntu.com:80 \
  --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] \
  https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6

# Verify
k6 version   # 0.51+
```

### Step 2: Create directory structure

```bash
# From repo root
mkdir -p performance/k6/scripts
```

### Step 3: Create files per Section 6

### Step 4: Run locally

```bash
# Smoke test
k6 run performance/k6/scripts/slo-smoke.js

# With explicit base URL
BASE_URL=https://subbotin.es k6 run performance/k6/scripts/slo-smoke.js

# Cold/warm comparison
k6 run performance/k6/scripts/cdn-cold-warm.js
```

### Step 5: Optional — Grafana Cloud

```
1. Register at grafana.com/auth/sign-up/create-user (free, no card)
2. Navigate to: grafana.com → My Account → Grafana Cloud → k6
3. Get API token from: app.k6.io → Settings → API Token
4. Add to GitHub Secrets: K6_CLOUD_TOKEN
5. Add to CI step env: K6_CLOUD_TOKEN: ${{ secrets.K6_CLOUD_TOKEN }}
6. Run with: k6 run --out cloud performance/k6/scripts/slo-baseline.js
7. Screenshot the Grafana dashboard → embed in README
```

---

## 9. README.md for performance/k6/

```markdown
# QA Lab — k6 Performance Tests

SLO compliance testing for the QA Lab static site (S3 + CloudFront).

## What this tests

This target is a CDN-served static site. Performance tests measure SLO compliance,
not capacity. The CDN does not degrade under portfolio-scale load by design.

**What we assert:**
- p95 response time < 500ms (warm cache)
- p99 response time < 1000ms
- Error rate < 1%
- Cold vs warm CDN hit comparison

## Run locally

    k6 run scripts/slo-smoke.js
    k6 run scripts/slo-baseline.js
    k6 run scripts/cdn-cold-warm.js

## Why k6 here

k6 uses a JavaScript DSL — native to this repo's TypeScript/Node ecosystem.
The same team, the same pipeline, zero context switch.
Scale-up to production means changing VU counts and thresholds, not changing tools.

## Known limitations

CDN targets do not exhibit application-layer degradation.
For degradation curves and capacity testing, see:
- player-api-performance (JMeter vs Railway/ASP.NET Core)
- rem-waste-performance (Locust vs Vercel/Next.js)
```

---

## 10. Definition of Done

```
□ k6 version verified locally (0.51+)
□ All 3 scripts run locally — thresholds pass
□ performance/k6/README.md written with honest scope
□ CI job added — does not break existing Playwright jobs
□ CI runs k6 smoke on every push, baseline on main only
□ Commit message: perf(k6): add SLO compliance tests for QA Lab CDN
```

---

*End of CLAUDE.md*
*Version: 1.0 | Author: Evgenii Subbotin | Augmentation: k6 → qa-lab-playwright*
*May 2026*
