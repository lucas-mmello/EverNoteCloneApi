const express = require("express");
const router = express.Router();
const withAuth = require("../middlewares/auth");
const controller = require("../controllers/noteController");

router.post("/", withAuth, controller.criar);

router.get("/search", withAuth, controller.buscar);

router.get("/:id", withAuth, controller.selecionar);

router.get("/", withAuth, controller.listarTodas);

router.put("/:id", withAuth, controller.alterar);

router.delete("/:id", withAuth, controller.excluir);

module.exports = router;
