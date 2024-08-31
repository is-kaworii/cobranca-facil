import { EmbedBuilder, TextChannel } from "discord.js";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { Document, Types } from "mongoose";
import { client, logger } from "../..";
import { PaymentInterface } from "../../interfaces/payment.interface";
import { ModelPayment } from "../../models/payment.model";
import { approvedPayment } from "./approved-payment";

type paymentDocument = Document<unknown, {}, PaymentInterface> &
  PaymentInterface & {
    _id: Types.ObjectId;
  };
export async function paymentTemp(data: PaymentResponse) {
  logger.info("PaymentTemp started");
  try {
    let paymentDb = await ModelPayment.findOne({ id: data.id });

    if (paymentDb) {
      paymentDb = (await updatePaymentInDatabase(paymentDb, data)) || null;
    } else {
      paymentDb = (await createPaymentInDatabase(data)) || null;
    }

    if (!paymentDb) throw new Error("PaymentDb not found");
    if (paymentDb.log_message_id) {
      logger.info("Updating payment log message");
      const guildId = paymentDb.metadata?.guild_id;
      const guild = await client.guilds.resolve(guildId!);
      const channel = (await guild?.channels.resolve(
        "1277466443415294052"
      )) as TextChannel;

      const embed = createMessageEmbed(paymentDb);

      const messageId = paymentDb.log_message_id;
      const message = await channel.messages.resolve(messageId!);

      await message?.edit({ content: "API Mercado Pago", embeds: [embed] });
      logger.info("Updated payment log message successfully");
    } else {
      logger.info("Creating payment log message");
      const guildId = paymentDb.metadata?.guild_id;
      const guild = await client.guilds.resolve(guildId!);
      const channel = (await guild?.channels.resolve(
        "1277466443415294052"
      )) as TextChannel;

      const embed = createMessageEmbed(paymentDb);

      const message = await channel.send({
        content: "API Mercado Pago",
        embeds: [embed],
      });

      paymentDb.log_message_id = message.id;
      await paymentDb.save();

      logger.info("Created payment log message successfully");
    }

    if (data.status === "approved") {
      await approvedPayment(data);
    }
  } catch (error) {
    logger.error("Error executing payment Processing", error);
  }
}

function createMessageEmbed(payment: paymentDocument) {
  logger.info("Creating message embed");
  const embed = new EmbedBuilder()
    .setTitle("LOG DE VENDA")
    .setTimestamp(new Date())
    .setFields([
      {
        name: "ID da venda",
        value: `${payment.id}`,
        inline: true,
      },
      {
        name: "ID do comprador",
        value: `<@${payment.metadata?.member_id}>`,
        inline: true,
      },
      {
        name: "Live Mode",
        value: payment.live_mode ? "Produção" : "Teste",
        inline: true,
      },
      {
        name: "Data de criação",
        value: `${payment.date_created?.replace("T", " ").split(".")[0]} UTC`,
        inline: true,
      },
      {
        name: "Data de aprovação",
        value: `${payment.date_aproved?.replace("T", " ").split(".")[0]} UTC`,
        inline: true,
      },
      {
        name: "Data de expiração",
        value: `${payment.date_of_expiration?.replace("T", " ").split(".")[0]} UTC`,
        inline: true,
      },
      {
        name: "Status",
        value: `${payment.status?.toUpperCase()}`,
        inline: true,
      },
      {
        name: "Detalhes de Status",
        value: `${payment.status_detail?.toUpperCase()}`,
        inline: true,
      },
      {
        name: "Metodo de pagamento",
        value: `${payment.payment_method_id?.toUpperCase()}`,
        inline: true,
      },
      {
        name: "Valor Transação",
        value: convetToRealString(payment.transaction_amount),
        inline: true,
      },
      {
        name: "Valor Refunded",
        value: convetToRealString(payment.transaction_amount_refunded),
        inline: true,
      },
      {
        name: "Valor Recebido",
        value: convetToRealString(payment.transaction_details?.net_received_amount),
        inline: true,
      },
      {
        name: "Taxas",
        value: convetToRealString(payment.taxes_amount),
        inline: false,
      },
      {
        name: "Produtos",
        value: `${payment.metadata?.products
          ?.map((product: { name: string }) => product.name)
          .join("\n")}`,
        inline: false,
      },
    ]);

  switch (payment.status) {
    case "pending":
      embed.setColor("Yellow");
      break;
    case "approved":
      embed.setColor(`#00ff00`);
      break;
    case "authorized":
      embed.setColor(`#00ff80`);
      break;
    case "in_process":
      embed.setColor(`#ffff00`);
      break;
    case "in_mediation":
      embed.setColor(`#ffff00`);
      break;
    case "rejected":
      embed.setColor(`#ff0000`);
      break;
    case "cancelled":
      embed.setColor(`#808080`);
      break;
    case "refunded":
      embed.setColor(`#0000ff`);
      break;
    case "charged_back":
      embed.setColor(`#0000ff`);
      break;
    default:
      embed.setColor(`#000000`);
  }
  logger.info("Message embed created successfully");
  return embed;
}

