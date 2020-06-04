const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const shutdown = require("http-shutdown");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("docs/swagger.yaml");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Only connect to the database if we are in prod
if (process.env.NODE_ENV === "production") {
  const db = require("./config/keys").mongo_uri;
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connection successful"))
    .catch((err) => console.error(err));
}

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use("/api/users", users);

const port = process.env.PORT || 5500;
let server = app.listen(port, async () => {
  console.log(`server running on port ${port}`);
});

const stop = () => {
  console.log("Closing server...");

  if (process.env.NODE_ENV === "production") {
    mongoose.disconnect();
  }

  server.shutdown(() => {
    console.log("Server closed.");
  });
};

server = shutdown(server);
module.exports = server;
module.exports.stop = stop;
