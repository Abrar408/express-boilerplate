const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "100mb" }));
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello there!" });
});

module.exports = app;
