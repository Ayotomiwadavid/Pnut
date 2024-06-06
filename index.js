const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const router = require('./Routes/router');
require("dotenv").config();

mongoose.connect("mongodb://localhost:27017/Pnut", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", (err) => {
  console.error(err);
});

db.once("open", () => {
  console.log("Database has successfully connected to MongoDb!");
});

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("clientside"));
app.use('/', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is now running on port " + PORT);
});