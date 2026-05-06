# CLAUDE.md — QA Lab: Playwright + TypeScript + Allure

> **This file is the authoritative specification for Claude Code.**
> Read it completely before writing any test, any config, any fixture.
> Every architectural decision documented here has a rationale — don't override without explicit instruction.
> When in doubt — ask. Do not invent test cases. Do not skip Page Object layers.

**Author:** Evgenii Subbotin
**Project:** QA Lab Cross-Stack Series — Stack 1: Playwright + TypeScript
**Target:** https://subbotin.es/QA-Lab/qa-lab.html
**Stack:** Playwright · TypeScript · Allure Report · GitHub Actions · GitHub Pages
**Version:** 1.0 | April 2026

---

## 1. What This Project Does

Isolated Playwright + TypeScript test framework targeting the QA Lab live environment.
Demonstrates modern automation engineering practices: Page Object Model, typed fixtures, parallel execution, and CI-generated Allure reports published to GitHub Pages.

**This is portfolio artefact #1 in the Cross-Stack Series:**
```
Same target (qa-lab.html) → different stacks → comparative analysis
Stack 1: Playwright + TS    ← this project
Stack 2: Pytest + Python
Stack 3: Selenium + Java + TestNG
Stack 4: Cypress + JS
```

**Test coverage scope:**
```
Buttons          → click states, disabled state assertion
Forms            → validation, field interaction, submit
Input Fields     → text, number, date, search, URL types
Checkboxes       → check/uncheck, disabled state
Radio Buttons    → selection, mutual exclusivity
Dropdowns        → single select, multi-select
Tables           → cell content, row count, edit action
Alerts/Modals    → open, confirm, cancel, dismiss
Dynamic Visibility → checkbox-triggered panel reveal
Async Buttons    → loading → success/error state transitions
IFrames          → context switching, inner element interaction
Drag & Drop      → item reorder, drop zone validation
Slider           → value change assertion
Text Area        → input and content validation
```

---

## 2. Absolute Rules — Read Before Every Task

```
NEVER use CSS selectors alone — prefer data-testid, ARIA roles, or text locators
NEVER hardcode base URLs — always use BASE_URL from playwright.config.ts
NEVER write test logic inside page objects — page objects expose actions, not assertions
NEVER use page.waitForTimeout() — use auto-waiting locators or explicit conditions
NEVER commit .env files — use .env.example as template
NEVER use any TypeScript type unless unavoidable — type everything explicitly
NEVER skip the @smoke tag on core happy-path tests
ALWAYS run npx tsc --noEmit before pushing — zero errors required
ALWAYS use fixtures for shared page setup — never duplicate beforeEach blocks
ALWAYS attach screenshots on failure — configured in playwright.config.ts
ALWAYS use Allure step decorators (@step) on all Page Object methods
ALWAYS use soft assertions for multi-field form validation checks
ALWAYS keep each test file to one logical UI section (one file per page section)
```

---

## 3. Tech Stack

| Layer | Technology | Version | Why |
|---|---|---|---|
| Test runner | Playwright | 1.44+ | Auto-waiting, real browsers, native TS support |
| Language | TypeScript | 5.x | Compile-time safety, IDE completion |
| Reporting | allure-playwright | 3.x | Rich HTML reports, steps, screenshots, history |
| CI/CD | GitHub Actions | current | Free 2000 min/month, native secrets |
| Report hosting | GitHub Pages | current | Free, automatic from Actions artifact |
| Browser | Chromium (primary) + Firefox + WebKit | bundled | Cross-browser coverage from one codebase |
| Lint | ESLint + @typescript-eslint | current | Enforce no-any, no-floating-promises |

**No Selenium. No Jest. No extra test libraries.**
Budget target: $0/month (all free tiers).

---

## 4. Repository Structure

