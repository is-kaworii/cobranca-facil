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
    if (!await adminPermission(interaction)) throw new Error("You need admin permission to use this interaction");

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
    await loggerErrorProductButton(interaction, error);
  }
}
