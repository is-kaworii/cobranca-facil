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
    const productDescriptionInput = new TextInputBuilder()
      .setCustomId("productDescriptionInput")
      .setLabel("DESCRIÇÃO DO PRODUTO")
      .setPlaceholder("Descreva o produto.")
      .setMaxLength(4000)
      .setMinLength(1)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row: any = new ActionRowBuilder().addComponents(productDescriptionInput);

    const modal = new ModalBuilder()
      .setCustomId("productDescriptionModal")
      .setTitle("DESCRIÇÃO DO PRODUTO")
      .setComponents(row);

    await interaction.showModal(modal);
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} button`, error);
    await interaction.reply({ content: messageError });
  }
}
