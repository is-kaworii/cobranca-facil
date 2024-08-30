import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { logger } from "../..";
import { ModelProduct } from "../../models/product.model";

export async function execute(interaction: ModalSubmitInteraction ) {
  const { customId, fields } = interaction;
  try {
    interaction.deferReply()
    const productImageInput = await fields.getTextInputValue("productImageInput")

    const embed = new EmbedBuilder(interaction.message?.embeds[0].data)
    embed.setImage(productImageInput)

    const productDb = await ModelProduct.findOne({id: interaction.message?.id})
    if(productDb) {
      productDb.image = productImageInput
      await productDb.save()
    }

    await interaction.message?.edit({ embeds: [embed]})
    await interaction.deleteReply()
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} modal submit`, error);
    interaction.deferred
      ? await interaction.editReply({ content: messageError })
      : await interaction.reply({ content: messageError });
  }
}