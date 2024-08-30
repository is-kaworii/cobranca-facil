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
    const productStockInput = new TextInputBuilder()
      .setCustomId("productStockInput")
      .setLabel("QUANTIDADE DO PRODUTO EM ESTOQUE")
      .setPlaceholder("Ex.: 30")
      .setMaxLength(5)
      .setMinLength(1)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row: any = new ActionRowBuilder().addComponents(productStockInput);

    const modal = new ModalBuilder()
      .setCustomId("productStockModal")
      .setTitle("ESTOQUE DO PRODUTO")
      .setComponents(row);

    await interaction.showModal(modal);
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} button`, error);
    await interaction.reply({ content: messageError });
  }
}
