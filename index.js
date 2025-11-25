const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("Server is run successfully!");
});
app.listen(port, () => {
  console.log("your port is :)");
});
