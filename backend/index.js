const express = require("express");
const swaggerUI = require("swagger-ui-express");
const mongoose = require("mongoose");
const YAML = require("yamljs");
const { SwaggerTheme } = require("swagger-themes");
const https = require("https");
const http = require("http");
const { default: rateLimit } = require("express-rate-limit");
const path = require("path");
const sanitize = require("sanitize");
const { levels, log } = require("./utils/logger");

const logbooks = require("./api/logbooks");

const swaggerDoc = YAML.load("openapi/openapi.yaml");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitize.middleware);

if (process.env.NODE_ENV === "production") {
  log("index", "Connecting to db", levels.INFO);
  const db = require("./config/dbConfig").mongo_uri;
  mongoose
    .connect(db)
    .then(() => {
      log("index", "MongoDB connection successful", levels.INFO);
    })
    .catch((err) => log("index.js", err, levels.ERROR));
  mongoose.set("sanitizeFilter", true); // Sanitise by default

  // Uses an in-memory store, which should be fine for most purposes.
  // If you're especially worried, you can simply reduce the rate/window
  const limiter = rateLimit({
    windowMs: securityConfig.rateLimit.windowTimeMS,
    limit: securityConfig.rateLimit.maxRequestsInWindow,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  });
  app.use(limiter);
}

app.use(express.static(path.join(__dirname, "build")));
app.use("/api/logbooks", logbooks);

const theme = new SwaggerTheme();
const darkStyle = theme.getBuffer("dark");
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDoc, { customCss: darkStyle })
);

const port = process.env.PORT || 443;
let server = null;
const stop = () => {
  log("index", "Closing server...", levels.INFO);

  if (process.env.NODE_ENV === "production") {
    mongoose.disconnect();
  }

  server.close();
};

const serve = () => {
  if (process.env.NODE_ENV === "production") {
    server = https.createServer(app).listen(port, async () => {
      log("index", `Server running on port ${port}`, levels.INFO);
    });
    app.use(express.static("client/build"));
    app.get(/^\/(?!api).*/, (req, res) => {
      res.sendFile(path.join(__dirname, "./build/index.html"));
    });

    log("index", "Serving frontend...", levels.INFO);
  } else {
    server = http.createServer(app).listen(port, async () => {
      log("index", `Server running on port ${port}`, levels.INFO);
    });
  }
};

serve();

module.exports = server;
module.exports.stop = stop;
