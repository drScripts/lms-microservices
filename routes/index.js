const { register, login, update } = require("../controllers/users");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/:id", update);

module.exports = router;
