const express = require("express");
const router = express.Router();
const statusCodes = require("../config/statusCodes");
const { log, levels } = require("../utils/logger");
const logbookService = require("../db/services/logbook-service");

/**
 * Gets all logbooks
 */
router.get("/", async (req, res) => {
  let response = {
    logbooks: [],
    errors: [],
  };
  let status = statusCodes.OK;

  try {
    response.logbooks = await logbookService.getLogbooks();
  } catch (err) {
    log("GET /api/logbooks/", err, levels.WARN);
    response.errors = ["Internal Server Error"];
    status = statusCodes.INTERNAL_SERVER_ERROR;
  }

  res.status(status).json(response);
});

module.exports = router;