function convetToRealString(amount: number | null | undefined) {
  return (
    amount?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) || "R$ 0.00"
  );
}

async function updatePaymentInDatabase(
  paymentDb: paymentDocument,
  data: PaymentResponse
) {
  logger.info("Updating payment in database");
  try {
    paymentDb.id = data.id;
    paymentDb.date_created = data.date_created;
    paymentDb.date_aproved = data.date_approved;
    paymentDb.date_of_expiration = data.date_of_expiration;
    paymentDb.money_release_date = data.money_release_date;
    paymentDb.operation_type = data.operation_type;
    paymentDb.payment_method_id = data.payment_method_id;
    paymentDb.payment_type_id = data.payment_type_id;
    paymentDb.status = data.status;
    paymentDb.status_detail = data.status_detail;
    paymentDb.currency_id = data.currency_id;
    paymentDb.description = data.description;
    paymentDb.live_mode = data.live_mode;
    paymentDb.taxes_amount = data.taxes_amount;
    paymentDb.metadata = data.metadata;
    paymentDb.transaction_amount = data.transaction_amount;
    paymentDb.transaction_amount_refunded = data.transaction_amount_refunded;
    paymentDb.transaction_details = {
      payment_method_reference_id: data.transaction_details?.payment_method_reference_id,
      net_received_amount: data.transaction_details?.net_received_amount,
      total_paid_amount: data.transaction_details?.total_paid_amount,
      overpaid_amount: data.transaction_details?.overpaid_amount,
      external_resource_url: data.transaction_details?.external_resource_url,
      installment_amount: data.transaction_details?.installment_amount,
      financial_institution: data.transaction_details?.financial_institution,
      payable_deferral_period: data.transaction_details?.payable_deferral_period,
      acquirer_reference: data.transaction_details?.acquirer_reference,
    };
    paymentDb.fee_details = data.fee_details;
    paymentDb.captured = data.captured;
    paymentDb.binary_mode = data.binary_mode;
    paymentDb.call_for_authorize_id = data.call_for_authorize_id;
    paymentDb.statement_descriptor = data.statement_descriptor;
    paymentDb.notification_url = data.notification_url;
    paymentDb.processing_mode = data.processing_mode;
    paymentDb.point_of_interaction!.sub_type = data.point_of_interaction?.sub_type;
    paymentDb.point_of_interaction!.application_data = {
      name: data.point_of_interaction?.application_data?.name,
      version: data.point_of_interaction?.application_data?.version,
    };
    paymentDb.point_of_interaction!.transaction_data!.ticket_url =
      data.point_of_interaction?.transaction_data?.ticket_url;

    await paymentDb.save();
    logger.info("Payment updated successfully");
    return paymentDb;
  } catch (error) {
    logger.error("Error updating payment in database", error);
  }
}

async function createPaymentInDatabase(data: PaymentResponse) {
  logger.info("Creating payment in database");
  try {
    const paymentDb = new ModelPayment({
      id: data.id,
      log_message_id: null,
      date_created: data.date_created,
      date_aproved: data.date_approved,
      date_of_expiration: data.date_of_expiration,
      money_release_date: data.money_release_date,
      operation_type: data.operation_type,
      payment_method_id: data.payment_method_id,
      payment_type_id: data.payment_type_id,
      status: data.status,
      status_detail: data.status_detail,
      currency_id: data.currency_id,
      description: data.description,
      live_mode: data.live_mode,
      taxes_amount: data.taxes_amount,
      metadata: data.metadata,
      transaction_amount: data.transaction_amount,
      transaction_amount_refunded: data.transaction_amount_refunded,
      transaction_details: {
        payment_method_reference_id:
          data.transaction_details?.payment_method_reference_id,
        net_received_amount: data.transaction_details?.net_received_amount,
        total_paid_amount: data.transaction_details?.total_paid_amount,
        overpaid_amount: data.transaction_details?.overpaid_amount,
        external_resource_url: data.transaction_details?.external_resource_url,
        installment_amount: data.transaction_details?.installment_amount,
        financial_institution: data.transaction_details?.financial_institution,
        payable_deferral_period: data.transaction_details?.payable_deferral_period,
        acquirer_reference: data.transaction_details?.acquirer_reference,
      },
      fee_details: data.fee_details,
      captured: data.captured,
      binary_mode: data.binary_mode,
      call_for_authorize_id: data.call_for_authorize_id,
      statement_descriptor: data.statement_descriptor,
      notification_url: data.notification_url,
      processing_mode: data.processing_mode,
      point_of_interaction: {
        sub_type: data.point_of_interaction?.sub_type,
        application_data: {
          name: data.point_of_interaction?.application_data?.name,
          version: data.point_of_interaction?.application_data?.version,
        },
        transaction_data: {
          ticket_url: data.point_of_interaction?.transaction_data?.ticket_url,
        },
      },
    });

    await paymentDb.save();
    logger.info("Payment created successfully");
    return paymentDb;
  } catch (error) {
    logger.error("Error creating payment in database", error);
  }
}
