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
