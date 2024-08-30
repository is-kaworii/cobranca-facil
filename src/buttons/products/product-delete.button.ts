import { ButtonInteraction } from "discord.js";
import { logger } from "../..";
import { ModelProduct } from "../../models/product.model";

export async function execute(interaction: ButtonInteraction) {
  const { customId } = interaction;
  try {
    await ModelProduct.deleteOne({ id: interaction.message?.id });
    await interaction.message?.delete();
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} button`, error);
    await interaction.reply({ content: messageError });
  }
}
