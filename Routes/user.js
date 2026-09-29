const express = require("express");
const router = express.Router();
const UserCollection = require("../Controllers/user");
router.post("/", UserCollection.register);
module.exports = router;
