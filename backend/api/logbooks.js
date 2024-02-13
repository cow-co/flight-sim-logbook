const express = require("express");
const router = express.Router();
const statusCodes = require("../config/statusCodes");
const { log, levels } = require("../utils/logger");

router.get("/", async (req, res) => {
  res.status(statusCodes.OK).json({ logbook: {} });
});

module.exports = router;
