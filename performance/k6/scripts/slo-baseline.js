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
