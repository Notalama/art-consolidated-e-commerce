const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatUsd(amount: number) {
  return currencyFormatter.format(amount);
}

export function getDiscountedPrice(price: number, discountPercentage: number) {
  const clampedDiscount = Math.min(Math.max(discountPercentage, 0), 100);
  const discounted = price * (1 - clampedDiscount / 100);
  return Math.round(discounted * 100) / 100;
}

export function formatDiscountPercent(discountPercentage: number) {
  const value = Math.round(discountPercentage * 100) / 100;
  return `${value}% off`;
}
