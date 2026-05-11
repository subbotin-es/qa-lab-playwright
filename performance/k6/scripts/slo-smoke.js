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
