const router = require("express").Router();

const model = require("../controller/Role.controller");

router.get("/", model.getAllActiveRole);

module.exports = router;
