import { ButtonInteraction } from "discord.js";
import { logger } from "../..";
import { ModelCart } from "../../models/cart.model";

export async function execute(interaction: ButtonInteraction) {
  try {
    const cart = await ModelCart.deleteOne({ channelId: interaction.channelId})
    await interaction.channel?.delete()

  } catch (error) {
    const messageError = logger.error(
      `Error executing ${interaction.customId} button`,
      error
    );
    await interaction.reply({ content: messageError });
  }
}
