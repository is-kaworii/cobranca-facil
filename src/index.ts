import { Client, IntentsBitField } from "discord.js";
import "dotenv/config";
import { Logger } from "./classes/logger";
import { database } from "./database/database";
import { discord } from "./discord";
import { events } from "./events/events";
import { app } from "./server/server";
import { exit } from "./utils/exit";

console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
console.clear();
export const logger = new Logger();
logger.info("▶️Iniciando Script");

export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
  ],
});

async function start() {
  await app
  await database();
  await discord();
  events();
}

start();

process.on("SIGINT", function () {
  logger.fatal("encerrando código", "");
  exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Unhandled Exception at:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at: ", reason);
});