```
qa-lab-playwright/
├── tests/
│   ├── buttons.spec.ts
│   ├── forms.spec.ts
│   ├── inputs.spec.ts
│   ├── checkboxes.spec.ts
│   ├── dropdowns.spec.ts
│   ├── tables.spec.ts
│   ├── modals.spec.ts
│   ├── dynamic-visibility.spec.ts
│   ├── async-buttons.spec.ts
│   ├── iframes.spec.ts
│   ├── drag-and-drop.spec.ts
│   └── slider.spec.ts
├── pages/
│   ├── QALabPage.ts              # Base page — navigation, shared locators
│   ├── ButtonsSection.ts
│   ├── FormsSection.ts
│   ├── InputsSection.ts
│   ├── CheckboxesSection.ts
│   ├── DropdownsSection.ts
│   ├── TablesSection.ts
│   ├── ModalsSection.ts
│   ├── DynamicVisibilitySection.ts
│   ├── AsyncButtonsSection.ts
│   ├── IFrameSection.ts
│   └── DragDropSection.ts
├── fixtures/
│   └── base.fixture.ts           # Custom fixture: page + all section objects
├── helpers/
│   ├── allure.ts                 # @step decorator wrapper
│   └── wait.ts                   # Custom wait helpers (no waitForTimeout)
├── .github/
│   └── workflows/
│       └── ci.yml                # lint → tsc → test → allure → gh-pages
├── allure-results/               # Raw Allure output (git-ignored)
├── allure-report/                # Generated HTML (git-ignored)
├── playwright.config.ts
├── tsconfig.json
├── .eslintrc.json
├── .env.example
├── package.json
└── README.md
```

---

## 5. TypeScript Types — Define First

Create `types.ts` before any page objects or tests.

```typescript
// types.ts

export interface QALabConfig {
  baseUrl: string;
  headless: boolean;
  slowMo: number;
}

// Button states observed in async button tests
export type AsyncButtonState = 'default' | 'loading' | 'success' | 'error';

// Table row shape matching QA Lab table
export interface TableRow {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
}

// Dropdown option
export interface SelectOption {
  value: string;
  label: string;
}

// Form registration data
export interface RegistrationForm {
  fullName: string;
  email: string;
  age: number;
  phone: string;
}

// Drag and drop item
export interface DragItem {
  label: string;
  index: number;
}
```

---

## 6. playwright.config.ts — Exact Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: [
    ['list'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: true,
    }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://subbotin.es',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

---

## 7. Base Fixture — Single Setup Point

```typescript
// fixtures/base.fixture.ts
import { test as base } from '@playwright/test';
import { QALabPage } from '../pages/QALabPage';
import { FormsSection } from '../pages/FormsSection';
import { ModalsSection } from '../pages/ModalsSection';
import { IFrameSection } from '../pages/IFrameSection';
// ... other sections

type QALabFixtures = {
  qaLab: QALabPage;
  forms: FormsSection;
  modals: ModalsSection;
  iframes: IFrameSection;
  // ... extend with all sections
};

export const test = base.extend<QALabFixtures>({
  qaLab: async ({ page }, use) => {
    const qaLab = new QALabPage(page);
    await qaLab.goto();
    await use(qaLab);
  },
  forms: async ({ page }, use) => {
    await use(new FormsSection(page));
  },
  modals: async ({ page }, use) => {
    await use(new ModalsSection(page));
  },
  iframes: async ({ page }, use) => {
    await use(new IFrameSection(page));
  },
});

export { expect } from '@playwright/test';
```

---

## 8. Page Object Pattern — Exact Standard

Every Page Object must follow this pattern. No exceptions.

```typescript
// pages/FormsSection.ts
import { Page, Locator } from '@playwright/test';
import { step } from '../helpers/allure';

export class FormsSection {
  readonly page: Page;

  // Locators — defined as readonly class properties
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly ageInput: Locator;
  readonly phoneInput: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fullNameInput = page.locator('input[placeholder="Full Name"]');
    this.emailInput    = page.locator('input[type="email"]').first();
    this.ageInput      = page.locator('input[type="number"]').first();
    this.phoneInput    = page.locator('input[type="tel"]');
    this.registerButton = page.getByRole('button', { name: 'Register' });
  }

  // Actions — decorated with @step for Allure
  @step('Fill registration form')
  async fillForm(data: { fullName: string; email: string; age: number; phone: string }): Promise<void> {
    await this.fullNameInput.fill(data.fullName);
    await this.emailInput.fill(data.email);
    await this.ageInput.fill(String(data.age));
    await this.phoneInput.fill(data.phone);
  }

  @step('Submit registration form')
  async submit(): Promise<void> {
    await this.registerButton.click();
  }

  // NO assertions in page objects — return locators, let tests assert
}
```

---

## 9. Allure Annotations — Mandatory

All tests must carry Allure metadata:

