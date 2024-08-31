import { FeeDetails } from "mercadopago/dist/clients/payment/commonTypes";

export interface PaymentInterface {
  id?: number;
  log_message_id?: string;
  date_created?: string;
  date_aproved?: string | null;
  date_of_expiration?: string | null;
  money_release_date?: string | null;
  operation_type?: string | null;
  payment_method_id?: string | null;
  payment_type_id?: string | null;
  status?: string;
  status_detail?: string | null;
  currency_id?: string | null;
  description?: string | null;
  live_mode?: boolean;
  taxes_amount?: number | null;
  metadata?: {
    guild_id?: string;
    channel_id?: string;
    member_id?: string;
    products?: [];
    created_at?: string;
  };
  transaction_amount?: number | null;
  transaction_amount_refunded?: number | null;
  transaction_details?: {
    payment_method_reference_id?: string | null;
    net_received_amount?: number | null;
    total_paid_amount?: number | null;
    overpaid_amount?: number | null;
    external_resource_url?: string | null;
    installment_amount?: number | null;
    financial_institution?: string | null;
    payable_deferral_period?: string | null;
    acquirer_reference?: string | null;
  } | null;
  fee_details?: FeeDetails[];
  captured?: boolean;
  binary_mode?: boolean;
  call_for_authorize_id?: string | null;
  statement_descriptor?: string | null;
  notification_url?: string | null;
  processing_mode?: string | null;
  acquirer?: string | null;
  point_of_interaction?: {
    sub_type?: string | null;
    application_data?: {
      name?: string | null;
      version?: string | null;
    };
    transaction_data?: {
      ticket_url?: string | null;
    };
  };
  expiraction_date?: string | null;
}
