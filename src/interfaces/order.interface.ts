import { PaymentInterface } from "./payment.interface";
import { ProductInterface } from "./product.interface";

export interface OrderInterface {
  id: string;
  guildId: string;
  memberId: string;
  products: ProductInterface[];
  payments: PaymentInterface[];
  expiration_date: Date;
  createdAt: Date;
}
