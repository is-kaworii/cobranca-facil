import { ButtonInteraction } from "discord.js";
import { logger } from "../..";
import {
  componentsProductConfigCreator
} from "../../modals/product/product.modal";

export async function execute(interaction: ButtonInteraction) {
  const { customId } = interaction;
  try {
    const components = await componentsProductConfigCreator();
    await interaction.update({ components });
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} button`, error);
    await interaction.reply({ content: messageError });
  }
}
