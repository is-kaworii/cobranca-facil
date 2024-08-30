import { client, logger } from "..";
import { guildAvailableEvent } from "./guildAvailable.event";
import { interactionCreateEvent } from "./interactionCreate.event";
import { readyEvent } from "./ready.event";

export function events() {
  logger.info("Event listeners")
  client
    .once("ready", readyEvent)
    .on("channelCreate", () => {})
    .on("channelDelete", () => {})
    .on("channelUpdate", () => {})
    .on("guildAvailable", guildAvailableEvent)
    .on("guildBanAdd", () => {})
    .on("guildBanRemove", () => {})
    .on("guildCreate", () => {})
    .on("guildDelete", () => {})
    .on("guildUpdate", () => {})
    .on("guildMemberAdd", () => {})
    .on("guildMemberRemove", () => {})
    .on("guildMemberUpdate", () => {})
    .on("interactionCreate", interactionCreateEvent)
    .on("messageCreate", () => {})
    .on("messageDelete", () => {})
    .on("messageUpdate", () => {})
    .on("roleCreate", () => {})
    .on("roleDelete", () => {})
    .on("roleUpdate", () => {});
}
