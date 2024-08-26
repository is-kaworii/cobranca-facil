import { client } from "..";

export function events() {
  client
    .once("ready", () => {})
    .on("channelCreate", () => {})
    .on("channelDelete", () => {})
    .on("channelUpdate", () => {})
    .on("guildAvailable", () => {})
    .on("guildBanAdd", () => {})
    .on("guildBanRemove", () => {})
    .on("guildCreate", () => {})
    .on("guildDelete", () => {})
    .on("guildUpdate", () => {})
    .on("guildMemberAdd", () => {})
    .on("guildMemberRemove", () => {})
    .on("guildMemberUpdate", () => {})
    .on("interactionCreate", () => {})
    .on("messageCreate", () => {})
    .on("messageDelete", () => {})
    .on("messageUpdate", () => {})
    .on("roleCreate", () => {})
    .on("roleDelete", () => {})
    .on("roleUpdate", () => {});
}
