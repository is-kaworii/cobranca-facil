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
    const productImageInput = new TextInputBuilder()
      .setCustomId("productImageInput")
      .setLabel('LINK DA IMAGEM OU DIGITE "VAZIO"')
      .setPlaceholder("Ex.: https://seusite.com/image.png")
      .setMaxLength(250)
      .setMinLength(1)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row: any = new ActionRowBuilder().addComponents(productImageInput);

    const modal = new ModalBuilder()
      .setCustomId("productImageModal")
      .setTitle("BANNER DO PRODUTO")
      .setComponents(row);

    await interaction.showModal(modal);
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} button`, error);
    await interaction.reply({ content: messageError });
  }
}
