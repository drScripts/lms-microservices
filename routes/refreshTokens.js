const { post, find } = require("../controllers/refreshToken");

const router = require("express").Router();

router.post("/", post);
router.get("/:refreshtkn", find);

module.exports = router;
