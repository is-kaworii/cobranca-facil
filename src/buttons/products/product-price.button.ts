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
    await loggerErrorProductButton(interaction, error);
  }
}
