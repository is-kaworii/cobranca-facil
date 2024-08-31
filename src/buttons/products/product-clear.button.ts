import {
  ButtonInteraction,
  EmbedBuilder
} from "discord.js";
import { logger } from "../..";
import { ModelProduct } from "../../models/product.model";
import { adminPermission } from "../../utils/adminPermission";
import { loggerErrorProductButton } from "../../utils/loggerErrorProductButton";

export async function execute(interaction: ButtonInteraction) {
  logger.init({ interaction });
  try {
    if (!await adminPermission(interaction)) throw new Error("You need admin permission to use this interaction");

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
    await loggerErrorProductButton(interaction, error);
  }
}
