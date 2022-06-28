const { create, destroy } = require("../controllers/image-source");

const router = require("express").Router();

router.post("/", create);
router.delete("/:id", destroy);

module.exports = router;
