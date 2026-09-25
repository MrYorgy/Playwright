import { Page, Locator, expect } from '@playwright/test';

class HomePage {
  readonly page: Page;
  readonly cart: Locator;
  readonly sortDropdown: Locator;
  readonly productLinks: Locator;
  readonly prices: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cart = page.locator('[data-test="nav-cart"]');
    this.sortDropdown = page.getByRole('combobox', { name: /sort/i });
    this.productLinks = page.locator('.card-title');
    this.prices = page.locator('[data-test="product-price"]');
  }

  async goto() {
    await this.page.goto('https://practicesoftwaretesting.com/');
  }

  async addItemToCart(productName: string) {
    await this.page.goto('https://practicesoftwaretesting.com/');

    // Find the exact product using its image alt text.
    const product = this.page
      .locator('a.card')
      .filter({
        has: this.page.locator(`img[alt="${productName}"]`),
      })
      .first();

    await expect(product).toBeVisible();

    await product.click();

    const quantity = this.page.getByRole('spinbutton', {
      name: /quantity/i,
    });

    await expect(quantity).toBeVisible();
    await expect(quantity).toHaveValue('1');

    const addToCartButton = this.page.getByRole('button', {
      name: /add to cart/i,
    });

    await expect(addToCartButton).toBeVisible();
    await expect(addToCartButton).toBeEnabled();

    await addToCartButton.click();

    await expect(this.page.getByRole('alert')).toContainText(
      'Product added to shopping cart'
    );

    await expect(this.page.locator('#lblCartCount')).toBeVisible({
      timeout: 10000,
    });
  }

  async removeItemFromCart(productName: string) {
    // Open cart.
    await this.page.locator('[data-test="nav-cart"]').click();

    // Find the exact product row.
    const productRow = this.page.getByRole('row', {
      name: new RegExp(`^${productName}\\s+Quantity for ${productName}\\b`),
    });

    await expect(productRow).toBeVisible();

    // Find the remove button inside that row.
    const removeButton = productRow.locator('a.btn.btn-danger');

    await expect(removeButton).toBeVisible();

    await removeButton.click();

    // Confirm deletion message.
    await expect(this.page.locator('#toast-container')).toContainText(
      'Product deleted.'
    );

    // Confirm that the product row was removed.
    await expect(productRow).toHaveCount(0);
  }

  async expectCartCount(count: number) {
    const cartQuantity = this.page.locator('#lblCartCount');

    await expect(cartQuantity).toBeVisible({
      timeout: 10000,
    });

    await expect(cartQuantity).toHaveText(String(count), {
      timeout: 10000,
    });
  }
}

export default HomePage;