import express from "express";
import cors from "cors";
import expressOasGenerator from "@mickeymond/express-oas-generator";
import { dbconnection } from "./config/db.js";
import userRouter from "./routes/user_route.js";
import mongoose from "mongoose";


// create server
const app = express();
expressOasGenerator.handleResponses(app, {
alwaysServeDocs: true,
tags: ['auth'],
mongooseModels: mongoose.modelNames(),

})
// connect database
dbconnection();

// apply middlewares
app.use(express.json());
app.use(cors({credentials:true, origin:'*'}));

// connect router
app.use(userRouter);


// Apply swagger documentation
expressOasGenerator.handleRequests(app, {
    alwaysServeDocs: true,
});
app.use((req, res) => res.redirect('/api-docs'));

// listen to response
const port = process.env.PORT || 7000
app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})