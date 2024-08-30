import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { logger } from "../..";
import { ModelProduct } from "../../models/product.model";

export async function execute(interaction: ModalSubmitInteraction) {
  const { customId, fields } = interaction;
  try {
    interaction.deferReply();
    const productRoleInput = await fields.getTextInputValue("productRoleInput");
    const embed = new EmbedBuilder(interaction.message?.embeds[0].data);

    const productDb = await ModelProduct.findOne({ id: interaction.message?.id });

    if (productRoleInput.toLowerCase() === "vazio") {
      const roleField = embed.data.fields
        ?.map((field) => {
          if (field.name === "🛂 | Você receberá o cargo:") return;
          return field;
        })
        .filter((field) => field != undefined);

      embed.data.fields = roleField;

      if (productDb) {
        productDb.roles = [];
        await productDb.save();
      }
    } else {
      if (productDb) {
        if (productDb) productDb.roles.push(productRoleInput);
        await productDb.save();
      }

      const roleField = embed.data.fields
        ?.map((field) => {
          if (field.name === "🛂 | Você receberá o cargo:") {
            field.value = `<@&${productDb?.roles.join("> <@&")}>` || "undefined";
          }
          return field;
        })
        .filter((field) => field.name === "🛂 | Você receberá o cargo:");

      if (roleField?.length == 0) {
        embed.addFields({
          name: "🛂 | Você receberá o cargo:",
          value: `<@&${productDb?.roles.join("> <@&")}>` || "undefined",
          inline: false,
        });
      }
    }

    await interaction.message?.edit({ embeds: [embed] });
    await interaction.deleteReply();
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} modal submit`, error);
    interaction.deferred
      ? await interaction.editReply({ content: messageError })
      : await interaction.reply({ content: messageError });
  }
}
