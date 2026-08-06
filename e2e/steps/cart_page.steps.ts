import { createBdd } from 'playwright-bdd';

import { CartPage } from '../pages/cart-page';

const { When, Then } = createBdd();

When('I visit the cart page', async ({ page }) => {
  const cart = new CartPage(page);
  await cart.goto();
});

Then('I should see the empty cart message', async ({ page }) => {
  const cart = new CartPage(page);
  await cart.expectEmptyMessageVisible();
});

Then(
  'I should see a cart line for product id {int} with quantity {int}',
  async ({ page }, productId: number, quantity: number) => {
    const cart = new CartPage(page);
    await cart.expectLineWithQuantity(productId, quantity);
  },
);

Then(
  'I should not see a cart line for product id {int}',
  async ({ page }, productId: number) => {
    const cart = new CartPage(page);
    await cart.expectLineHidden(productId);
  },
);

Then(
  'the cart summary item count should be {int}',
  async ({ page }, count: number) => {
    const cart = new CartPage(page);
    await cart.expectSummaryItemCount(count);
  },
);

Then(
  'the cart summary total should be {float}',
  async ({ page }, amount: number) => {
    const cart = new CartPage(page);
    await cart.expectSummaryTotal(amount);
  },
);

When(
  'I remove product id {int} from the cart page',
  async ({ page }, productId: number) => {
    const cart = new CartPage(page);
    await cart.removeProduct(productId);
  },
);
