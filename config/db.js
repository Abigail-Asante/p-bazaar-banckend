import mongoose from "mongoose";
import "dotenv/config";

// create db connection
const connectionString = process.env.MONGO_URL

export const dbconnection = () => {
    mongoose.connect(connectionString).then(() => {
        console.log('Database is connected')
    })
};