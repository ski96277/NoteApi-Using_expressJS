//init express
const express = require("express");
const app = express();

const dotenv = require("dotenv");
//init dotenv
dotenv.config();

//get quotes file
const quotes = require("./data/quotes.json");
//router setup
const userRoutes = require("./routes/userRoutes");
const notesRoutes = require("./routes/notesRoutes");
// init mongoose
const mongoose = require("mongoose");
const cors = require("cors")
//cors init
app.use(cors());
//receive all data as json format
app.use(express.json());

//init port number
const portNumber = process.env.PORT || 4000;
//add middle ware to view all the request
app.use((req, res, next) => {
  console.log("HTTP Method == " + req.method + ", URL = " + req.url);
  next();
});

app.use("/users", userRoutes);
app.use("/note", notesRoutes);

app.get("/", (req, res) => {
  console.log("call base url");
  return res.send("Note Api From Imran");
});

app.get("/quotes", (req, res) => {
  return res.status(200).json(quotes);
});

app.get("/random", (req, res) => {
  // get a random number
  let index = Math.floor(Math.random() * quotes.length);
  console.log("index is. = " + index);

  return res.status(200).json(quotes[index]);
});
//connect mongoes
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    //listen server
    app.listen(portNumber, () => {
      console.log(`Server started on port ${portNumber}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connected error" + error);
  });
