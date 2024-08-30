import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { logger } from "../..";

export async function execute(interaction: ButtonInteraction) {
  const { customId } = interaction;
  try {
    const productColorInput = new TextInputBuilder()
      .setCustomId("productColorInput")
      .setLabel("HEXADECIMAL DA COR")
      .setPlaceholder("Ex.: #FFB6DD")
      .setMaxLength(7)
      .setMinLength(7)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row: any = new ActionRowBuilder().addComponents(productColorInput);

    const modal = new ModalBuilder()
      .setCustomId("productColorModal")
      .setTitle("COR DA EMBED DO PRODUTO")
      .setComponents(row);

    await interaction.showModal(modal);
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} button`, error);
    await interaction.reply({ content: messageError });
  }
}
