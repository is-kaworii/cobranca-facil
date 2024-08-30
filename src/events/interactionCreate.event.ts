import { CacheType, Interaction } from "discord.js";
import { logger } from "..";
import { buttons } from "../buttons/buttons";
import { commands } from "../commands/commands";
import { modalSubmit } from "../modals/modal-submit";

export async function interactionCreateEvent(interaction: Interaction<CacheType>) {
  try {
    if (interaction.isCommand()) {
      const { commandName } = interaction;
      if (commandName in commands) {
        await commands[commandName as keyof typeof commands].execute(interaction);
      }
    }
    if (interaction.isButton()) {
      const { customId } = interaction;
      if (customId in buttons) {
        await buttons[customId as keyof typeof buttons].execute(interaction);
      }
    }
    if (interaction.isModalSubmit()) {
      const { customId } = interaction;
      if (customId in modalSubmit) {
        await modalSubmit[customId as keyof typeof modalSubmit].execute(interaction);
      }
    }
  } catch (error) {
    logger.error("Error executing event", error)
  }
}
