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
    const productNameInput = new TextInputBuilder()
      .setCustomId("productNameInput")
      .setLabel("NOME DO PRODUTO")
      .setPlaceholder("Ex.: Mod Pack Básico")
      .setMaxLength(250)
      .setMinLength(1)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row: any = new ActionRowBuilder().addComponents(productNameInput);

    const modal = new ModalBuilder()
      .setCustomId("productNameModal")
      .setTitle("NOME DO PRODUTO")
      .setComponents(row);

    await interaction.showModal(modal);
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} button`, error);
    await interaction.reply({ content: messageError });
  }
}
