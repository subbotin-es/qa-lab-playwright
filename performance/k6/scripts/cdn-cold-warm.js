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
