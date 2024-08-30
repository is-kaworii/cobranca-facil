import { model, Schema } from "mongoose";
import { CartInterface } from "../interfaces/cart.interface";

const cartShema: Schema<CartInterface> = new Schema({
  channelId: { type: String, required: true },
  messageId: { type: String },
  memberId: { type: String },
  productsId: { type: [{ id: String, quant: Number }], default: [] },
  createdAt: { type: Date, required: true, default: Date.now() },
});

export const ModelCart = model("Cart", cartShema);
