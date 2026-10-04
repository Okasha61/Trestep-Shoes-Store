import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

// Fix MongoDB SRV DNS resolution issue
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

// Global flag to prevent multiple DB connections
let isConnected = false;

const handler = async (req, res) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
      console.log("Database connected");
    }

    return app(req, res); // Express app handle request
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;