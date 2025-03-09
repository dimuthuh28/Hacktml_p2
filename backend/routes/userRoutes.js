const express = require("express");
const {
  signup,
  login,
  dashboard,
  getUserRole,
} = require("../controllers/UserController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/dashboard", dashboard);
router.post("/get-role", getUserRole);

module.exports = router;
