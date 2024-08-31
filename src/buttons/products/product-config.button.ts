import { ButtonInteraction } from "discord.js";
import { logger } from "../..";
import { componentsProductConfigCreator } from "../../modals/product/product.modal";
import { adminPermission } from "../../utils/adminPermission";

export async function execute(interaction: ButtonInteraction) {
  logger.init({ interaction });
  const { customId } = interaction;
  try {
    if (!await adminPermission(interaction)) throw new Error("You need admin permission to use this interaction");
    const components = await componentsProductConfigCreator();
    await interaction.update({ components });
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} button`, error);
    await interaction.reply({ content: messageError, ephemeral: true });
  }
}
