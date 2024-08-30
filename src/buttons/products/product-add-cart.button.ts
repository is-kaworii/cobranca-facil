import { ActionRowBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, TextChannel } from "discord.js";
import { logger } from "../..";
import { buttonCreator } from "../../modals/product/product.modal";
import { ModelProduct } from "../../models/product.model";
import { getOrCreateCart } from "./add-cart/createCart";

export async function execute(interaction: ButtonInteraction) {
  try {
    const cart = await getOrCreateCart(interaction);
    const productId = interaction.message.id;

    if (cart?.productsId.map(product => product.id).includes(productId)) {
      await interaction.reply({ content: "Item já está no carrinho!", ephemeral: true });
      return;
    } else {
      const productDb = await ModelProduct.findOne({ id: productId });
      const channel = (await interaction.guild?.channels.resolve(
        cart?.channelId!
      )) as TextChannel;
      if (!channel || !productDb) throw new Error("Channel or productDb not found");

      const embed = new EmbedBuilder()
        .setTitle(productDb.name)
        .setDescription(`Código do produto: ${productId}`)
        .setColor(`#${productDb.color}` === "#null" ? null : `#${productDb.color}`)
        .setThumbnail(productDb.thumbnail)
        .setFields([
          {
            name: "💵 | Preço unitário:",
            value: productDb.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'}),
          },
          {
            name: "🛒 | Quantidade:",
            value: "1",
          },
          {
            name: "💰 | Valor total:",
            value: productDb.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'}),
          },
        ]);

      const deleteCart = await buttonCreator(
        "DeleteCart",
        null,
        "✖️",
        ButtonStyle.Danger
      );
      const row1: any = new ActionRowBuilder().addComponents(deleteCart);

      await channel.send({ embeds: [embed], components: [row1] });

      await interaction.reply({
        content: "Item adicionado ao carrinho!",
        ephemeral: true,
      });
      cart?.productsId.push({id: productId, quant: 1});
      await cart?.save();
      return;
    }
  } catch (error) {
    const messageError = logger.error(
      `Error executing ${interaction.customId} button`,
      error
    );
    await interaction.reply({ content: messageError });
  }
}
