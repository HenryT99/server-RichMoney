const router = require("express").Router();

const user = require("../controller/User.controller");

router.get("/", user.getUsers);

router.post("/login", user.login);

router.get("/get-user-login", user.getUserLogin);

router.get("/logout", user.logoutUser);

router.get("/:email", user.getUserByEmail);

router.post("/status", user.updateStatusUserByEmail);

router.post("/update", user.updateUser);

router.post("/delete/", user.deleteUserByEmail);

router.post("/create", user.createUser);

module.exports = router;
