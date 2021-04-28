const { create,
        getTodoByID,
        updateTodo,
        deleteTodo,
        getTodos,
        getTodosByUserId } = require('../routes/todos/todos.query');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { verify } = require('jsonwebtoken');
const { checkToken } = require('./auth');
// const { getMaxListeners } = require('node:process');

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

module.exports = {
    createTodo: async (req, res) => {
        const authHeader = req.headers['authorization'];
        let token = authHeader && authHeader.split(' ')[1];
        if (token) {
            verify(token, process.env.SECRET, (err, decoded) => {
                req.body.user_id = decoded.crypt.id;
                if (err) {
                    res.status(498).json({
                        msg: "Token is not valid"
                    });
                }
            });
        }
        else {
            res.status(499).json({
                msg: "No token, authorization denied"
            });
        }
        const result = await create(req.body);
        try {
            return res.status(201).json({
                "title": result.title, "description": result.description, "due_time": result.due_time, "user_id": result.user_id, "status": result.status
            });
        }
        catch(e) {
            return res.status(500).json({
                msg: "internal server error"
            });
        }
    },
    getTodoByID: async (req, res) => {
        const id = req.params.id;
        try {
            const result = await getTodoByID(id);
            if (isEmptyObject(result)) {
                return res.status(404).json({
                    msg: "Not found"
                });
            }
            return res.status(200).json(
                result
            );
        }
        catch(e) {
            return res.status(500).json({
                msg: "internal server error"
            });
        }
    },
    updateTodo: async (req, res) => {
        try {
            const id = req.params.id;
            const body = req.body;
            body.id = id;
            const result = await updateTodo(body);
            const print = await getTodoByID(body.id);
            if (!result) {
                return res.status(404).json({
                    msg: "Not found"
                });
            }
            return res.status(200).json({
                "title": print.title, "description": print.description, "due_time": print.due_time, "user_id": print.user_id, "status": print.status
            });
        }
        catch(e) {
            return res.status(500).json({
                msg: "internal server error"
            });
        }
    },
    deleteTodo: async (req, res) => {
        try {
            const data = req.params.id;
            const result = await deleteTodo(data);
            if (!isEmptyObject(result)) {
                return res.status(404).json({
                    msg: "Not found"
                });
            }
            else {
                return res.status(200).json({
                    msg: "succesfully deleted record number: " + data
                });
            }
        }
        catch(e) {
            return res.status(500).json({
                msg: "internal server error"
            });
        }
    },
    getTodos: async (req, res) => {
        try {
            const result = await getTodos();
            return res.status(200).json(
                result
            );
        }
        catch(e) {
            return res.status(500).json({
                msg: "internal server error"
            });
        }
    }
}