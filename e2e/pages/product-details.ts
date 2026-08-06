import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { getFixtureProduct } from '../fixtures/products';

const firstFixtureProduct = getFixtureProduct(1);

export class ProductDetailsPage {
  constructor(private readonly page: Page) {}

  async goto(id: number | string) {
    await this.page.goto(`/products/${id}`);
  }

  title(): Locator {
    return this.page.getByTestId('product-details-title');
  }

  image(): Locator {
    return this.page.getByTestId('product-details-image').getByRole('img');
  }

  description(): Locator {
    return this.page.getByTestId('product-details-description');
  }

  price(): Locator {
    return this.page.getByTestId('product-details-price');
  }

  discount(): Locator {
    return this.page.getByTestId('product-details-discount');
  }

  rating(): Locator {
    return this.page.getByTestId('product-details-rating');
  }

  addToCartButton(): Locator {
    return this.page.getByRole('button', { name: 'Add to Cart' });
  }

  alreadyInCartLink(): Locator {
    return this.page.getByRole('link', { name: 'Already in cart' });
  }

  async expectTitleVisible() {
    await expect(this.title()).toBeVisible();
    await expect(this.title()).toHaveText(firstFixtureProduct.title);
  }

  async expectImageVisible() {
    await expect(this.image()).toBeVisible();
    await expect(this.image()).toHaveAttribute('alt', firstFixtureProduct.title);
  }

  async expectDescriptionVisible() {
    await expect(this.description()).toBeVisible();
    await expect(this.description()).toHaveText(firstFixtureProduct.description);
  }

  async expectPriceVisible() {
    await expect(this.price()).toBeVisible();
    await expect(this.price()).toHaveText(/\$\d/);
  }

  async expectDiscountVisible() {
    await expect(this.discount()).toBeVisible();
    await expect(this.discount()).toHaveText(/%/);
  }

  async expectRatingVisible() {
    await expect(this.rating()).toBeVisible();
    await expect(this.rating()).toHaveText(/\d/);
  }

  async expectAddToCartVisible() {
    await expect(this.addToCartButton()).toBeVisible();
  }

  async expectAddToCartHidden() {
    await expect(this.addToCartButton()).toHaveCount(0);
  }

  async expectAlreadyInCartVisible() {
    await expect(this.alreadyInCartLink()).toBeVisible();
    await expect(this.alreadyInCartLink()).toHaveAttribute('href', '/cart');
  }

  async followAlreadyInCart() {
    await this.alreadyInCartLink().click();
  }

  async expectNotFoundPage() {
    await expect(this.page.getByRole('heading', { name: /not found/i })).toBeVisible();
  }
}
