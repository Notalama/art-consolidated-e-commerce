export type CartItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

export type CartProductInput = Omit<CartItem, 'quantity'>;
