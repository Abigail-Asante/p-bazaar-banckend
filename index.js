import express from "express";


// create server
const app = express();






// listen to response
const port = process.env.PORT || 7000
app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})