const { createUser,
    login,
} = require("../../middleware/auth");

const express = require('express');
const router = express.Router();
const app = express();
const { checkToken } = require("../../middleware/auth");

router.post("/register", createUser);
router.post("/login", login);

module.exports = router;