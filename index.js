const express = require('express');
const mongoose = require("mongoose");
const formHandler = require("./formHandler");
//port
const port = process.env.PORT || 5000;
const cors = require("cors");

//express app initialization
const app = express();
app.use(express.json());

//cors
app.use(cors());

//database connection with mongoose
// contactDB
// OZz3wWRtP5OY78Xh
mongoose.connect("mongodb+srv://contactDB:OZz3wWRtP5OY78Xh@cluster0.dydxs.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection failed!");
    })


//routes
app.use("/form", formHandler);



app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`project listening on port ${port}`);
});