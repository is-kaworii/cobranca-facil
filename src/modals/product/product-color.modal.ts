import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { logger } from "../..";
import { ModelProduct } from "../../models/product.model";

export async function execute(interaction: ModalSubmitInteraction ) {
  logger.init({ interaction });
  const { customId, fields } = interaction;
  try {
    interaction.deferReply()
    const productColorInput = await fields.getTextInputValue("productColorInput").trim().replace("#", "")

    const embed = new EmbedBuilder(interaction.message?.embeds[0].data)
    embed.setColor(`#${productColorInput}`)

    const productDb = await ModelProduct.findOne({id: interaction.message?.id})
    if(productDb) {
      productDb.color = productColorInput
      await productDb.save()
    }

    await interaction.message?.edit({ embeds: [embed]})
    await interaction.deleteReply()
    logger.info(`Product color changed by ${interaction.user.username}`);
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} modal submit`, error);
    interaction.deferred
      ? await interaction.editReply({ content: messageError })
      : await interaction.reply({ content: messageError });
  }
}