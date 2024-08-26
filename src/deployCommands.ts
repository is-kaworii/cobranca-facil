import { REST, Routes } from "discord.js";
import { client, logger } from ".";
import { commands } from "./commands/commands";
import { exit } from "./utils/exit";

const rest: REST = new REST({ version: "10" }).setToken(process.env.applicationToken!);
const commandsData = Object.values(commands).map((command) => command.data);

export async function deployCommands(guildId: string) {
  try {
    logger.info("Deploying commands")
    const applicationId = client.user!.id
    let data: any = await rest.put(Routes.applicationGuildCommands(applicationId, guildId), {
      body: commandsData,
    });
    logger.info(`${data.length} Commands successfully deployed`)
  } catch (error) {
    logger.fatal("Failed to deploy commands", error)
    exit(100)
  }
}
