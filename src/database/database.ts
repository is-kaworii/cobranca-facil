import { connect, connection, ConnectOptions, disconnect } from "mongoose";
import { logger } from "..";
import { exit } from "../utils/exit";

const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@chargeautomation.nevu6ex.mongodb.net/?retryWrites=true&w=majority&appName=ChargeAutomation`;
const clientOptions: ConnectOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

export async function database() {
  try {
    logger.info("Connecting to MongoDB...");
    await connect(uri, clientOptions);
    await connection.db?.admin().command({ ping: 1 });
    logger.info("You successfully connected to MongoDB!");
  } catch (error) {
    logger.fatal("Error connecting to MongoDB:", error);
    exit(100)
  } finally {
    await disconnect();
  }
}
