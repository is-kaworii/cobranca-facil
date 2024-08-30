import { ActionRowBuilder, ButtonInteraction, ButtonStyle, ChannelType, TextChannel } from "discord.js";
import { logger } from "../../..";
import { buttonCreator } from "../../../modals/product/product.modal";
import { ModelCart } from "../../../models/cart.model";
import { ModelGuild } from "../../../models/guild.model";
import { createEmbed } from "../../../utils/createEmbed";

export async function getOrCreateCart(interaction: ButtonInteraction) {
  try {
    const cart = await ModelCart.findOne({ memberId: interaction.user.id });
    if (cart) return cart;
    return await createCart(interaction);
  } catch (error) {
    logger.error("Error getting or creating cart", error);
  }
}

async function createCart(interaction: ButtonInteraction) {
  try {
    const channel = await createChannel(interaction);
    const message = await createMainMessage(channel);
    const newCart = new ModelCart({
      channelId: channel?.id,
      memberId: interaction.user.id,
      messageId: message?.id,
    });
    newCart.save();
    return newCart;
  } catch (error) {
    logger.error("Error creating cart", error);
  }
}

async function createMainMessage(channel: TextChannel | undefined) {
  try {
    if (!channel) throw new Error("Channel not specified");

    const embed = await createEmbed({
      guildId: channel.guildId,
      title: `Carrinho de: ${channel.name.split("-")[1]}`,
      description:
        "Após fazer todas as edições nos produtos abaixo, clique em Ir para pagamento para poder pagar e recebe-los",
      color: "White",
    });

    const goToPaymentButton = await buttonCreator(
      "GoToPayment",
      "Ir para Pagamento",
      "✔️",
      ButtonStyle.Success
    );
    const cancelCartButton = await buttonCreator(
      "CancelCart",
      "Cancelar Carrinho",
      "✖️",
      ButtonStyle.Danger
    );
    const row1: any = new ActionRowBuilder().addComponents(
      goToPaymentButton,
      cancelCartButton
    );

    const message = await channel.send({
      embeds: [embed], components: [row1]
    });

    return message
  } catch (error) {
    logger.error("Error creating main message", error);
  }
}

async function createChannel(interaction: ButtonInteraction) {
  try {
    const guildDb = await ModelGuild.findOne({ guildId: interaction.guildId });
    const channel = await interaction.guild?.channels.create({
      name: `carrinho-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: guildDb?.categoryCartId,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone.id,
          deny: [
            "ViewChannel",
            "ManageChannels",
            "ManageRoles",
            "ManageWebhooks",
            "CreateInstantInvite",
            "SendMessages",
            "SendMessagesInThreads",
            "SendTTSMessages",
            "EmbedLinks",
            "AttachFiles",
            "AddReactions",
            "UseExternalStickers",
            "ManageEmojisAndStickers",
            "MentionEveryone",
            "ManageNicknames",
            "ManageMessages",
            "ReadMessageHistory",
            "UseApplicationCommands",
          ],
        },
        {
          id: interaction.user.id,
          allow: ["ViewChannel"],
        },
      ],
    });

    return channel;
  } catch (error) {
    logger.error("Error creating channel", error);
  }
}
