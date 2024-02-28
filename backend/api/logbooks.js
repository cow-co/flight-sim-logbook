const express = require("express");
const router = express.Router();
const statusCodes = require("../config/statusCodes");
const { log, levels } = require("../utils/logger");
const logbookService = require("../db/services/logbook-service");
const { verifyToken } = require("../middlewares/security-middleware");
const sanitize = require("sanitize");

const bodySanitiser = sanitize();

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
    const userLogbook = await logbookService.getLogbooksForUser(id);
    if (userLogbook) {
      response.entries = userLogbook.entries;
    }
  } catch (err) {
    log(`GET /api/logbooks/${id}`, err, levels.WARN);
    response.errors = ["Internal Server Error"];
    status = statusCodes.INTERNAL_SERVER_ERROR;
  }

  res.status(status).json(response);
});

router.post("", verifyToken, async (req, res) => {
  let response = {
    entries: [],
    errors: [],
  };
  let status = statusCodes.OK;

  try {
    const entry = bodySanitiser.primitives(req.body);
    await logbookService.addLogbookEntry(req.data.userId, entry);
  } catch (err) {
    log(`POST /api/logbooks/${id}`, err, levels.WARN);
    response.errors = ["Internal Server Error"];
    status = statusCodes.INTERNAL_SERVER_ERROR;
  }
});

module.exports = router;
