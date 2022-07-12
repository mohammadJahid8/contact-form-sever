const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const formHandler = require("./formHandler");

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

//port
const port = process.env.PORT || 5000;

//express app initialization
const app = express();
app.use(express.json());

//cors
app.use(cors());
const corsConfig = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,authorization"
    );
    next();
});


//routes
app.use("/form", formHandler);



app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`project listening on port ${port}`);
});