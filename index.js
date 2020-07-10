const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const shutdown = require("http-shutdown");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocUsers = YAML.load("docs/openapi/users.yaml");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Only connect to the database if we are in prod
if (process.env.NODE_ENV === "production") {
  const db = require("./config/keys").mongo_uri;
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connection successful"))
    .catch((err) => console.error(err));
}

app.use("/api-docs/users", swaggerUI.serve, swaggerUI.setup(swaggerDocUsers));
app.use("/api/users", users);

const port = process.env.PORT || 5000;
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

const serveProdClient = () => {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get(/^\/(?!api).*/, (req, res) => {
      res.sendFile(path.join(__dirname, "./client/build/index.html"));
    });

    console.log("Serving React App...");
  }
};
serveProdClient();

server = shutdown(server);
module.exports = server;
module.exports.stop = stop;
