import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { logger } from "../..";
import { ModelCart } from "../../models/cart.model";
import { ModelProduct } from "../../models/product.model";

export async function execute(interaction: ButtonInteraction) {
  try {
    const messages = await await interaction.channel?.messages.fetch({ limit: 100 });
    if (!messages) return;

    messages.each(async (message) => {
      await message.delete();
    });

    const products = await getProducts(interaction);
    const totalPrice = products?.reduce((acc, product) => acc + product.price, 0);

    const embed = new EmbedBuilder()
      .setTitle("Checkout e Envio")
      .setDescription(
        "Confira as informações sobre os produtos e escolha a forma que deseja pagar."
      )
      .setColor("White")
      .setFields([
        {
          name: "Valor Total: ",
          value: totalPrice!.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          inline: false,
        },
      ]);

    products?.forEach((product) => {
      embed.addFields({
        name: `${product.name}:`,
        value: product.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        inline: false,
      });
    });

    const paymentLink = new ButtonBuilder()
      .setCustomId("generatePaymentLinkButton")
      .setLabel("Gerar Link de Pagamento")
      .setEmoji("🔗")
      .setStyle(ButtonStyle.Secondary);
    const paymentCode = new ButtonBuilder()
      .setCustomId("generatePaymentCodeButton")
      .setLabel("Gerar QR Code")
      .setEmoji("📱")
      .setStyle(ButtonStyle.Secondary);
    const row1: any = new ActionRowBuilder().addComponents(paymentLink, paymentCode);

    await interaction.channel?.send({
      embeds: [embed],
      components: [row1],
    });
  } catch (error) {
    logger.error("Error executing go to payment", error);
  }
}

export async function getProducts(interaction: ButtonInteraction) {
  const cart = await ModelCart.findOne({ channelId: interaction.channelId });
  const productsCart = cart?.productsId;

  if (!cart || !productsCart) return;

  let products = [];
  for (let i = 0; i < productsCart.length; i++) {
    const productDb = await ModelProduct.findOne({ id: productsCart[i].id });

    if (productDb)
      products.push({ id: productDb.id, name: productDb.name, price: productDb.price }); //
  }

  return products;
}
