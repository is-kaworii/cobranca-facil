import "dotenv/config";
import { connect, connection, ConnectOptions, disconnect } from "mongoose";

const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@chargeautomation.nevu6ex.mongodb.net/?retryWrites=true&w=majority&appName=ChargeAutomation`;
const clientOptions: ConnectOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

export async function database() {
  try {
    console.log("Connecting to MongoDB...");
    await connect(uri, clientOptions);
    await connection.db?.admin().command({ ping: 1 });
    console.log("You successfully connected to MongoDB!")
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1)
  } finally {
    await disconnect();
  }
}
