require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const routes = require("./routes/routes");

const app = express();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(routes);
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // LOGS
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
); // LIBERAR O ACESSO A ARQUIVOS ESTATICOS LOCAIS

app.use(cors());

app.listen(3333, () => {
  console.log(`🚀 - Express started at ${process.env.MONGO_URL}`);
});
