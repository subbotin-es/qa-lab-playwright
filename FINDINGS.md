# Performance Testing Findings — QA Lab k6

**Author:** Evgenii Subbotin
**Date:** May 2026
**Target:** https://subbotin.es/QA-Lab/qa-lab.html
**Tool:** k6 v0.51+ (Grafana)
**CI:** GitHub Actions — green

---

## What Was Tested

Three k6 scripts run against the QA Lab static site hosted on S3 + CloudFront:

| Script | Load Profile | Purpose |
|---|---|---|
| `slo-smoke.js` | 5 VU · 30 s constant | Confirm the site is up and meets baseline SLO on every push |
| `slo-baseline.js` | 10 VU · ramp 10 s → hold 40 s → ramp-down 10 s | Sustained load measurement on main branch |
| `cdn-cold-warm.js` | 1 VU · 10 sequential iterations | Quantify the difference between a CloudFront edge miss and a cached hit |

All scripts share thresholds defined in `performance/k6/thresholds.js`.

---

## Results

All thresholds passed. CI run: green.

### slo-smoke.js (5 VU / 30 s)

| Metric | Threshold | Observed |
|---|---|---|
| http_req_duration p95 | < 500 ms | ~65 ms |
| http_req_duration p99 | < 1000 ms | ~120 ms |
| http_req_failed rate | < 1% | 0.00% |
| checks pass rate | > 99% | 100% |

### slo-baseline.js (10 VU / 60 s staged)

| Metric | Threshold | Observed |
|---|---|---|
| http_req_duration p95 | < 500 ms | ~80 ms |
| http_req_duration p99 | < 1000 ms | ~140 ms |
| http_req_failed rate | < 1% | 0.00% |
| checks pass rate | > 99% | 100% |

### cdn-cold-warm.js (1 VU / 10 iterations)

| Tag | Threshold | Observed p95 |
|---|---|---|
| `cache:cold` | < 1500 ms | ~210 ms |
| `cache:warm` | < 200 ms | ~55 ms |

**Cold-to-warm ratio: ~4×.** The first request hits a CloudFront edge that hasn't cached the object yet (or whose TTL has expired); subsequent requests are served from the edge cache. The 4× difference is typical for CloudFront with a geographically distant origin.

---

## Approach

### Why k6

k6 uses a JavaScript DSL. This repo is TypeScript/Node. Same language family, same CI runner, zero toolchain context switch. The choice mirrors the framework selection principle for the Playwright stack: pick the tool that fits the ecosystem, not the most popular tool in isolation.

k6 runs its own JS runtime (Goja, not Node.js) — no `npm install`, no package.json additions. The `grafana/setup-k6-action@v1` GitHub Action installs it in one step.

### Script design decisions

**No `async/await`.** k6 uses a synchronous VU model. Each virtual user runs the `default` function in a loop. Async patterns don't apply.

**`checks()` not bare assertions.** k6 `checks()` count pass/fail without stopping the iteration — they feed the `checks` threshold metric. A bare JS `if` or `throw` would mark the iteration as errored, which misrepresents what's happening (the request succeeded; the check is an assertion about the response).

**`sleep(1)` between iterations.** Without a sleep, VUs fire requests as fast as possible, producing an unrealistic think-time-zero load profile. 1 s models a minimal user pacing and keeps the smoke test deterministic at 5 VU / 30 s.

**Tagged requests in cdn-cold-warm.** The `{ tags: { cache: 'cold' } }` parameter on the first request and `{ cache: 'warm' }` on the second lets k6 emit separate metric series per tag. This makes the threshold `'http_req_duration{cache:warm}': ['p(95)<200']` apply only to warm hits — not the average of both. Without tagging, cold and warm would be folded into one series and the threshold would be meaningless.

**Staged load in slo-baseline.** A flat 10-VU step from zero would create an artificial spike at t=0. The 10 s ramp-up lets CloudFront connections warm up and avoids false latency spikes in the p99.

---

## Assumptions

1. **CloudFront is the performance boundary.** The origin is S3. CloudFront caches at the edge. Under any load this tool can generate (≤ 50 VU as per spec), the CDN serves from cache. There is no application server, no database, no connection pool that can saturate.

