import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { client, logger } from "../..";
import { createEmbed } from "../../utils/createEmbed";

export const data = new SlashCommandBuilder()
  .setName("uptime")
  .setDescription(
    "Mostra o status atual do bot e o tempo de atividade desde a última vez que ele foi reiniciado."
  );

export async function execute(interaction: CommandInteraction) {
  logger.init({ interaction });
  try {
    await interaction.deferReply({ ephemeral: true });

    const uptime = process.uptime();
    const title = client.user?.username;
    let description = "";
    description += "**Status:** ` Online ✅ `\n";
    description += `**Uptime:** <t:${Math.floor(Date.now() / 1000 - uptime)}:R>`;

    const embed = await createEmbed({ guildId: interaction.guildId, title, description });
    
    await interaction
      .editReply({ content: "", embeds: [embed] })
      .then(() => logger.info(`interaction replyed successfully`));
  } catch (error) {
    const errorMessage = `Error executing \`${interaction.commandName}\` command`;
    if (interaction.deferred) await interaction.editReply({ content: errorMessage });
    logger.error(errorMessage, error, { interaction });
  }
}
