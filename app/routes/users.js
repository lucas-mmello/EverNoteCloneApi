const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.post("/register", controller.registrar);

router.post("/login", controller.logar);

module.exports = router;
