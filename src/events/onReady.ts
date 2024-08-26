import { ActivityType } from "discord.js";
import { client, logger } from "..";

export function onReady() {
  logger.info(`BOT: ${client.user?.username}`);
  setBotStatus("MercadoPago");
}

function setBotStatus(activityName: string) {
  try {
    client.user?.setActivity({
      name: activityName,
      type: ActivityType.Playing,
    });

    logger.info(`Set bot status to ${activityName}`);
  } catch (error) {
    logger.error("failed to set activity status", error);
  }
}
