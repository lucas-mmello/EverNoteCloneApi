const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.post("/register", controller.registrar);

router.post("/login", controller.logar);

router.put("/", withAuth, controller.atualizar);

router.put("/password", withAuth, controller.senhaNova);

router.delete("/", withAuth, controller.excluir);

module.exports = router;
