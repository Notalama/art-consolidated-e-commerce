import { createBdd, DataTable } from 'playwright-bdd';
import { CartStorePage } from '../pages/cart-store';

const { Given, When, Then } = createBdd();

Given('the cart store is ready', async ({ page }) => {
  const cartStore = new CartStorePage(page);
  const url = page.url();

  if (!url || url === 'about:blank') {
    await cartStore.goto();
  }

  await cartStore.waitUntilReady();
});

Given('the cart is empty', async ({ page }) => {
  const cartStore = new CartStorePage(page);
  await cartStore.clearCart();
});

Given(
  'the cart contains a product with id {int} titled {string} priced at {float} with quantity {int}',
  async ({ page }, id: number, title: string, price: number, quantity: number) => {
    const cartStore = new CartStorePage(page);
    await cartStore.seedItem({ id, title, price, quantity });
  },
);

Given('the cart contains the following products:', async ({ page }, table: DataTable) => {
  const cartStore = new CartStorePage(page);
  const products = table.hashes().map((row) => ({
    id: Number(row.id),
    title: row.title,
    price: Number(row.price),
    quantity: Number(row.quantity),
  }));

  await cartStore.seedItems(products);
});

When(
  'I add a product with id {int} titled {string} priced at {float}',
  async ({ page }, id: number, title: string, price: number) => {
    const cartStore = new CartStorePage(page);
    await cartStore.addItem({ id, title, price });
  },
);

When('I remove the product with id {int} from the cart', async ({ page }, id: number) => {
  const cartStore = new CartStorePage(page);
  await cartStore.removeItem(id);
});

When('I reload the page', async ({ page }) => {
  const cartStore = new CartStorePage(page);
  await cartStore.reload();
});

Then('the cart should contain {int} unique product(s)', async ({ page }, count: number) => {
  const cartStore = new CartStorePage(page);
  await cartStore.expectUniqueProductCount(count);
});

Then('the cart should be empty', async ({ page }) => {
  const cartStore = new CartStorePage(page);
  await cartStore.expectEmpty();
});

Then(
  'the item with id {int} should have quantity {int}',
  async ({ page }, id: number, quantity: number) => {
    const cartStore = new CartStorePage(page);
    await cartStore.expectItemQuantity(id, quantity);
  },
);

Then('the total item count should be {int}', async ({ page }, count: number) => {
  const cartStore = new CartStorePage(page);
  await cartStore.expectTotalItems(count);
});

Then('the total price should be {float}', async ({ page }, amount: number) => {
  const cartStore = new CartStorePage(page);
  await cartStore.expectTotalPrice(amount);
});

Then('local storage should contain the key {string}', async ({ page }, key: string) => {
  const cartStore = new CartStorePage(page);
  await cartStore.expectLocalStorageKey(key);
});
