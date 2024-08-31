import { EmbedBuilder, TextChannel } from "discord.js";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { Document, Types } from "mongoose";
import { client, logger } from "../..";
import { PaymentInterface } from "../../interfaces/payment.interface";
import { ModelPayment } from "../../models/payment.model";

const clientConfig = new MercadoPagoConfig({ accessToken: process.env.accessToken! });
const payment = new Payment(clientConfig);

type paymentDocument = Document<unknown, {}, PaymentInterface> &
  PaymentInterface & {
    _id: Types.ObjectId;
  };
export async function paymentTemp(paymentId: number) {
  try {
    payment
      .get({ id: paymentId })
      .then(async (data) => {
        const paymentDb = await getOrCreatePaymentInDatabase(data);
        if (!paymentDb) return;
        if (!paymentDb.log_message_id) await createLogMessage(paymentDb);
        else {
          await updateLogMessage(paymentDb);
        }
      })
      .catch(console.error);
  } catch (error) {
    logger.error("Error executing payment Processing", error);
  }
}

async function updateLogMessage(payment: paymentDocument) {
  try {
    console.log(payment.metadata);
    const guild = await client.guilds.resolve(payment.metadata.guild_id);
    const channel = (await guild?.channels.resolve("1277466443415294052")) as TextChannel;

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
          value: `<@${payment.metadata.member_id}>`,
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
          value: `${payment.metadata.products
            .map((product: { name: string }) => product.name)
            .join("\n ")}`,
          inline: false,
        },
      ]);

    const message = await channel.messages.resolve(payment.log_message_id);

    await message?.edit({ content: "API Mercado Pago", embeds: [embed] });
  } catch (error) {
    logger.error("Error creating log message", error);
  }
}

async function createLogMessage(payment: paymentDocument) {
  try {
    console.log(payment.metadata);
    const guild = await client.guilds.resolve(payment.metadata.guild_id);
    const channel = (await guild?.channels.resolve("1277466443415294052")) as TextChannel;

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
          value: `<@${payment.metadata.member_id}>`,
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
          value: `${payment.metadata.products
            .map((product: { name: string }) => product.name)
            .join("\n ")}`,
          inline: false,
        },
      ]);

    await channel
      .send({ content: "API Mercado Pago", embeds: [embed] })
      .then((message) => {
        payment.log_message_id = message.id;
      })
      .catch(console.error);
  } catch (error) {
    logger.error("Error creating log message", error);
  }
}

function convetToRealString(amount: number | null | undefined) {
  return (
    amount?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) || "R$ 0.00"
  );
}

async function getOrCreatePaymentInDatabase(data: PaymentResponse) {
  try {
    let paymentDb = await ModelPayment.findOne({ id: data.id });

    if (paymentDb) {
      return paymentDb;
    } else {
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
      return paymentDb;
    }
  } catch (error) {
    logger.error("Error creating payment in database", error);
  }
}
