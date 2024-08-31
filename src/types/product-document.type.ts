import { Document, Types } from "mongoose";
import { ProductInterface } from "../interfaces/product.interface";

export type ProductDocument = (Document<unknown, {}, ProductInterface> & ProductInterface & {
  _id: Types.ObjectId;
})