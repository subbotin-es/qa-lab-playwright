# QA Lab — Playwright + TypeScript

![Tests](https://github.com/subbotin-es/qa-lab-playwright/actions/workflows/ci.yml/badge.svg)
[![Allure Report](https://img.shields.io/badge/Allure-Report-brightgreen)](https://subbotin-es.github.io/qa-lab-playwright/allure/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.59-green)](https://playwright.dev/)

End-to-end test suite for the [QA Lab](https://subbotin.es/QA-Lab/qa-lab.html) live UI environment, demonstrating production-grade automation engineering: Page Object Model, typed fixtures, parallel cross-browser execution, and CI-generated Allure reports published to GitHub Pages. This is **Stack 1** of the Cross-Stack Series — the same target application is covered by four separate frameworks for comparative analysis.

## Live Allure Report

**[View published report →](https://subbotin-es.github.io/qa-lab-playwright/allure/)**

The report includes per-test steps (via `@step` decorators), failure screenshots, severity labels, and parallel execution timeline.

---

## Stack

| Layer | Technology | Version |
|---|---|---|
| Test runner | Playwright | 1.59+ |
| Language | TypeScript | 6.x |
| Reporting | allure-playwright | 3.x |
| CI/CD | GitHub Actions | — |
| Report hosting | GitHub Pages | — |
| Browsers | Chromium · Firefox · WebKit | bundled |
| Lint | ESLint + @typescript-eslint | v10 / v8 |

---

## Run locally

```bash
npm ci
npx playwright install chromium firefox webkit
npx playwright test --project=chromium
```

Smoke tests only:

```bash
npm run test:smoke
```

Generate and open Allure report:

```bash
npm run report
```

---

## Coverage

| Section | Tests | Tags |
|---|---|---|
| Buttons | 6 | `@smoke` `@regression` |
| Registration Form | 5 | `@smoke` `@regression` |
| Input Fields | 6 | `@smoke` `@regression` |
| Checkboxes & Radio Buttons | 6 | `@smoke` `@regression` |
| Dropdowns | 5 | `@smoke` `@regression` |
| Tables | 6 | `@smoke` `@regression` |
| Alerts & Modals | 6 | `@smoke` `@regression` |
| Dynamic Visibility | 4 | `@smoke` `@regression` |
| Async Button States | 4 | `@smoke` `@regression` |
| IFrame Elements | 4 | `@smoke` `@regression` |
| Drag and Drop | 4 | `@smoke` `@regression` |
| Slider | 4 | `@smoke` `@regression` |
| **Total** | **60** | |

---

## Architecture

```
tests/          — one spec file per UI section
pages/          — Page Object Model, all locators and actions
fixtures/       — base.fixture.ts wires all sections to a single test extend
helpers/        — @step decorator (allure.ts), wait utilities (wait.ts)
types.ts        — shared TypeScript interfaces (RegistrationForm, TableRow, etc.)
```

Key constraints enforced throughout:

- No `waitForTimeout` — all waiting via Playwright auto-retry and `expect` assertions
- No assertions inside Page Objects — objects expose locators and actions only
- `tsc --noEmit` runs before every push — zero errors required
- `@step` decorator on every Page Object method for Allure step recording
- Soft assertions on multi-field form validation checks

---

## Known Limitations

| Topic | Decision | Rationale |
|---|---|---|
| Drag & Drop | HTML5 drag events dispatched via `page.evaluate()` | Playwright's `dragTo()` simulates mouse events; the QA Lab page only listens to `dragstart`/`drop` HTML5 events |
| Slider | Value set via `fill()` | More reliable than mouse simulation for `input[type=range]` |
| Async buttons | State polling via `expect().toHaveText()` | `waitForTimeout` is banned — built-in retry achieves the same result |
| Modal Confirm | Confirm button has no close handler | QA Lab's JS does not wire `#modal-confirm` to close the modal; test documents this explicitly |

---

## CI Pipeline

```
push / PR to main
  └─ npm ci
  └─ tsc --noEmit
  └─ eslint
  └─ playwright install
  └─ playwright test (3 browsers, 4 workers)
  └─ allure generate
  └─ upload artifact (30-day retention)
  └─ deploy to gh-pages → /allure/
```

Weekly regression runs every Monday at 08:00 UTC.

---

## Cross-Stack Series

This project is **Stack 1** of four parallel implementations targeting the same QA Lab UI:
Testing playground: [https://subbotin.es/QA-Lab/qa-lab.html](https://subbotin.es/QA-Lab/qa-lab.html)

| Stack | Framework | Repo |
|---|---|---|
| 1 | **Playwright + TypeScript** <— this project | [qa-lab-playwright](https://github.com/subbotin-es/qa-lab-playwright) |
| 2 | Pytest + Python + Allure | [qa-lab-pytest-python](https://github.com/subbotin-es/qa-lab-pytest-python) |
| 3 | Selenium + Java + TestNG | [qa-lab-selenium-java](https://github.com/subbotin-es/qa-lab-selenium-java)
| 4 | Cypress + JavaScript | coming soon |
| 5 | Playwright + C# + NUnit | [qa-lab-playwright-csharp](https://github.com/subbotin-es/qa-lab-playwright-csharp) 

The series is designed for comparative analysis: same target, same sections, different toolchains.

---

*Author: [Evgenii Subbotin](https://subbotin.es) · QA Lab Cross-Stack Series · Stack 1*
