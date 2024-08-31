import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
} from "discord.js";
import { logger } from "../..";
import { PaymentMercadoPago } from "../../classes/payment";
import { ModelCart } from "../../models/cart.model";
import { getProducts } from "../products/product-go-to-payment.button";

const payment = new PaymentMercadoPago(process.env.accessToken!);

export async function execute(interaction: ButtonInteraction) {
  logger.init({ interaction });
  try {
    const cartDb = await ModelCart.findOne({ channelId: interaction.channelId });
    const products = await getProducts(interaction);
    const totalPrice = products?.reduce((acc, product) => acc + product.price, 0) || 0;

    if (!cartDb || !products) throw new Error("CartDb or Products not found");

    logger.info("Creating request payment on Mercado Pago");

    const paymentRequest = await payment.create({
      description: "Cobrança Fácil",
      channelId: interaction.channelId,
      guildId: interaction.guildId!,
      memberId: interaction.user.id,
      email: "juniorronaldi919@gmail.com",
      price: totalPrice,
      products: products,
    });

    logger.info("Payment request created successfully");
    logger.info("Updating message with button link");

    const paymentLinkButton = new ButtonBuilder()
      .setURL(paymentRequest.point_of_interaction?.transaction_data?.ticket_url!)
      .setLabel("Link Mercado Pago (Pix)")
      .setStyle(ButtonStyle.Link)
      .setEmoji("🔗");

    const row1: any = new ActionRowBuilder().addComponents(paymentLinkButton);

    await interaction.update({ components: [row1] });
    logger.info("Message updated successfully");

    await ModelCart.deleteOne({ channelId: interaction.channelId });
    logger.info("Cart deleted successfully");
    //await paymentTemp(paymentRequest);
  } catch (error) {
    logger.error("Error executing generate payment link", error);
  }
}
