const express = require("express");
const router = express.Router();
const statusCodes = require("../config/statusCodes");
const { log, levels } = require("../utils/logger");
const logbookService = require("../db/services/logbook-service");

/**
 * Gets logbook for user
 */
router.get("/:userId", async (req, res) => {
  let response = {
    entries: [],
    errors: [],
  };
  let status = statusCodes.OK;
  const id = req.paramString("userId");

  try {
    response.entries = await logbookService.getLogbooksForUser(id);
  } catch (err) {
    log(`GET /api/logbooks/${id}`, err, levels.WARN);
    response.errors = ["Internal Server Error"];
    status = statusCodes.INTERNAL_SERVER_ERROR;
  }

  res.status(status).json(response);
});

module.exports = router;
