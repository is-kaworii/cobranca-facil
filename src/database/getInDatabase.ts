import { logger } from "..";
import { ModelGuild } from "../models/guild.model";

export function getGuild(guildId: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const guildDb = await ModelGuild.findOne({ guildId });
      resolve(guildDb);
    } catch (error) {
      logger.error("Failed to get guild from database", error);
      reject(error);
    }
  });
}
