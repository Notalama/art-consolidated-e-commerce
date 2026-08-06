import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

import { ProductDetailsPage } from '../pages/product-details';

const { When, Then } = createBdd();

When(
  'I visit the product details page for id {int}',
  async ({ page }, id: number) => {
    const details = new ProductDetailsPage(page);
    await details.goto(id);
  },
);

Then('I should see the product details title', async ({ page }) => {
  const details = new ProductDetailsPage(page);
  await details.expectTitleVisible();
});

Then('I should see the product details image', async ({ page }) => {
  const details = new ProductDetailsPage(page);
  await details.expectImageVisible();
});

Then('I should see the product details description', async ({ page }) => {
  const details = new ProductDetailsPage(page);
  await details.expectDescriptionVisible();
});

Then('I should see the product details price', async ({ page }) => {
  const details = new ProductDetailsPage(page);
  await details.expectPriceVisible();
});

Then('I should see the product details discount', async ({ page }) => {
  const details = new ProductDetailsPage(page);
  await details.expectDiscountVisible();
});

Then('I should see the product details rating', async ({ page }) => {
  const details = new ProductDetailsPage(page);
  await details.expectRatingVisible();
});

Then('I should see the {string} button', async ({ page }, name: string) => {
  await expect(page.getByRole('button', { name })).toBeVisible();
});

Then('I should not see the {string} button', async ({ page }, name: string) => {
  await expect(page.getByRole('button', { name })).toHaveCount(0);
});

Then('I should see the {string} link', async ({ page }, name: string) => {
  await expect(page.getByRole('link', { name })).toBeVisible();
});

When('I click the {string} button', async ({ page }, name: string) => {
  await page.getByRole('button', { name }).click();
});

When('I follow the {string} link', async ({ page }, name: string) => {
  await page.getByRole('link', { name }).click();
});

Then('I should see the not found page', async ({ page }) => {
  const details = new ProductDetailsPage(page);
  await details.expectNotFoundPage();
});
