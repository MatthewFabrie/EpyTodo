const { createUser,
    getUserByEmail,
    getUserById,
    getUsers,
    deleteUser,
    updateUser,
    login,
    getUserByEmailorId,
    userTodos,
    getUserByToken
} = require("../../middleware/auth");
const express = require('express');
const router = express.Router();
const app = express();
const { checkToken } = require("../../middleware/auth");

router.get("/user", checkToken, getUsers);
router.get("/user/todos", checkToken, userTodos);
router.get("/user/:email", checkToken, getUserByEmailorId);
router.get("/user/:id", checkToken, getUserByEmailorId);
router.put("/user/:id", checkToken, updateUser);
router.delete("/user/:id", checkToken, deleteUser);


module.exports = router;