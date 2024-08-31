export interface PaymentBody {
  price: number;
  description: string;
  email: string;
  guildId: string;
  channelId: string;
  memberId: string;
  products: {
    id: any;
    name: string;
    price: number;
}[];
}