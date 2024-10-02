import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.static("public"));

app.use(cookieParser());

// routes
import userRouter from "./src/routes/user.route.js";
import foodRouter from "./src/routes/foodItem.route.js";
import categoryRouter from "./src/routes/category.route.js";
import cartRouter from "./src/routes/cart.route.js";
import wishlistRouter from "./src/routes/wishlist.route.js";

// routes declaration
app.use("/users", userRouter);
app.use("/api/foodItems", foodRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/user/wishlist", wishlistRouter);
app.use("/api/user/cart", cartRouter);

export { app };