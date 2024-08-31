import { ButtonInteraction } from "discord.js";
import { logger } from "..";

export async function loggerErrorProductButton(interaction: ButtonInteraction, error: any) {
  const messageError = logger.error(
    `Error executing ${interaction.customId} button`,
    error
  );
  await interaction.reply({ content: messageError, ephemeral: true });
}
