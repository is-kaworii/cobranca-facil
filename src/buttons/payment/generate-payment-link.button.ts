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
  try {
    const cartDb = await ModelCart.findOne({ channelId: interaction.channelId });
    const products = await getProducts(interaction);
    const totalPrice = products?.reduce((acc, product) => acc + product.price, 0);

    if (!cartDb || !products || !totalPrice)
      throw new Error("CartDb or Products or TotalPrice not found");

    const paymentRequest = await payment.create({
      description: "Cobrança Fácil",
      channelId: interaction.channelId,
      guildId: interaction.guildId!,
      memberId: interaction.user.id,
      email: "caroldinizc21@gmail.com",
      price: totalPrice,
      products: products,
    });

    const paymentLinkButton = new ButtonBuilder()
      .setURL(paymentRequest.point_of_interaction?.transaction_data?.ticket_url!)
      .setLabel("Link Mercado Pago (Pix)")
      .setStyle(ButtonStyle.Link)
      .setEmoji("🔗");

    const row1: any = new ActionRowBuilder().addComponents(paymentLinkButton);

    await interaction.update({ components: [row1] });
    
    await ModelCart.deleteOne({channelId: interaction.channelId})

    //await paymentTemp(paymentRequest.id!)
    
  } catch (error) {
    logger.error("Error executing generate payment link", error);
  }
}
