export interface ProductInterface {
  guildId: string;
  id: number;
  name: string;
  description: string | null;
  oldPrice: number | null;
  price: number;
  stock: number | null;
  thumbnail: string | null;
  image: string | null;
  color: string | null;
  roles: string[];
  couponId: string[] | null;
  expirationDays: number | null;
  createdAt: Date;
}
