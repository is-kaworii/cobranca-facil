export interface ProductInterface {
  id: number;
  name: string;
  description: string | null;
  oldPrice: number | null;
  price: number | null;
  stock: number | null;
  thumbnail: string | null;
  image: string | null;
  color: string | null;
  roles: [{ id: string; raw: number }];
  couponId: string[] | null;
  expirationDays: number | null;
  createdAt: Date;
}
