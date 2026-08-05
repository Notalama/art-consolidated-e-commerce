import { createBdd } from 'playwright-bdd';

import { HomeCatalogPage } from '../pages/home-catalog';

const { When, Then } = createBdd();

When('I visit the home page', async ({ page }) => {
  const home = new HomeCatalogPage(page);
  await home.goto();
});

Then('I should see the products heading', async ({ page }) => {
  const home = new HomeCatalogPage(page);
  await home.expectProductsHeadingVisible();
});

Then('I should see at least {int} product card(s)', async ({ page }, count: number) => {
  const home = new HomeCatalogPage(page);
  await home.expectProductCardCountAtLeast(count);
});

Then('the first product card should show a title', async ({ page }) => {
  const home = new HomeCatalogPage(page);
  await home.expectFirstCardHasTitle();
});

Then('the first product card should show an image', async ({ page }) => {
  const home = new HomeCatalogPage(page);
  await home.expectFirstCardHasImage();
});

Then('the first product card should show a price', async ({ page }) => {
  const home = new HomeCatalogPage(page);
  await home.expectFirstCardHasPrice();
});

Then('the first product card should show a rating', async ({ page }) => {
  const home = new HomeCatalogPage(page);
  await home.expectFirstCardHasRating();
});

When('I open the product card with id {int}', async ({ page }, id: number) => {
  const home = new HomeCatalogPage(page);
  await home.openProductCard(id);
});
