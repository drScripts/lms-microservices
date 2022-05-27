const { post, find, logout } = require("../controllers/refreshToken");

const router = require("express").Router();

router.post("/", post);
router.get("/:refreshtkn", find);
router.post("/logout", logout);

module.exports = router;
