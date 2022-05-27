const router = require("express").Router();
const { list, show, update, destroy, post } = require("../controllers");
const os = require("os");
const multer = require("multer");
const upload = multer({
  dest: os.tmpdir(),
});

router.get("/", list);
router.get("/:id", show);
router.patch("/:id", upload.single("media"), update);
router.delete("/:id", destroy);
router.delete("/:id/:foce", destroy);
router.post("/", upload.single("media"), post);

module.exports = router;
