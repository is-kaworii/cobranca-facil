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
    await loggerErrorProductButton(interaction, error);
  }
}
