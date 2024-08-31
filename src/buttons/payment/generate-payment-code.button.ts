import { ButtonInteraction, EmbedBuilder } from "discord.js";
import * as fs from "fs";
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
      email: "caroldinizc21@gmail.com",
      price: totalPrice,
      products: products,
    });

    logger.info("Payment request created successfully");
    logger.info("Creating QR Code image");

    const imageBase64 =
      paymentRequest.point_of_interaction?.transaction_data?.qr_code_base64!;
    const bufferImage = Buffer.from(imageBase64, "base64");
    const nameFileTemp = "temp.png";

    fs.writeFileSync(nameFileTemp, bufferImage);
    logger.info("QR Code image created successfully");

    logger.info("Updating message with QR Code image");

    const embed = interaction.message.embeds[0].data;
    const newEmbed = new EmbedBuilder(embed).setImage(`attachment://${nameFileTemp}`);

    await interaction.message.edit({
      embeds: [newEmbed],
      files: [nameFileTemp],
      components: [],
    });
    await interaction.deferReply();
    await interaction.deleteReply();
    logger.info("Message updated successfully");

    await ModelCart.deleteOne({ channelId: interaction.channelId });
    fs.unlinkSync(nameFileTemp);

    logger.info("Cart and QR Code temp.png deleted successfully");
    //await paymentTemp(paymentRequest);
  } catch (error) {
    logger.error("Error executing generate payment link", error);
  }
}
