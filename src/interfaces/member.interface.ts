export interface MemberInterface {
  memberId: string;
  globalName: string;
  username: string;
  subscriptions: string[]; // orderId
  cartId: string | null;
  createdAt: Date;
}
