import { client, logger } from ".";
import { exit } from "./utils/exit";

export async function discord() {
  try {
    await client.login(process.env.applicationToken);
    logger.info("login to discord bot successfully")
  } catch (error) {
    logger.fatal("Error logging in to discord bot:", error);
    exit(100)
  }
}
