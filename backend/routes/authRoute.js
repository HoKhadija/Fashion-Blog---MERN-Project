const router = require("express").Router();
const { registerUserCTRL, loginUserCtrl } = require("../controllers/authController");

// /api/auth/register
router.post("/register", registerUserCTRL);

// /api/auth/login
router.post("/login", loginUserCtrl);


module.exports = router;