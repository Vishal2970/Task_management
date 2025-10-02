import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URI = process.env.URI;

const ConnectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Connected to database");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default ConnectDB;
