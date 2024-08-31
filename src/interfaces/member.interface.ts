export interface MemberInterface {
  memberId: string;
  globalName: string;
  username: string;
  subscriptions: number[] | null; // orderId
  cartId: string | null;
  createdAt: Date;
}
