const express = require("express");
const router = express.Router();
const userRealityController = require("../controllers/userRealityController.controller");
const authorize = require("../middleware/authorize");

router.use(authorize.authorization);
router.get("/my-reality/:id", userRealityController.getMyReality);
router.post("/addEdit-reality", userRealityController.addEditReality);

module.exports = router;
