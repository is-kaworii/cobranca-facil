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
    await loggerErrorProductButton(interaction, error);
  }
}
