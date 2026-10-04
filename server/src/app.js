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

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://trestep-shoes-store-pqta.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    // such as Postman, server-to-server requests, etc.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("Blocked CORS origin:", origin);

    return callback(new Error("Not allowed by CORS"));
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

/*
 * CORS middleware must come before the routes.
 * This handles browser preflight OPTIONS requests.
 */
app.use(cors(corsOptions));

/* =========================
   BODY PARSERS
========================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* =========================
   TEST ROUTE
========================= */

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Trestep backend is working",
  });
});

/* =========================
   API ROUTES
========================= */

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

/* =========================
   ERROR HANDLER
========================= */

app.use(errorMiddleware);

export default app;