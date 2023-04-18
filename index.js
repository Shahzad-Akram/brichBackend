const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const AWS = require("aws-sdk");

// create App

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// routes middleware
app.use("/api/auth/", require("./routes/auth"));
app.use("/api/leads/", require("./routes/leads"));
app.use("/api/user/", require("./routes/user"));

// port to run our app
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
