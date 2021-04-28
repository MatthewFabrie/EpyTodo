const { create,
    getUserByEmail,
    getUserById,
    getUsers,
    deleteUser,
    updateUser,
    getUserByEmailorId
} = require('../routes/user/user.query');
const { getTodosByUserId } = require('../routes/todos/todos.query');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { verify } = require('jsonwebtoken');

function isEmptyObject(obj) {
    if (obj === null || obj === undefined)
        return (false);
    return !Object.keys(obj).length;
}

module.exports = {
    checkToken: (req, res, next) => {
        const authHeader = req.headers['authorization'];
        let token = authHeader && authHeader.split(' ')[1]
        if (token) {
            verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    res.status(498).json({
                        msg: "Token is not valid"
                    });
                }
                else {
                    next();
                }
            });
        }
        else {
            res.status(499).json({
                msg: "No token, authorization denied"
            });
        }
    },
    createUser: async (req, res) => {
    const body = req.body;
    const salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(body.password, salt);
    const result = await create(body);
        try {
            if (result === -1)
                return res.status(409).json({
                    msg: "account already exists"
                });
            body.id = result.insertId;
            const token = sign({ crypt: body}, process.env.SECRET, {expiresIn: "1h"});
            return res.status(201).json({
                token: token
            });
        }
        catch(e) {
            return res.status(500).json({
                msg: "internal server error"
            });
        }
    },
    getUserById: async (req, res) => {
        const id = req.params.id;
        try {
            const result = await getUserById(id);
            if (isEmptyObject(result)) {
                return res.status(404).json({
                    msg: "Not found"
                });
            }
            return res.status(200).json({
                "id": id, "email": result.email, "password": result.password, "created_at": result.created_at, "firstname": result.firstname, "name": result.name
            });
        }
        catch(e) {
            return res.status(500).json({
                msg: "internal server error"
            })
        }
    },
    getUserByToken: async (req, res) => {
        const authHeader = req.headers['authorization'];
        let token = authHeader && authHeader.split(' ')[1];
        let user_id = undefined;
        if (token) {
            verify(token, process.env.SECRET, (err, decoded) => {
                user_id = decoded.crypt.id;
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
        try {
            const result = await getUserById(user_id);
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
            })
        }
    },
    getUsers: async (req, res) => {
        try {
            const result = await getUsers();
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
    getUserByEmail: async (req, res) => {
        try {
            const email = req.params.email;
            const result = await getUserByEmail(email);
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
    getUserByEmailorId: async (req, res) => {
        try {
            if (req.params.email != undefined) {
                data = req.params.email;
            }
            else if (req.params.id != undefined){
                data = req.params.id;
            }
            const result = await getUserByEmailorId(data);
            if (isEmptyObject(result) || result === undefined || result === null) {
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
    updateUser: async (req, res) => {
        try {
            const id = req.params.id;
            const body = req.body;
            body.id = id;
            const salt = bcrypt.genSaltSync(10);
            body.password = bcrypt.hashSync(body.password, salt);
            const result = await updateUser(body);
            if (result === undefined || result === null || isEmptyObject(result)) {
                return res.status(400)
            }
            return res.status(200).json({
                    "id": body.id, "email": body.email, "password": body.password, "created_at": result.created_at, "firstname": body.firstname, "name": body.name
            });
        }
        catch(e) {
            return res.status(500).json({
                msg: "internal server error"
            });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const data = req.params.id;
            const result = await deleteUser(data);
            if (!result) {
                return res.status(404).json({
                    msg: "Not found"
                });
            }
            else {
                result.id = data;
                return res.status(200).json({
                    msg: "succesfully deleted record number: " + result.id
                });
            }
        }
        catch(e) {
            return res.status(500).json({
                msg: "internal server error"
            });
        }
    },
    login: async (req, res) => {
        const body = req.body;
        const result = await getUserByEmail(body.email);
        try {
            if (result === null || result === undefined) {
                return res.status(400).json({
                    msg: "Invalid Credentials"
                });
            }
            if (isEmptyObject(result)) {
                return res.status(400).json({
                    msg: "Invalid Credentials"
                });
            }
            const crypt = bcrypt.compareSync(body.password, result.password);
            if (crypt) {
                crypt.password = undefined;
                const token = sign({ crypt: result}, process.env.SECRET, {expiresIn: "1h"});
                return res.status(200).json({
                    token: token
                })
            }
            else {
                return res.status(400).json({
                    data: "Invalid email or password"
                })
            }
        }
        catch(e)
        {
            return res.status(500).json({
                msg: "internal server error"
            });
        }
    },
    userTodos: async (req, res) => {
        const authHeader = req.headers['authorization'];
        let token = authHeader && authHeader.split(' ')[1];
        let user_id = undefined;
        if (token) {
            verify(token, process.env.SECRET, (err, decoded) => {
                user_id = decoded.crypt.id;
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
        try {
            const result = await getTodosByUserId(user_id);
            if (result) {
                return res.status(200).json(
                    result
                );
            }
            else {
                return res.status(404).json({
                    msg: "Not found"
                });
            }
        }
        catch(e) {
            return res.status(500).json({
                msg: "internal server error"
            });
        }
    }
}