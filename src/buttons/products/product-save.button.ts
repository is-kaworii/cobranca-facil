import { ActionRowBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { logger } from "../..";
import { buttonCreator } from "../../modals/product/product.modal";

export async function execute(interaction: ButtonInteraction) {
  const { customId } = interaction;
  try {

    const productAddCartButton = await buttonCreator("AddCart", "Adicionar ao carrinho", "🛒", ButtonStyle.Success)
    const productConfigButton = await buttonCreator("Config", null, "⚙️")

    const row1:any = new ActionRowBuilder().addComponents(productAddCartButton, productConfigButton)
    await interaction.update({components: [row1]})
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} button`, error);
    await interaction.reply({ content: messageError });
  }
}
