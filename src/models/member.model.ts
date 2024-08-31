import { model, Schema } from "mongoose";
import { MemberInterface } from "../interfaces/member.interface";

const memberSchema: Schema<MemberInterface> = new Schema({
  memberId: {
    type: String,
    required: true,
    unique: true,
  },
  globalName: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  subscriptions: {
    type: [Number],
    default: [],
  },
  cartId: {
    type: String,
    default: null,
  },
  createdAt: { type: Date, default: Date.now() },
});

export const ModelMember = model("Members", memberSchema);
