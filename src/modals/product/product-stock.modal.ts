import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { logger } from "../..";
import { ModelProduct } from "../../models/product.model";

export async function execute(interaction: ModalSubmitInteraction) {
  logger.init({ interaction });
  const { customId, fields } = interaction;
  try {
    const productStockInput = await fields.getTextInputValue("productStockInput").trim();

    if (isNaN(parseInt(productStockInput)) || productStockInput.includes(" "))
      throw new Error("Value of productStockInput invalid, must to be a number");

    const embed = new EmbedBuilder(interaction.message?.embeds[0].data);

    const stockFields = embed.data.fields?.map(field => {
      if(field.name === "🛒 | Estoque:") {
        field.value = productStockInput;
      }
      return field
    }).filter(field => field.name === "🛒 | Estoque:")

    if (stockFields?.length == 0) {
      embed.addFields({
        name: "🛒 | Estoque:",
        value: productStockInput,
        inline: false,
      })
    }

    const productDb = await ModelProduct.findOne({ id: interaction.message?.id });
    if (productDb) {
      productDb.stock = parseInt(productStockInput);
      await productDb.save();
    }

    await interaction.message?.edit({ embeds: [embed] });
    await interaction.deferReply();
    await interaction.deleteReply();
    logger.info(`Product stock changed by ${interaction.user.username}`);
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} modal submit`, error);
    await interaction.reply({ content: messageError });
  }
}
