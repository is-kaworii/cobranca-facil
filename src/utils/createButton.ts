import { ButtonBuilder, ButtonStyle, ComponentEmojiResolvable } from "discord.js";

export function buttonCreator(
  customId: string,
  label: string | null,
  emoji: ComponentEmojiResolvable,
  style: ButtonStyle = ButtonStyle.Secondary
) {
  const button = new ButtonBuilder()
    .setCustomId(`product${customId}Button`)
    .setStyle(style)
    .setEmoji(emoji);

  if (label) button.setLabel(label);
  return button;
}
