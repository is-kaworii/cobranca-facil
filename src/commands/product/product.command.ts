import {
  ActionRowBuilder,
  CommandInteraction,
  ModalBuilder,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { logger } from "../..";

export const data = new SlashCommandBuilder()
  .setName("produto")
  .setDescription("produto")
  .addSubcommand(
    new SlashCommandSubcommandBuilder()
      .setName("add")
      .setDescription("Cria um produto no canal atual")
  );

export async function execute(interaction: CommandInteraction) {
  logger.init({ interaction });
  const { commandName } = interaction;
  try {
    const productNameInput = new TextInputBuilder()
      .setCustomId("produtNameInput")
      .setLabel("ENTRE COM O NOME DO PRODUTO")
      .setMinLength(0)
      .setMaxLength(250)
      .setPlaceholder("Ex.: Camiseta Azul")
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const row1: any = new ActionRowBuilder().addComponents(productNameInput);

    const productModal = new ModalBuilder()
      .setCustomId("productModal")
      .setTitle("Qual o nome do produto?")
      .addComponents(row1);

    await interaction.showModal(productModal);
  } catch (error) {
    const errorMessage = logger.error(`Error executing ${commandName} command:`, error);
    await interaction.reply({ content: errorMessage });
  }
}
