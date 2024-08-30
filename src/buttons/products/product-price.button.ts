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
    const productPriceInput = new TextInputBuilder()
      .setCustomId("productPriceInput")
      .setLabel("VALOR DO PRODUTO (números e vírgula)")
      .setPlaceholder("Ex.: 9,90")
      .setMaxLength(7)
      .setMinLength(1)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row: any = new ActionRowBuilder().addComponents(productPriceInput);

    const modal = new ModalBuilder()
      .setCustomId("productPriceModal")
      .setTitle("PREÇO DO PRODUTO")
      .setComponents(row);

    await interaction.showModal(modal);
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} button`, error);
    await interaction.reply({ content: messageError });
  }
}
