import { SlashCommandBuilder } from "discord.js";
import { logger } from "../..";

export const data = new SlashCommandBuilder()
.setName("uptime")
.setDescription("Retorna a duração do bot.");

export function execute() {
  logger.info("oiii")
}