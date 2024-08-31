import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { logger } from "../..";
import { adminPermission } from "../../utils/adminPermission";
import { loggerErrorProductButton } from "../../utils/loggerErrorProductButton";

export async function execute(interaction: ButtonInteraction) {
  logger.init({ interaction });
  try {
    if (!(await adminPermission(interaction)))
      throw new Error("You need admin permission to use this interaction");
    
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
    await loggerErrorProductButton(interaction, error);
  }
}
