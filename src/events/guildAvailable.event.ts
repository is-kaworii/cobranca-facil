import { Guild } from "discord.js";
import { logger } from "..";
import { deployCommands } from "../deployCommands";
import { ModelGuild } from "../models/guild.model";

export async function guildAvailableEvent(guild: Guild) {
  try {
    logger.info(`Guild connected: ${guild.name}`);
    await initializeGuildInDatabase(guild);
    await deployCommands(guild.id);
  } catch (error) {
    logger.error("Error deploying commands to guild:", error);
    return null;
  }
}

async function initializeGuildInDatabase(guild: Guild) {
  if (!(await ModelGuild.findOne({ guildId: guild.id }))) {
    const guildDb = new ModelGuild({
      guildId: guild.id,
      guildName: guild.name,
      guildOwner: guild.ownerId,
      categoryCartId: null,
    });
    await guildDb.save();
    logger.info(`Guild (${guild.name}) saved in database`);
  }
}