```typescript
// tests/forms.spec.ts
import { test, expect } from '../fixtures/base.fixture';
import { allure } from 'allure-playwright';

test.describe('Registration Form', () => {
  test.beforeEach(async ({ qaLab }) => {
    await qaLab.scrollToSection('#forms');
  });

  test('should submit form with valid data', {
    tag: ['@smoke', '@forms'],
  }, async ({ forms }) => {
    await allure.feature('Forms');
    await allure.story('Registration');
    await allure.severity('critical');

    await forms.fillForm({
      fullName: 'John Doe',
      email: 'john@example.com',
      age: 30,
      phone: '+1234567890',
    });
    await forms.submit();

    // assertions here, not in page object
    await expect(forms.registerButton).toBeVisible();
  });

  test('should validate required fields on empty submit', {
    tag: ['@regression', '@forms'],
  }, async ({ forms }) => {
    await allure.feature('Forms');
    await allure.story('Validation');
    await allure.severity('normal');

    await forms.submit();
    // soft assertions for multi-field check
    await expect.soft(forms.fullNameInput).toBeFocused();
  });
});
```

---

## 10. IFrame Handling

QA Lab has an embedded iframe. Always use `frameLocator` — never `page.frames()`.

```typescript
// pages/IFrameSection.ts
import { Page, FrameLocator, Locator } from '@playwright/test';
import { step } from '../helpers/allure';

export class IFrameSection {
  readonly frame: FrameLocator;
  readonly innerHeading: Locator;

  constructor(page: Page) {
    // Target the iframe by its position in the section — adjust selector to match actual HTML
    this.frame = page.frameLocator('#iframes iframe');
    this.innerHeading = this.frame.locator('h1, h2, h3').first();
  }

  @step('Get iframe inner text')
  async getInnerText(): Promise<string> {
    return this.innerHeading.innerText();
  }
}
```

---

## 11. Async Button State Testing

The QA Lab async buttons cycle: `default → loading → success/error`. Test all transitions.

```typescript
// Pattern for async state testing — no waitForTimeout
async waitForState(locator: Locator, expectedText: string): Promise<void> {
  await expect(locator).toHaveText(expectedText, { timeout: 10_000 });
}
```

---

## 12. CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: QA Lab — Playwright Tests + Allure Report

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 8 * * 1'   # Monday 08:00 UTC — weekly regression

jobs:
  test:
    name: Run Playwright Tests
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: TypeScript check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium firefox webkit

      - name: Run tests
        run: npx playwright test
        env:
          BASE_URL: https://subbotin.es

      - name: Generate Allure Report
        if: always()
        run: npx allure generate allure-results --clean -o allure-report

      - name: Upload Allure Report artifact
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-report
          path: allure-report/
          retention-days: 30

      - name: Deploy Allure to GitHub Pages
        if: github.ref == 'refs/heads/main' && always()
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./allure-report
          destination_dir: allure
```

---

## 13. Infrastructure Setup — Step by Step

Complete this before writing any test code.

### Step 1: Accounts & Prerequisites

**GitHub** (existing account):
- Repo: `qa-lab-playwright` — create at https://github.com/new
- Enable GitHub Pages: Settings → Pages → Source: `gh-pages` branch

No other accounts needed. Zero paid services.

### Step 2: Install Local Tooling

```bash
# Node.js 20 LTS
# Via nvm: nvm install 20 && nvm use 20

# Verify
node --version    # 20.x
npm --version     # 10.x

# Create and enter project directory
mkdir qa-lab-playwright && cd qa-lab-playwright
npm init -y
```

### Step 3: Install Dependencies

```bash
# Core
npm install --save-dev \
  @playwright/test \
  typescript \
  allure-playwright \
  allure-commandline

# TypeScript tooling
npm install --save-dev \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint

# Install browsers
npx playwright install chromium firefox webkit

# Verify
npx playwright --version
```

### Step 4: tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["tests/**/*", "pages/**/*", "fixtures/**/*", "helpers/**/*", "*.ts"],
  "exclude": ["node_modules", "dist", "allure-results", "allure-report"]
}
```

### Step 5: package.json scripts

```json
{
  "scripts": {
    "test": "playwright test",
    "test:smoke": "playwright test --grep @smoke",
    "test:chromium": "playwright test --project=chromium",
    "test:headed": "playwright test --headed",
    "allure:generate": "allure generate allure-results --clean -o allure-report",
    "allure:open": "allure open allure-report",
    "allure:serve": "allure serve allure-results",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext .ts",
    "report": "npm run allure:generate && npm run allure:open"
  }
}
```

### Step 6: GitHub Repository Setup

