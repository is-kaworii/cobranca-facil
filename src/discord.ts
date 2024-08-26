import { client } from ".";

export async function discord() {
  try {
    await client.login(process.env.applicationToken);
    console.log("login to discord bot successfully");
  } catch (error) {
    console.error("Error logging in to discord bot:", error);
    process.exit(1);
  }
}
