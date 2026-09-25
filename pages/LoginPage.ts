import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto(
      'https://practicesoftwaretesting.com/auth/login'
    );
  }

  async login(email: string, password: string) {
    await this.page.locator('[data-test="email"]').fill(email);

    await this.page.locator('[data-test="password"]').fill(password);

    await this.page.locator('[data-test="login-submit"]').click();
  }
}