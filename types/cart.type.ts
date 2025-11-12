import type { ProductVariant, Money } from './product.type';

export type Cart = {
  id: string;
  checkoutUrl: string;
  lines: CartLine[];
  estimatedCost: Money;
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: ProductVariant;
  cost: Money;
};
