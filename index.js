const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

async function main() {
  /**--------------- Not allowed to be edited - start - --------------------- */
  const mongoUri = process.env.MONGODB_URI;
  const collection = process.env.MONGODB_COLLECTION;

  const args = process.argv.slice(2);
  const command = args[0];
  
  /**--------------- Not allowed to be edited - end - --------------------- */

  // Connect to MongoDB
  await mongoose.connect(mongoUri);

  // Define a schema for the collection
  const schema = new mongoose.Schema(
    {
      title: String,
      year: Number,
      genre: [String],
      description: String,
      director: String,
      cast: [String],
    }, 
    { strict: false }
  );
  const MovieModel = mongoose.model(collection, schema); // Model harus dideklarasikan setelah schema

  switch (command) {
    case "check-db-connection":
      await checkConnection();
      break;

   case "reset-db":
     break;

     case "bulk-insert":
      break;

    case "get-all":
      break;

    default:
      throw Error("command not found");
  }

  await mongoose.disconnect();
  console.log("Database disconnected");
  return;
}

async function checkConnection() {
  console.log("check db connection started...");
  try {
    await mongoose.connection.db.admin().ping();
    console.log("MongoDB connection is successful!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
  console.log("check db connection ended...");
}

main();
