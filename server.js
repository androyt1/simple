import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { AuthRouter } from "./routes/User.js";
dotenv.config();

mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("Database Successfully Connected");
    })
    .catch((error) => {
        console.log("Something went wrong ", error);
    });
const app = express();

//middlewares
app.use(cors({ origin: "https://simple-tlte.onrender.com", credentials: true }));

app.options("*", cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.json(urlencoded({ extended: true })));

app.use("/api/v1/auth", AuthRouter);

const port = 5050 || process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
