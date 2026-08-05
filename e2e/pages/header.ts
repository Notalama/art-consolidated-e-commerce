import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class HeaderPage {
  constructor(private readonly page: Page) {}

  siteTitle(): Locator {
    return this.page.getByRole('link', { name: 'Arts Consolidated Store' });
  }

  homeLink(): Locator {
    return this.page.getByRole('navigation').getByRole('link', { name: 'Home' });
  }

  cartLink(): Locator {
    return this.page.getByRole('navigation').getByRole('link', { name: /cart/i });
  }

  cartBadge(): Locator {
    return this.page.getByTestId('cart-badge');
  }

  async expectSiteTitle(title: string) {
    await expect(this.page.getByRole('link', { name: title })).toBeVisible();
  }

  async expectNavLink(name: string, href: string) {
    const link =
      name.toLowerCase() === 'cart'
        ? this.cartLink()
        : this.page.getByRole('navigation').getByRole('link', { name, exact: true });

    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', href);
  }

  async followNavLink(name: string) {
    if (name.toLowerCase() === 'cart') {
      await this.cartLink().click();
      return;
    }

    await this.page.getByRole('navigation').getByRole('link', { name, exact: true }).click();
  }

  async expectCartBadgeHidden() {
    await expect(this.cartBadge()).toHaveCount(0);
  }

  async expectCartBadgeCount(count: number) {
    const badge = this.cartBadge();
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText(String(count));
  }

  async expectUrlPath(path: string) {
    await expect(this.page).toHaveURL(new RegExp(`${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
  }
}
