import { createBdd } from 'playwright-bdd';
import { HeaderPage } from '../pages/header';

const { When, Then } = createBdd();

Then('I should see the site title {string}', async ({ page }, title: string) => {
  const header = new HeaderPage(page);
  await header.expectSiteTitle(title);
});

Then(
  'I should see a navigation link {string} to {string}',
  async ({ page }, name: string, href: string) => {
    const header = new HeaderPage(page);
    await header.expectNavLink(name, href);
  },
);

Then('the cart badge should not be visible', async ({ page }) => {
  const header = new HeaderPage(page);
  await header.expectCartBadgeHidden();
});

Then('the cart badge should show {int}', async ({ page }, count: number) => {
  const header = new HeaderPage(page);
  await header.expectCartBadgeCount(count);
});

When('I follow the navigation link {string}', async ({ page }, name: string) => {
  const header = new HeaderPage(page);
  await header.followNavLink(name);
});

Then('the page URL should be {string}', async ({ page }, path: string) => {
  const header = new HeaderPage(page);
  await header.expectUrlPath(path);
});
