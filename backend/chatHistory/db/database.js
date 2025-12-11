
const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error(" MONGO_URI is not defined in environment variables.");
      throw new Error("MONGO_URI is missing");
    }

    const mongoUri = process.env.MONGO_URI;

    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(" Successfully connected to MongoDB Atlas");
  } catch (err) {
    
    console.error(" Failed to connect to MongoDB Atlas");
    console.error("Error details:", err.message);
    console.error("Exiting the process now...");
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn(" MongoDB connection lost. Attempting to reconnect...");
  });

  mongoose.connection.on("error", (err) => {
    console.error(" MongoDB error:", err);
  });
};

module.exports = connectDB;
