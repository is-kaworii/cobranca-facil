import mongoose, { Schema } from "mongoose";
import { GuildInterface } from "../interfaces/guild.interface";

const guildSchema: Schema<GuildInterface> = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  guildName: {
    type: String,
    required: true,
  },
  guildOwner: {
    type: String,
    required: true,
  },
  categoryCartId: {
    type: String,
  },
});

export const ModelGuild = mongoose.model("Guilds", guildSchema);
