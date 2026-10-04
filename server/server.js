import "dotenv/config";

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

let dbConnectionPromise = null;

const handler = async (req, res) => {
  try {
    if (!dbConnectionPromise) {
      dbConnectionPromise = connectDB();
    }

    await dbConnectionPromise;

    return app(req, res);
  } catch (error) {
    console.error("Server error:", error);

    dbConnectionPromise = null;

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};

export default handler;