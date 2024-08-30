import { CategoryChannel, ChannelType } from "discord.js";
import { client, logger } from "..";
import { ModelGuild } from "../models/guild.model";

export function createCategory(guildId: string): Promise<CategoryChannel> {
  return new Promise(async (resolve, reject) => {
    try {
      const guild = await client.guilds.resolve(guildId);
      const guildDb = await ModelGuild.findOne({ guildId });

      if (!guildDb) throw new Error("Guild not found in database");
      if (guildDb.categoryCartId) {
        const category = (await guild!.channels.resolve(
          guildDb.categoryCartId
        )) as CategoryChannel;
        if (!category) throw new Error("Category not found");
        resolve(category);
      }

      const category = await guild!.channels.create({
        name: "carrinho",
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: guild!.roles.everyone.id,
            deny: ["ViewChannel"],
          },
        ],
      });

      if (!category) throw new Error("Category not found");
      resolve(category);
    } catch (error) {
      logger.error("Error creating carrinho category", error);
      reject(error);
    }
  });
}
