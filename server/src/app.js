import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://trestep-shoes-store-pqta.vercel.app",
];

if (process.env.CLIENT_URL) {
  const clientUrl = process.env.CLIENT_URL
    .trim()
    .replace(/\/$/, "");

  if (!allowedOrigins.includes(clientUrl)) {
    allowedOrigins.push(clientUrl);
  }
}

const corsOptions = {
  origin: (origin, callback) => {
    // Requests without an Origin header are allowed.
    // This is useful for tools/server-to-server requests.
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin
      .trim()
      .replace(/\/$/, "");

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    console.error(
      `CORS blocked origin: ${normalizedOrigin}`
    );

    return callback(
      new Error("Not allowed by CORS")
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],

  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

/*
 * Explicitly handle CORS preflight requests.
 * Express 5 requires a RegExp instead of "*"
 * for a catch-all OPTIONS route.
 */
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

/* Test endpoint */
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Trestep backend is working",
  });
});

/* API routes */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

/* Global error handler */
app.use(errorMiddleware);

export default app;