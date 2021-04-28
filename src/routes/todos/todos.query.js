const db = require('../../config/db');

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

module.exports = {
    getTodoByID: (id) => {
        return new Promise((resolve, reject) => {
                db.query(
                    `select id, title, description, created_at, due_time, user_id, status from todo where id = ?`,
                    [id],
                    (error, results, fields) => {
                        if (error)
                            return reject(error)
                        return resolve(results[0]);
                })
            }
        );
    },
    getTodosByUserId: (user_id) => {
        return new Promise((resolve, reject) => {
                db.query(
                    `select id, title, description, created_at, due_time, status from todo where user_id = ?`,
                    [user_id],
                    (error, results, fields) => {
                        if (error)
                            return reject(error)
                        return resolve(results[0]);
                })
            }
        );
    },
    create: (data) => {
        return new Promise((resolve, reject) => {
            db.query(
                `insert into todo(title, description, created_at, due_time, user_id)
                value(?,?,?,?,?)`,
                [
                    data.title,
                    data.description,
                    data.created_at = new Date(),
                    data.due_time,
                    data.user_id
                ],
                (error, result, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    data.status = 'not started';
                    return resolve(data);
                }
            )
        })
    },
    getTodos: () => {
        return new Promise((resolve, reject) => {
            db.query(
                `select id, title, description, created_at, due_time, status, user_id from todo`,
                [],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    updateTodo: (data) => {
        return new Promise((resolve, reject) => {
            db.query(
                `update todo set title=?, description=?, due_time=?, status=? where id = ?`,
                [
                    data.title,
                    data.description,
                    data.due_time,
                    data.status,
                    data.id
                ],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(data);
                }
            )
        });
    },
    deleteTodo: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `delete from todo where id = ?`,
                [id],
                (error, results, fields) => {
                    if (error)
                        return reject(error);
                    if (results.affectedRows === 0)
                        return reject(error);
                    return resolve(results);
                }
            )
        });
    }
};