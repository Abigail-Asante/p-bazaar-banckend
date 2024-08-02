import express from "express";
import { dbconnection } from "./config/db.js";
import userRouter from "./routes/user_route.js";


// create server
const app = express();

// connect database
dbconnection();

// apply middlewares
app.use(express.json());

// connect router
app.use(userRouter);




// listen to response
const port = process.env.PORT || 7000
app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})