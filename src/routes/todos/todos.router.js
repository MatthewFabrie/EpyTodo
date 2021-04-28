const {
    createTodo,
    getTodoByID,
    updateTodo,
    deleteTodo,
    getTodos,
} = require("../../middleware/todo");
const { checkToken } = require("../../middleware/auth");
const express = require('express');
const { getID } = require('./todos.query');
// const { route } = require("../../middleware/login.route");
const router = express.Router();
const app = express();

router.post("/todo", checkToken, createTodo);
router.get("/todo/:id", checkToken, getTodoByID);
router.put("/todo/:id", checkToken, updateTodo)
router.delete("/todo/:id", checkToken, deleteTodo);
router.get("/todo", checkToken, getTodos);

module.exports = router;