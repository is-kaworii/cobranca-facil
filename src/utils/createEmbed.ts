import { ColorResolvable, EmbedBuilder, EmbedFooterOptions, Guild } from "discord.js";
import { client, logger } from "..";

interface EmbedData {
  guildId: string | null;
  title?: string;
  description?: string;
  footer?: EmbedFooterOptions | boolean;
  timestamp?: Date | number | boolean;
  thumbnail?: string | boolean | null;
  color?: ColorResolvable | null;
}

export function createEmbed(data: EmbedData): Promise<EmbedBuilder> {
  return new Promise(async (resolve, reject) => {
    try {
      const { guildId, title, description, footer, timestamp, thumbnail, color } = data;

      const guild = await client.guilds.resolve(guildId!);
      const embed = new EmbedBuilder();
      setTitle(embed, title ?? null);
      setDescription(embed, description ?? null);
      setFooter(embed, guild, footer ?? null);
      setTimestamp(embed, timestamp ?? null);
      setThumbnail(embed, guild, thumbnail ?? null);
      setColor(embed, color ?? null);

      resolve(embed);
    } catch (error) {
      logger.error("Error creating Embed", error);
      reject(error);
    }
  });
}

function setTitle(embed: EmbedBuilder, title: string | null) {
  return embed.setTitle(title);
}

function setDescription(embed: EmbedBuilder, description: string | null) {
  return embed.setDescription(description);
}

function setFooter(
  embed: EmbedBuilder,
  guild: Guild | null,
  footer: EmbedFooterOptions | boolean | null
) {
  if (typeof footer === "boolean") {
    return embed.setFooter({
      text: `${guild?.name}`,
      iconURL: guild?.iconURL() ?? undefined,
    });
  } else {
    return embed.setFooter(footer);
  }
}

function setTimestamp(embed: EmbedBuilder, timestamp: Date | number | boolean | null) {
  if (typeof timestamp === "boolean") {
    return embed.setTimestamp(timestamp ? new Date() : null);
  } else {
    embed.setTimestamp(timestamp);
  }
}

function setThumbnail(
  embed: EmbedBuilder,
  guild: Guild | null,
  thumbnail: string | boolean | null
) {
  if (typeof thumbnail === "boolean") {
    return embed.setThumbnail(thumbnail ? guild!.iconURL() : null);
  } else {
    return embed.setThumbnail(thumbnail);
  }
}

async function setColor(embed: EmbedBuilder, color: ColorResolvable | null) {
  if (color) {
    return embed.setColor(color);
  }
}
