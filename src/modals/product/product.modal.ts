import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentEmojiResolvable,
  ModalSubmitInteraction,
} from "discord.js";
import { logger } from "../..";
import { ModelProduct } from "../../models/product.model";
import { createEmbed } from "../../utils/createEmbed";
export async function execute(interaction: ModalSubmitInteraction) {
  const { guildId, fields, channel, customId } = interaction;
  if (!channel || !channel.isTextBased()) return;

  try {
    await interaction.deferReply();
    const productNameInput = fields.getTextInputValue("produtNameInput");

    const embed = await createEmbed({
      guildId,
      title: productNameInput,
    });

    embed.setFields({
      name: "💵 | Preço:",
      value: `R$ 0,00`,
      inline: false,
    });

    const components = componentsProductConfigCreator();

    await channel.send({ embeds: [embed], components }).then(async (message) => {
      const productDb = new ModelProduct({
        guildId: guildId,
        id: message.id,
        name: productNameInput,
      });

      await productDb.save();
    });

    await interaction.deleteReply();
  } catch (error) {
    const messageError = logger.error(`Error executing ${customId} modal submit`, error);
    interaction.deferred
      ? await interaction.editReply({ content: messageError })
      : await interaction.reply({ content: messageError });
  }
}

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

export function componentsProductConfigCreator() {
  const productName = buttonCreator("Name", "Nome", "📝");
  const productDescription = buttonCreator("Description", "Descrição", "📄");
  const productPrice = buttonCreator("Price", "Preço", "💰");
  const productThumbnail = buttonCreator("Thumbnail", "Miniatura", "🖼️");
  const productImage = buttonCreator("Image", "Banner", "🌄");

  const productStock = buttonCreator("Stock", "Estoque", "➕");
  const productClear = buttonCreator("Clear", "Limpar Estoque", "🗑️");
  const productColor = buttonCreator("Color", "Cor", "🎨");
  const productRole = buttonCreator("Role", "Add Cargo", "🛂");
  const productVariant = buttonCreator("Variant", "Variante", "🎭");
  const productDelete = buttonCreator(
    "Delete",
    "Apagar Produto",
    "✖️",
    ButtonStyle.Danger
  );
  const productSave = buttonCreator("Save", "Salvar", "✔️", ButtonStyle.Success);

  const row1: any = new ActionRowBuilder().addComponents(
    productName,
    productDescription,
    productPrice,
    productThumbnail,
    productImage
  );
  const row2: any = new ActionRowBuilder().addComponents(
    productStock,
    productClear,
    productColor,
    productRole
  );
  const row3: any = new ActionRowBuilder().addComponents(
    productVariant,
    productDelete,
    productSave
  );

  return [row1, row2, row3];
}
