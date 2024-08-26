import { Client, IntentsBitField } from "discord.js";
import "dotenv/config";
import { database } from "./database/database";
import { discord } from "./discord";
import { events } from "./events/events";

console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
console.clear();
console.log("▶️Iniciando Script");

export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
  ],
});

async function start() {
  await database()
  await discord()
  events()
}
  
start();

process.on("SIGINT", function () {
  console.log("encerrando código")
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Unhandled Exception at:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at: ", reason);
});
