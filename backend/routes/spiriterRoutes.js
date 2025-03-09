const express = require("express");
const router = express.Router();
const { askSpiriter } = require("../controllers/spiriterController");

router.post("/ask", askSpiriter); 

module.exports = router;
