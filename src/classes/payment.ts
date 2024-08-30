import MercadoPagoConfig, { Payment } from "mercadopago";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types";
import { PaymentBody } from "../interfaces/paymentBody";
import { getPublicIP } from "../server/getIp";

export class PaymentMercadoPago {
  private payment?: Payment;
  private max_minutes_to_expiration: number = 15;

  constructor(accessToken: string) {
    const client = new MercadoPagoConfig({
      accessToken,
    });
    this.payment = new Payment(client);
  }

  async create(data: PaymentBody): Promise<PaymentResponse> {
    return new Promise(async (resolve, reject) => {
      try {
        const publicIp = await getPublicIP()
        console.log(publicIp)
        const body: PaymentCreateRequest = {
          transaction_amount: data.price,
          description: data.description,
          payment_method_id: "pix",
          notification_url: `http://${publicIp}:9005/callback`,//cobrancafacil
          date_of_expiration: new Date(
            new Date().getTime() + this.max_minutes_to_expiration * 60 * 1000
          ).toISOString(),
          metadata: {
            guildId: data.guildId,
            channelId: data.channelId,
            memberId: data.memberId,
            createdAt: new Date().toISOString(),
          },
          payer: {
            email: data.email,
          },
        };
        const paymentResponse = await this.payment!.create({ body });
        console.log("Payment created", paymentResponse.id!);
        console.log(paymentResponse)
        resolve(paymentResponse);
      } catch (error) {
        console.error("Error creating payment", error);
        reject(error);
      }
    });
  }
}
