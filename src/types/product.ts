export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  thumbnail: string;
  images: string[];
};

export type ProductResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};
