const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const transactionRoutes = require("./routes/transaction"); // Import the routes
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

// Use the transaction routes
app.use("/api", transactionRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
