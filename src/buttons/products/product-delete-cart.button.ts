import { ButtonInteraction } from "discord.js";
import { logger } from "../..";
import { ModelCart } from "../../models/cart.model";

export async function execute(interaction: ButtonInteraction) {
  try {
    const productId = interaction.message.embeds[0].data.description?.split(": ")[1];
    const cartDb = await ModelCart.findOne({ channelId: interaction.channelId });
    if (!cartDb) throw new Error("Could not find cart");
    cartDb.productsId = cartDb.productsId
      .map((product) => {
        if (product.id === productId) return undefined;
        return product;
      })
      .filter((data) => data !== undefined);
    await cartDb.save();

    if (cartDb.productsId.length == 0) {
      await ModelCart.deleteOne({ channelId: interaction.channelId });
      await interaction.channel?.delete();
      return;
    }
    await interaction.message.delete();
  } catch (error) {
    logger.error("Error deleting product in cart", error);
  }
}
