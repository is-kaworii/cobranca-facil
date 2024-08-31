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
    await loggerErrorProductButton(interaction, error);
  }
}
