const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./config/keys").mongo_uri;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error(err));
