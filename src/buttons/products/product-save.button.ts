import { ActionRowBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import { logger } from "../..";
import { adminPermission } from "../../utils/adminPermission";
import { buttonCreator } from "../../utils/createButton";
import { loggerErrorProductButton } from "../../utils/loggerErrorProductButton";

export async function execute(interaction: ButtonInteraction) {
  logger.init({ interaction });
  const { customId } = interaction;
  try {
    if (!await adminPermission(interaction)) throw new Error("You need admin permission to use this interaction");

    const productAddCartButton = await buttonCreator(
      "AddCart",
      "Adicionar ao carrinho",
      "🛒",
      ButtonStyle.Success
    );
    const productConfigButton = await buttonCreator("Config", null, "⚙️");

    const row1: any = new ActionRowBuilder().addComponents(
      productAddCartButton,
      productConfigButton
    );
    await interaction.update({ components: [row1] });
  } catch (error) {
    await loggerErrorProductButton(interaction, error);
  }
}
