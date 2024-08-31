import { ButtonInteraction } from "discord.js";
import { logger } from "../..";
import { ModelProduct } from "../../models/product.model";
import { adminPermission } from "../../utils/adminPermission";
import { loggerErrorProductButton } from "../../utils/loggerErrorProductButton";

export async function execute(interaction: ButtonInteraction) {
  logger.init({ interaction });
  const { customId } = interaction;
  try {
    if (!(await adminPermission(interaction)))
      throw new Error("You need admin permission to use this interaction");

    await ModelProduct.deleteOne({ id: interaction.message?.id });
    await interaction.message?.delete();
  } catch (error) {
    await loggerErrorProductButton(interaction, error);
  }
}
