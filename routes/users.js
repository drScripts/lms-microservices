const { register, login, profile } = require("../controllers/users");
const jwtMiddleware = require("../middleware/jwtMiddleware");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", jwtMiddleware, profile);

module.exports = router;
