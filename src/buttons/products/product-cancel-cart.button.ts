import { ButtonInteraction } from "discord.js";
import { logger } from "../..";
import { ModelCart } from "../../models/cart.model";

export async function execute(interaction: ButtonInteraction) {
  logger.init({ interaction });
  try {
    logger.info("Deleting cart and channel");
    const cart = await ModelCart.deleteOne({ channelId: interaction.channelId });
    await interaction.channel?.delete();
    logger.info("Cart and channel deleted successfully");
  } catch (error) {
    const messageError = logger.error(
      `Error executing ${interaction.customId} button`,
      error
    );
    await interaction.reply({ content: messageError });
  }
}
