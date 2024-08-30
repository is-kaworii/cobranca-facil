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
    const productRoleInput = new TextInputBuilder()
      .setCustomId("productRoleInput")
      .setLabel("ID DO CARGO")
      .setPlaceholder("Caso não saiba o ID, utilize o comando /cargo_id")
      .setMaxLength(250)
      .setMinLength(1)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const row: any = new ActionRowBuilder().addComponents(productRoleInput);

    const modal = new ModalBuilder()
      .setCustomId("productRoleModal")
      .setTitle("ID DO CARGO")
      .setComponents(row);

    await interaction.showModal(modal);
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} button`, error);
    await interaction.reply({ content: messageError });
  }
}
