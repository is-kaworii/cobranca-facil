export interface MemberInterface {
  memberId: string;
  globalName: string;
  username: string;
  subscriptions: string[]; // orderId
  cart: {
    messageId: string | null;
    productsId: string[]; // productsId
  };
  createdAt: Date;
}
