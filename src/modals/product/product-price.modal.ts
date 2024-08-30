import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { logger } from "../..";
import { ModelProduct } from "../../models/product.model";

export async function execute(interaction: ModalSubmitInteraction) {
  const { customId, fields } = interaction;
  try {
    const productPriceInput = await fields
      .getTextInputValue("productPriceInput")
      .replace(",", ".");

    if (isNaN(parseFloat(productPriceInput)) || productPriceInput.includes(" "))
      throw new Error("Value of productPriceInput invalid, must to be a number");
    const localedPrice = parseFloat(productPriceInput).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const embed = new EmbedBuilder(interaction.message?.embeds[0].data);

    embed.data.fields?.forEach((field) => {
      if (field.name === "💵 | Preço:") {
        field.value = localedPrice;
      }
    });

    const productDb = await ModelProduct.findOne({ id: interaction.message?.id });
    if (productDb) {
      productDb.price = parseFloat(productPriceInput);
      await productDb.save();
    }

    await interaction.message?.edit({ embeds: [embed] });
    await interaction.deferReply();
    await interaction.deleteReply();
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} modal submit`, error);
    await interaction.reply({ content: messageError });
  }
}