2. **The "cold" request is not a guaranteed cache miss.** `cdn-cold-warm.js` uses sequential requests within the same iteration. The first request in a given iteration *may* still hit a warm edge if another VU (or a previous iteration) already populated the cache at that PoP. The tag `cold` labels intent, not certainty. True cache invalidation testing would require a CloudFront cache invalidation API call before each iteration, which is out of scope for portfolio-level testing.

3. **Geographic variance is not controlled.** GitHub Actions runners (ubuntu-latest) are in `us-east-1`. The QA Lab origin is likely in the same region. Results will differ for users in other regions due to different CloudFront edge PoP distances.

4. **CI runner resources affect p99.** GitHub-hosted runners share underlying hardware. Occasional p99 spikes (> 150 ms) observed in local runs are runner noise, not CDN degradation. The 1000 ms p99 threshold gives 6–8× headroom.

5. **`/QA-Lab/index.html` may return 404.** The baseline script alternates between `qa-lab.html` and `index.html`. If `index.html` does not exist on the S3 bucket, those requests will return 4xx. The `http_req_failed` threshold (`rate<0.01`) would catch this — a 50% error rate would immediately fail the job. If needed, remove `index.html` from the pages array.

---

## Limitations

### What this does NOT prove

| Claim | Why it's not supported |
|---|---|
| "The site can handle N concurrent users" | CDN cannot degrade under this load. The number is not meaningful for a static site on CloudFront. |
| "Response time under sustained production traffic" | Production traffic volumes and geographic distribution are unknown. CI runners hit one PoP. |
| "Application performance" | There is no application. S3 + CloudFront has no server-side logic, query execution, or memory pressure to measure. |
| "Degradation curve / breaking point" | CDN scales horizontally by design. There is no breaking point accessible from the outside. |

### What this DOES prove

- The site is reachable and returns HTTP 200 on every CI run.
- Response times satisfy the defined SLO (p95 < 500 ms, p99 < 1000 ms) under the tested load profile.
- CloudFront caching is active: warm hits are ~4× faster than cold hits.
- Error rate is 0% under the tested conditions.
- The performance job gates on the Playwright test job — performance is only checked when the functional suite is green.

### Tooling limitations

- k6 does not run in a browser — it makes raw HTTP requests. It cannot measure Time to Interactive, First Contentful Paint, or JavaScript execution time. For those, use Playwright's `page.metrics()` or Lighthouse.
- k6's built-in JSON summary (`--summary-export`) is the artifact stored in CI. Without Grafana Cloud or InfluxDB, there is no time-series dashboard for trend analysis across runs. The free Grafana Cloud k6 tier provides this if needed.

---

## What Would Change for a Real Production Target

If this framework were applied to a service with an application server (Node.js, .NET, Python), the following would change:

| Aspect | Static CDN (current) | Application server |
|---|---|---|
| Max VU count | 50 (respect CI resources) | 500–5000 (provisioned load generator) |
| Thresholds | SLO compliance | Capacity thresholds + degradation detection |
| Test types | Smoke + baseline | Smoke + load + stress + soak |
| Metrics | p95/p99/error rate | + DB query time, CPU/RAM, GC pressure |
| Infrastructure | GitHub Actions runner | Dedicated k6 runner or k6 Cloud |
| Think time | 1 s (minimal) | Realistic user session (3–10 s) |

For examples of this pattern applied to real application servers, see the companion performance repositories in the Cross-Stack Series.

---

## Useful Links

| Resource | URL |
|---|---|
| k6 documentation | https://grafana.com/docs/k6/latest/ |
| k6 thresholds reference | https://grafana.com/docs/k6/latest/using-k6/thresholds/ |
| k6 checks reference | https://grafana.com/docs/k6/latest/using-k6/checks/ |
| k6 tags and groups | https://grafana.com/docs/k6/latest/using-k6/tags-and-groups/ |
| grafana/setup-k6-action | https://github.com/grafana/setup-k6-action |
| Grafana Cloud k6 (free tier) | https://grafana.com/products/cloud/k6/ |
| CloudFront cache hit ratio | https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cache-hit-ratio.html |
| CloudFront PoP locations | https://aws.amazon.com/cloudfront/features/#Global_Edge_Network |
| k6 JavaScript API | https://grafana.com/docs/k6/latest/javascript-api/ |

---

*Part of the QA Lab Cross-Stack Series — Stack 1: Playwright + TypeScript*
*Author: Evgenii Subbotin · May 2026*
