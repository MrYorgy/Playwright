import { test, expect } from '@playwright/test';

  test('Task 1 - Search for pliers', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const search = page.getByRole('textbox', { name: /search/i });

    await search.dblclick();
    await search.fill('Pliers');

    await expect(search).toHaveValue('Pliers');

    await page.getByRole('button', { name: /search/i }).click();

    const productTitles = page.locator('.card-title');

    await expect(productTitles).toHaveCount(4);
  });

  test('Task 2 - Filter the catalog to hammers', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const hammerCheckbox = page.getByRole('checkbox', { name: /hammer/i });

    await hammerCheckbox.check();

    await expect(hammerCheckbox).toBeChecked();

    const productTitles = page.locator('.card-title');

    await expect(productTitles).toHaveCount(7);

    await hammerCheckbox.uncheck();

    await expect(hammerCheckbox).not.toBeChecked();
  });

  test('Task 3 - Sort products by name', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const sortDropdown = page.getByRole('combobox', { name: /sort/i });

    await sortDropdown.selectOption({ label: 'Name (A - Z)' });

    const productTitles = page.locator('.card-title');

    await expect(productTitles).toHaveCount(9);

    const firstTitle = productTitles.first();

    await expect(firstTitle).toContainText('Adjustable Wrench');
    await expect(firstTitle).toHaveClass(/card-title/);
  });

  test('Task 4 - Inspect a product and add two items to the cart', async ({
    page,
  }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const combinationPliers = page
      .locator('.card-title')
      .filter({ hasText: 'Combination Pliers' });

    await combinationPliers.click();

    const heading = page.getByRole('heading', {
      name: 'Combination Pliers',
      level: 1,
    });

    await expect(heading).toBeVisible();

    const quantity = page.getByRole('spinbutton', {
      name: /quantity/i,
    });

    await expect(quantity).toHaveValue('1');

    await page
      .getByRole('button', { name: /increase quantity/i })
      .click();

    await expect(quantity).toHaveValue('2');

    await page.getByRole('button', { name: /add to cart/i }).click();

    await expect(page.getByRole('alert')).toContainText(
      'Product added to shopping cart'
    );

    const cartLink = page.getByRole('link', { name: /cart/i });

    await expect(cartLink).toBeVisible();
    await expect(cartLink).toContainText('2');
  });
