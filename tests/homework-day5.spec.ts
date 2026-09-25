import fs from 'fs';
import { expect, test } from '../fixtures';
import { LoginPage } from '../pages/LoginPage';

// ============================================================
// TASK 1 - Create a logged in fixture
// ============================================================

test('logged in fixture opens account page', async ({ loggedInPage }) => {
  await expect(loggedInPage).toHaveURL(/\/account/);

  await expect(
    loggedInPage.getByRole('heading', { name: 'My account' })
  ).toBeVisible();
});

// ============================================================
// TASK 2 - Use all Playwright hooks
// ============================================================

test.describe('catalog hooks', () => {
  test.beforeAll(() => {
    console.log(`Catalog suite started: ${new Date().toISOString()}`);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({
        path: testInfo.outputPath('failure.png'),
        fullPage: true,
      });
    }
  });

  test.afterAll(() => {
    console.log(`Catalog suite finished: ${new Date().toISOString()}`);
  });

  test('catalog page loads', async ({ page }) => {
    await expect(page).toHaveURL(
      /https:\/\/practicesoftwaretesting\.com\/?$/
    );

    await expect(
      page.getByRole('link', { name: 'Home' })
    ).toBeVisible();
  });
});

// ============================================================
// TASK 3 - Drive login tests from CSV
// ============================================================

type LoginCase = {
  name: string;
  email: string;
  password: string;
  expectedResult: string;
};

const csvPath = 'test-data/login-cases.csv';

const lines = fs
  .readFileSync(csvPath, 'utf-8')
  .trim()
  .split(/\r?\n/);

const headers = lines[0].split(',');

if (
  headers[0].trim() !== 'name' ||
  headers[1].trim() !== 'email' ||
  headers[2].trim() !== 'password' ||
  headers[3].trim() !== 'expectedResult'
) {
  throw new Error(
    'CSV header must be: name,email,password,expectedResult'
  );
}

const loginCases: LoginCase[] = lines.slice(1).map((line) => {
  const values = line.split(',');

  return {
    name: values[0].trim(),
    email: values[1].trim(),
    password: values[2].trim(),
    expectedResult: values[3].trim().toLowerCase(),
  };
});

for (const loginCase of loginCases) {
  test(`CSV login - ${loginCase.name}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(
      loginCase.email,
      loginCase.password
    );

    // SUCCESS
    if (loginCase.expectedResult === 'success') {
      await expect(page).toHaveURL(/\/account/);

      await expect(
        page.getByRole('heading', { name: 'My account' })
      ).toBeVisible();
    }

    // FAILURE
    else if (loginCase.expectedResult === 'failure') {
      await expect(page.locator('body')).toContainText(
        /Invalid email or password/i
      );
    }

    // INVALID CSV VALUE
    else {
      throw new Error(
        `Unknown expectedResult "${loginCase.expectedResult}" for ${loginCase.name}`
      );
    }
  });
}