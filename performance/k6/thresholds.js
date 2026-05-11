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
