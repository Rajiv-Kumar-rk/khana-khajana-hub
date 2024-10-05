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
import orderRouter from "./src/routes/order.route.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/foodItems", foodRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/user/wishlist", wishlistRouter);
app.use("/api/v1/user/cart", cartRouter);
app.use("/api/v1/user/order", orderRouter);

export { app };