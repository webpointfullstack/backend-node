const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
const LoadRoutes = require("./routes/router");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/storage", express.static("storage"));

LoadRoutes(app);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
