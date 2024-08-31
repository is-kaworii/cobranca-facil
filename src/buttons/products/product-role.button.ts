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
    await loggerErrorProductButton(interaction, error);
  }
}
