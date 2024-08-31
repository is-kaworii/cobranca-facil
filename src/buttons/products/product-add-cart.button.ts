import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { logger } from "../..";
import { ModelProduct } from "../../models/product.model";
import { ProductDocument } from "../../types/product-document.type";
import { loggerErrorProductButton } from "../../utils/loggerErrorProductButton";
import { getOrCreateCart } from "./add-cart/createCart";

export async function execute(interaction: ButtonInteraction) {
  logger.init({ interaction });
  try {
    const cart = await getOrCreateCart(interaction);
    const productId = interaction.message.id;

    // se já tem o produto no carrinho
    if (cart?.productsId.map((product) => product.id).includes(productId)) {
      logger.info("Sending reply message");
      const channel = (await interaction.guild?.channels.resolve(
        cart?.channelId!
      )) as TextChannel;

      if (!channel) throw new Error("Channel or productDb not found");

      const embedReply = createMessageReplyEmbed("Produto já adicionado ao carrinho!");
      const componentsReply = createMessageReplyComponents(channel);

      await interaction.reply({
        embeds: [embedReply],
        components: componentsReply,
        ephemeral: true,
      });
      logger.info("Message replied successfully");
      return;
      // se não tem o produto no carrinho
    } else {
      logger.info("Sending reply message");
      const productDb = await ModelProduct.findOne({ id: productId });
      const channel = (await interaction.guild?.channels.resolve(
        cart?.channelId!
      )) as TextChannel;
      if (!channel || !productDb) throw new Error("Channel or productDb not found");
      logger.info(`Sending message on channel ${channel?.name}`);

      const embed = createMessageEmbed(productDb);
      const components = await createMessageComponents();
      const embedReply = createMessageReplyEmbed("Produto adicionado ao carrinho!");
      const componentsReply = createMessageReplyComponents(channel);

      await channel.send({ embeds: [embed], components: components });
      logger.info("Message sent successfully");

      await interaction.reply({
        embeds: [embedReply],
        components: componentsReply,
        ephemeral: true,
      });

      cart?.productsId.push({ id: productId, quant: 1 });
      await cart?.save();
      logger.info("Message replied successfully");
      return;
    }
  } catch (error) {
    await loggerErrorProductButton(interaction, error);
  }
}

function createMessageReplyComponents(channel: TextChannel) {
  const linkButton = new ButtonBuilder()
    .setURL(channel.url)
    .setLabel("Carrinho de Compras")
    .setStyle(ButtonStyle.Link)
    .setEmoji("🔗");

  const row1: any = new ActionRowBuilder().addComponents(linkButton);
  return [row1];
}

function createMessageReplyEmbed(title: string) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription("Clique no botão abaixo para ver o carrinho de compras.")
    .setColor(0x00ff00);
}

async function createMessageComponents() {
  const deleteCart = new ButtonBuilder()
    .setCustomId("productDeleteCartButton")
    .setStyle(ButtonStyle.Danger)
    .setEmoji("✖️");
  const row1: any = new ActionRowBuilder().addComponents(deleteCart);

  return [row1];
}

function createMessageEmbed(productDb: ProductDocument) {
  const embed = new EmbedBuilder()
    .setTitle(productDb.name)
    .setDescription(`Código do produto: ${productDb.id}`)
    .setColor(`#${productDb.color}` === "#null" ? null : `#${productDb.color}`)
    .setThumbnail(productDb.thumbnail)
    .setFields([
      {
        name: "💵 | Preço unitário:",
        value: productDb.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        inline: true,
      },
      {
        name: "🛒 | Quantidade:",
        value: "1",
        inline: true,
      },
      {
        name: "💰 | Valor total:",
        value: productDb.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      },
    ]);
  return embed;
}
