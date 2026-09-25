import { test, expect } from '@playwright/test';
import HomePage from '../pages/HomePage';

test.describe('Homework 3 | POM', () => {

  test('Adding item - add Combination Pliers and Bolt Cutters', async ({ page }) => {
    const homePage = new HomePage(page);

    // Cart is initially empty.
    await expect(page.locator('#lblCartCount')).toHaveCount(0);

    await homePage.addItemToCart('Combination Pliers');
    await homePage.addItemToCart('Bolt Cutters');

    await homePage.expectCartCount(2);
  });

  test('Removing item - remove one product from the cart', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.addItemToCart('Combination Pliers');
    await homePage.addItemToCart('Pliers');

    await homePage.expectCartCount(2);

    await homePage.removeItemFromCart('Pliers');

    await homePage.expectCartCount(1);
  });

});