```bash
git init
cat > .gitignore << 'EOF'
node_modules/
dist/
allure-results/
allure-report/
playwright-report/
test-results/
.env
.DS_Store
EOF

git add .
git commit -m "chore: initial setup — Playwright + TS + Allure"
git remote add origin https://github.com/YOUR_USERNAME/qa-lab-playwright.git
git push -u origin main
```

### Step 7: Enable GitHub Pages

```
GitHub repo → Settings → Pages
Source: Deploy from a branch
Branch: gh-pages / root
Save

Allure report will be available at:
https://YOUR_USERNAME.github.io/qa-lab-playwright/allure/
```

### Step 8: Verify Local Run

```bash
# Run smoke tests against live QA Lab
npm run test:smoke

# Generate and open report
npm run report

# TypeScript check — must be zero errors
npm run typecheck
```

---

## 14. Allure Report — What to Show in Portfolio

The published Allure report at GitHub Pages is a portfolio artefact. Ensure it contains:

```
□ Test suite breakdown by section (Buttons, Forms, IFrames, etc.)
□ Screenshots attached on every failure
□ @severity labels: critical, normal, minor
□ @feature and @story labels matching QA Lab sections
□ Test duration and parallel execution evidence
□ Pass rate badge in README (use shields.io with GitHub Actions status)
```

README badge:
```markdown
![Tests](https://github.com/YOUR_USERNAME/qa-lab-playwright/actions/workflows/ci.yml/badge.svg)
[![Allure Report](https://img.shields.io/badge/Allure-Report-brightgreen)](https://YOUR_USERNAME.github.io/qa-lab-playwright/allure/)
```

---

## 15. Known Limitations & Trade-offs

Document these explicitly — they demonstrate engineering judgment:

| Topic | Decision | Rationale |
|---|---|---|
| Drag & Drop | Mouse-event simulation only | Playwright doesn't natively support HTML5 drag events in all cases |
| IFrame source | External domain iframe may be cross-origin blocked | Document and skip with `test.skip` + reason |
| Slider | Value set via `fill()` not drag | More reliable than mouse simulation for input[type=range] |
| Async buttons | Polling via `expect().toHaveText()` | `waitForTimeout` is banned — use built-in retry |

---

## 16. Definition of Done — Per Task

```
□ npx tsc --noEmit — zero errors
□ npm run lint — zero warnings
□ Test has @feature, @story, @severity Allure annotations
□ Test has at minimum one assertion
□ Page Object method has @step decorator
□ No waitForTimeout anywhere in diff
□ Smoke tests pass locally before push
□ Commit message: test(section-name): describe what is tested
```

---

## 17. Day-by-Day Prompts for Claude Code

### DAY 1 PROMPT — Infrastructure + Config

```
Read CLAUDE.md Sections 13, 6, 7 completely before starting.

Goal: Project scaffolding complete, zero test code.

Tasks in order:
1. Verify node --version (20.x required)
2. Create directory qa-lab-playwright, run npm init -y
3. Install all dependencies from Section 13 Step 3
4. Create playwright.config.ts (Section 6 — exact config)
5. Create tsconfig.json (Section 13 Step 4)
6. Create .eslintrc.json
7. Create package.json scripts (Section 13 Step 5)
8. Create directory structure: tests/ pages/ fixtures/ helpers/
9. Create types.ts (Section 5)
10. Create helpers/allure.ts — @step decorator
11. Create fixtures/base.fixture.ts skeleton (Section 7)
12. Create .gitignore

After completing:
- npx playwright --version → shows version
- npx tsc --noEmit → zero errors (no test files yet, that's fine)

Do NOT write any test files today.
```

---

### DAY 2 PROMPT — Page Objects

```
Read CLAUDE.md Sections 8, 10, 11 before starting.

Goal: All Page Objects created, no test files yet.

Implement in this order (one file per section):
1. pages/QALabPage.ts — goto(), scrollToSection(), navigation locators
2. pages/ButtonsSection.ts — all button locators + click actions
3. pages/FormsSection.ts — exact pattern from Section 8
4. pages/InputsSection.ts — all input types
5. pages/CheckboxesSection.ts — check, uncheck, isChecked()
6. pages/DropdownsSection.ts — selectByValue(), getSelected()
7. pages/TablesSection.ts — getRow(index), getCellText(row, col)
8. pages/ModalsSection.ts — open(), confirm(), cancel()
9. pages/DynamicVisibilitySection.ts — toggle(), isPanelVisible()
10. pages/AsyncButtonsSection.ts — click(), waitForState()
11. pages/IFrameSection.ts — exact pattern from Section 10
12. pages/DragDropSection.ts — dragItem(), getDropZoneItems()
13. Update fixtures/base.fixture.ts with all sections (Section 7)

After each file: npx tsc --noEmit — fix all errors before continuing.
```

