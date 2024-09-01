import { model, Schema } from "mongoose";
import { ProductInterface } from "../interfaces/product.interface";

const productSchema: Schema<ProductInterface> = new Schema({
  guildId: {
    type: String || null,
    required: true,
  },
  id: {
    type: String || null,
    required: true,
  },
  name: {
    type: String || null,
    required: true,
  },
  description: {
    type: String || null,
    default: null,
  },
  oldPrice: {
    type: Number || null,
    default: null,
  },
  price: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number || null,
    default: null,
  },
  thumbnail: {
    type: String || null,
    default: null,
  },
  image: {
    type: String || null,
    default: null,
  },
  color: {
    type: String || null,
    default: null,
  },
  roles: {
    type: [String] || null,
    default: [],
  },
  couponId: {
    type: [String],
    default: null,
  },
  expirationDays: {
    type: Number || null,
    default: 30,
  },
  createdAt: { type: Date, default: new Date() },
});

export const ModelProduct = model("Products", productSchema);
