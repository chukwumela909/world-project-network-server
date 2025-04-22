const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome To World Impact Project FundRaiser Platform");
});

mongoose
  .connect(
    "mongodb+srv://amirizew:ayIZbj2h2RRuv0ig@cluster0.ygmkygr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Use the main router
app.use("/api", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: "Something went wrong" });
});

// Set the port for the app
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
