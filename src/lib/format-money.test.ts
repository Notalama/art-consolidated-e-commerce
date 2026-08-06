import { describe, expect, it } from 'vitest';

import {
  formatDiscountPercent,
  formatUsd,
  getDiscountedPrice,
} from '@/lib/format-money';

describe('formatUsd', () => {
  it('formats amounts as USD currency', () => {
    expect(formatUsd(9.99)).toBe('$9.99');
    expect(formatUsd(0)).toBe('$0.00');
    expect(formatUsd(25.5)).toBe('$25.50');
  });
});

describe('getDiscountedPrice', () => {
  it('applies a percentage discount and rounds to cents', () => {
    expect(getDiscountedPrice(100, 10)).toBe(90);
    expect(getDiscountedPrice(9.99, 10.48)).toBe(8.94);
  });

  it('clamps discount percentage below 0 to 0', () => {
    expect(getDiscountedPrice(50, -20)).toBe(50);
  });

  it('clamps discount percentage above 100 to 100', () => {
    expect(getDiscountedPrice(50, 150)).toBe(0);
  });
});

describe('formatDiscountPercent', () => {
  it('formats discount labels', () => {
    expect(formatDiscountPercent(10)).toBe('10% off');
    expect(formatDiscountPercent(10.48)).toBe('10.48% off');
  });
});
