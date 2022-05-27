const router = require("express").Router();
const multer = require("multer");
const os = require("os");
const { list, post, show, update, destroy } = require("../controllers/media");
const upload = multer({ dest: os.tmpdir() });

router.get("/", list);
router.get("/:id", show);
router.post("/", upload.single("media"), post);
router.patch("/:id", upload.single("media"), update);
router.delete("/:id", destroy);

module.exports = router;
