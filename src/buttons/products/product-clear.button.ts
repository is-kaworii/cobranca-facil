import {
  ButtonInteraction,
  EmbedBuilder
} from "discord.js";
import { logger } from "../..";
import { ModelProduct } from "../../models/product.model";

export async function execute(interaction: ButtonInteraction) {
  const { customId } = interaction;
  try {
    const embed = new EmbedBuilder(interaction.message?.embeds[0].data);

    const newFields = embed.data.fields?.map(field => {
      if (field.name === "🛒 | Estoque:") return;
      else return field;
    }).filter(data => data !== undefined)
    
    embed.data.fields = newFields;

    const productDb = await ModelProduct.findOne({ id: interaction.message?.id });
    if (productDb) {
      productDb.stock = null;
      await productDb.save();
    }

    await interaction.update({ embeds: [embed] });
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} button`, error);
    await interaction.reply({ content: messageError });
  }
}
