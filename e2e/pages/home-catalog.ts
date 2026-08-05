import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class HomeCatalogPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  productsHeading(): Locator {
    return this.page.getByRole('heading', { name: /products/i });
  }

  productCards(): Locator {
    return this.page.getByTestId('product-card');
  }

  productCardById(id: number): Locator {
    return this.page.getByTestId(`product-card-${id}`);
  }

  firstProductCard(): Locator {
    return this.productCards().first();
  }

  async expectProductsHeadingVisible() {
    await expect(this.productsHeading()).toBeVisible();
  }

  async expectProductCardCountAtLeast(count: number) {
    await expect.poll(async () => this.productCards().count()).toBeGreaterThanOrEqual(count);
  }

  async expectFirstCardHasTitle() {
    const title = this.firstProductCard().getByTestId('product-card-title');
    await expect(title).toBeVisible();
    await expect(title).not.toHaveText('');
  }

  async expectFirstCardHasImage() {
    const image = this.firstProductCard().getByRole('img');
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('alt', /.+/);
  }

  async expectFirstCardHasPrice() {
    const price = this.firstProductCard().getByTestId('product-card-price');
    await expect(price).toBeVisible();
    await expect(price).toHaveText(/\$\d/);
  }

  async expectFirstCardHasRating() {
    const rating = this.firstProductCard().getByTestId('product-card-rating');
    await expect(rating).toBeVisible();
    await expect(rating).toHaveText(/\d/);
  }

  async openProductCard(id: number) {
    await this.productCardById(id).click();
  }

  async expectUrlPath(path: string) {
    await expect(this.page).toHaveURL(
      new RegExp(`${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`),
    );
  }
}
