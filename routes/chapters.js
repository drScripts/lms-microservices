const {
  getAll,
  get,
  create,
  update,
  destroy,
} = require("../controllers/chapters");

const router = require("express").Router();

router.get("/", getAll);
router.get("/:id", get);
router.post("/", create);
router.patch("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
