const express = require("express");
const router = express.Router();
const ResumeController = require("../Controllers/resume");
const  upload  = require("../utils/multer");
router.post("/", upload.single("resume"), ResumeController.addResume);
module.exports = router;