---

### DAY 3 PROMPT — Test Files

```
Read CLAUDE.md Sections 9, 15, 16 before starting.

Goal: All test files written and passing locally.

Write tests in this order:
1. tests/buttons.spec.ts — primary button, disabled state, danger button
2. tests/forms.spec.ts — valid submit, empty submit validation
3. tests/inputs.spec.ts — all 5 input types
4. tests/checkboxes.spec.ts — check/uncheck, disabled state
5. tests/dropdowns.spec.ts — single select, multi-select
6. tests/tables.spec.ts — row count, cell content, edit button
7. tests/modals.spec.ts — open, confirm, cancel
8. tests/dynamic-visibility.spec.ts — checkbox reveals panel
9. tests/async-buttons.spec.ts — all 3 button state cycles
10. tests/iframes.spec.ts — inner element accessible
11. tests/drag-and-drop.spec.ts — item moves to drop zone
12. tests/slider.spec.ts — value change

Every test: @feature, @story, @severity + at least one expect().
Run after each file: npm run test:chromium -- tests/that-file.spec.ts
```

---

### DAY 4 PROMPT — CI, Allure, README

```
Goal: CI green, Allure published to GitHub Pages, README portfolio-ready.

Tasks:
1. Create .github/workflows/ci.yml (Section 12)
2. Push to main → verify Actions run
3. Verify Allure deploys to gh-pages branch
4. Check report at https://YOUR_USERNAME.github.io/qa-lab-playwright/allure/
5. Write README.md:
   - What this project demonstrates (2 sentences)
   - Live Allure Report link
   - Stack table
   - How to run locally (3 commands)
   - Coverage table (which sections are tested)
   - Known limitations (Section 15)
   - Part of Cross-Stack Series note with links to other stacks

Final checklist:
□ GitHub Actions badge green
□ Allure report live at GitHub Pages URL
□ All tests passing in CI
□ README has live report link
□ npx tsc --noEmit zero errors in CI logs
```

---

## 18. Common Errors and How to Fix Them

**`Error: page.goto: net::ERR_NAME_NOT_RESOLVED`**
→ BASE_URL is wrong. Check `.env` file and `playwright.config.ts` baseURL value.

**`Error: strict mode violation — locator resolved to N elements`**
→ Locator is not unique. Add `.first()` or narrow selector with more context.

**`waitForTimeout is not a function` or lint error**
→ Correct — `waitForTimeout` is banned. Use `await expect(locator).toBeVisible()` or `toHaveText()`.

**`Error: Frame not found`**
→ IFrame not loaded yet. Add `await page.waitForSelector('iframe')` before `frameLocator()`.

**`tsc error: Decorator metadata not supported`**
→ Add `"experimentalDecorators": true, "emitDecoratorMetadata": true` to `tsconfig.json`.

**`Allure report is empty / no tests shown`**
→ Check `allure-results/` directory exists after test run. Verify `allure-playwright` is in reporter array in config.

**`GitHub Pages shows 404`**
→ Pages source not set to `gh-pages` branch. Settings → Pages → verify branch and folder.

**`Tests fail in CI but pass locally`**
→ Usually timing. Add `retries: 2` in `playwright.config.ts` for CI. Check for hardcoded localhost URLs.

**`Drag and drop does not work`**
→ QA Lab uses HTML5 drag events. Try `page.dragAndDrop()` first; if that fails, use mouse event simulation and document the workaround in Known Limitations.

---

## 19. Branching Strategy

```
main      → production (triggers CI + Allure deploy)
feat/     → new test sections
fix/      → broken test fixes
chore/    → config, dependency updates
```

Commit message format: `type(scope): description`
Types: `test`, `fix`, `chore`, `docs`, `refactor`
Examples:
- `test(forms): add validation edge cases`
- `fix(iframes): update frameLocator after QA Lab DOM change`
- `chore(deps): bump playwright to 1.45`

---

*End of CLAUDE.md*
*Version: 1.0 | Author: Evgenii Subbotin | Project: QA Lab Cross-Stack Series — Stack 1*
*April 2026*
