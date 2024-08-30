export interface CartInterface {
  channelId: string;
  messageId: string | null;
  memberId: string | null;
  productsId: { id: String, quant: Number }[];
  createdAt: Date;
}