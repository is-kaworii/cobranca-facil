import { model, Schema } from "mongoose";
import { PaymentInterface } from "../interfaces/payment.interface";

const paymentSchema: Schema<PaymentInterface> = new Schema({
  id: { type: Number, required: true, unique: true },
  log_message_id: { type: String },
  date_created: { type: String, required: true },
  date_aproved: { type: String },
  date_of_expiration: { type: String },
  money_release_date: { type: String },
  operation_type: { type: String },
  payment_method_id: { type: String },
  payment_type_id: { type: String },
  status: { type: String },
  status_detail: { type: String },
  currency_id: { type: String },
  description: { type: String },
  live_mode: { type: Boolean },
  taxes_amount: { type: Number },
  metadata: {
    type: Object,
  },
  transaction_amount: { type: Number },
  transaction_amount_refunded: { type: Number },
  transaction_details: {
    type: {
      payment_method_reference_id: { type: String },
      net_received_amount: { type: Number },
      total_paid_amount: { type: Number },
      overpaid_amount: { type: Number },
      external_resource_url: { type: String },
      installment_amount: { type: String },
      financial_institution: { type: String },
      payable_deferral_period: { type: String },
      acquirer_reference: { type: String },
    },
  },
  fee_details: {
    type: [
      {
        type: { type: String },
        amount: { type: Number },
        fee_payer: { type: String },
      },
    ],
  },
  captured: { type: Boolean },
  binary_mode: { type: Boolean },
  call_for_authorize_id: { type: String },
  statement_descriptor: { type: String },
  notification_url: { type: String },
  processing_mode: { type: String },
  acquirer: { type: String },
  point_of_interaction: {
    type: {
      sub_type: { type: String },
      application_data: {
        name: { type: String },
        version: { type: String },
      },
      transaction_data: {
        ticket_url: { type: String },
      },
    },
  },
});

export const ModelPayment = model("Payments", paymentSchema);
