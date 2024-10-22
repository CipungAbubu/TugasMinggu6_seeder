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
     await resetDatabase(MovieModel);
     break;

     case "bulk-insert":
      await bulkInsert(MovieModel);
      break;

    case "get-all":
      await getAllMovies(MovieModel);
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

async function resetDatabase(MovieModel) {
  try {
    await MovieModel.deleteMany({});
    console.log("Database reset completed successfully.");
  } catch (error) {
    console.error("Error resetting the database:", error);
  }
}

async function bulkInsert(MovieModel) {
  try {
    console.log("Reading data from seed.json...");
    const data = fs.readFileSync("seed.json", "utf-8");
    const parsed = JSON.parse(data);
    console.log("Parsed data:", parsed);
    await MovieModel.insertMany(parsed);
    console.log("Bulk insert completed successfully.");
  } catch (error) {
    console.error("Error during bulk insert:", error);
  }
}

async function getAllMovies(MovieModel) {
  try {
    const allMovies = await MovieModel.find();
    console.log("All movies:", allMovies);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

main();
