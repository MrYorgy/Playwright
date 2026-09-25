import { Page } from '@playwright/test';
import { test as base, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

type Fixtures = {
  loggedInPage: Page;
};

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(
      'customer@practicesoftwaretesting.com',
      'welcome01'
    );

    await use(page);
  },
});

export { expect };