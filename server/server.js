import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

// Fix MongoDB SRV DNS resolution issue
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Trestep server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Server startup error:",
      error
    );

    process.exit(1);
  }
};

startServer();