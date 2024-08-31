import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { logger } from "../..";
import { ModelProduct } from "../../models/product.model";

export async function execute(interaction: ModalSubmitInteraction ) {
  logger.init({ interaction });
  const { customId, fields } = interaction;
  try {
    interaction.deferReply()
    const productDescriptionInput = await fields.getTextInputValue("productDescriptionInput")

    const embed = new EmbedBuilder(interaction.message?.embeds[0].data)
    embed.setDescription(productDescriptionInput)

    const productDb = await ModelProduct.findOne({id: interaction.message?.id})
    if(productDb) {
      productDb.description = productDescriptionInput
      await productDb.save()
    }

    await interaction.message?.edit({ embeds: [embed]})
    await interaction.deleteReply()
    logger.info(`Product description changed by ${interaction.user.username}`);
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} modal submit`, error);
    interaction.deferred
      ? await interaction.editReply({ content: messageError })
      : await interaction.reply({ content: messageError });
  }
}