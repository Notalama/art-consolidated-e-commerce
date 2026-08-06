import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/cart');
  }

  emptyMessage(): Locator {
    return this.page.getByTestId('cart-empty-message');
  }

  summaryItemCount(): Locator {
    return this.page.getByTestId('cart-summary-item-count');
  }

  summaryTotal(): Locator {
    return this.page.getByTestId('cart-summary-total');
  }

  line(productId: number): Locator {
    return this.page.getByTestId(`cart-line-${productId}`);
  }

  lineQuantity(productId: number): Locator {
    return this.line(productId).getByTestId('cart-line-quantity');
  }

  removeButton(productId: number): Locator {
    return this.line(productId).getByRole('button', { name: /remove/i });
  }

  async expectEmptyMessageVisible() {
    await expect(this.emptyMessage()).toBeVisible();
    await expect(this.emptyMessage()).not.toHaveText('');
  }

  async expectLineWithQuantity(productId: number, quantity: number) {
    const line = this.line(productId);
    await expect(line).toBeVisible();
    await expect(this.lineQuantity(productId)).toHaveText(String(quantity));
  }

  async expectLineHidden(productId: number) {
    await expect(this.line(productId)).toHaveCount(0);
  }

  async expectSummaryItemCount(count: number) {
    await expect(this.summaryItemCount()).toBeVisible();
    await expect(this.summaryItemCount()).toHaveText(String(count));
  }

  async expectSummaryTotal(amount: number) {
    await expect(this.summaryTotal()).toBeVisible();
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
    await expect(this.summaryTotal()).toHaveText(formatted);
  }

  async removeProduct(productId: number) {
    await this.removeButton(productId).click();
  }
}
