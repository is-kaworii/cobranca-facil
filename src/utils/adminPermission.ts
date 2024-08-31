import { ButtonInteraction } from "discord.js";
import { logger } from "..";

export async function adminPermission(interaction: ButtonInteraction): Promise<boolean> {
  try {
    const member = interaction.guild?.members.resolve(interaction.user.id);

    if (member?.permissions.has("Administrator")) return true;
    return false;
  } catch (error) {
    logger.error(
      `Error checking permissions for user: ${interaction.user.username}`,
      error
    );
    throw error;
  }
}
