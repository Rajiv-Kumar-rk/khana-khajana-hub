import dotenv from "dotenv";
import connectDB from "./src/config/db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "food_order_app/backend/.env"
})

connectDB()
.then(() => {
    const port = process.env.POST || 8000;

    app.on("error", (error) => {
        console.log("ERROR: ", error);
        throw error;
    });

    app.listen(port, () => {
        console.log(`Server is running at port: ${port}`);
    });
})
.catch((error) => {
    console.log("MONGODB CONNECTION FAILED:: ", error);
});