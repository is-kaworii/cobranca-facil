import {
  ActionRowBuilder,
  ButtonStyle,
  Message,
  ModalSubmitInteraction,
} from "discord.js";
import { logger } from "../..";
import { ModelProduct } from "../../models/product.model";
import { buttonCreator } from "../../utils/createButton";
import { createEmbed } from "../../utils/createEmbed";

export async function execute(interaction: ModalSubmitInteraction) {
  logger.init({ interaction });
  try {
    logger.info("Creating message")
    await interaction.deferReply();

    const productNameInput = interaction.fields.getTextInputValue("produtNameInput");
    const embed = await embedCreator(interaction, productNameInput);
    const components = componentsProductConfigCreator();

    if (!interaction.channel || !interaction.channel!.isTextBased())
      throw new Error("Channel is not text-based or not founded");

    const message = await interaction.channel.send({ embeds: [embed], components });

    await createModelProduct(interaction, message, productNameInput);

    await interaction.deleteReply();
    logger.info("Message sent successfully");
  } catch (error) {
    const messageError = logger.error(
      `Error executing ${interaction.customId} modal submit`,
      error
    );
    interaction.deferred
      ? await interaction.editReply({ content: messageError })
      : await interaction.reply({ content: messageError });
  }
}

async function createModelProduct(
  interaction: ModalSubmitInteraction,
  message: Message,
  productNameInput: string
) {
  try {
    const productDb = new ModelProduct({
      guildId: interaction.guildId!,
      id: message.id,
      name: productNameInput,
    });
    await productDb.save();
  } catch (error) {
    logger.error("Error creating product in database", error);
  }
}

async function embedCreator(interaction: ModalSubmitInteraction, productName: string) {
  try {
    const embed = await createEmbed({
      guildId: interaction.guildId,
      title: productName,
    });

    embed.setFields({
      name: "💵 | Preço:",
      value: `R$ 0,00`,
      inline: false,
    });

    return embed;
  } catch (error) {
    logger.error("Error creating embed", error);
    throw error;
  }
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
