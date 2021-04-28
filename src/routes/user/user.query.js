const db = require('../../config/db');

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

module.exports = {
    getUserByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.query(
                `select id, email, password, name, firstname, created_at from user where email = ?`,
                [email],
                (error, results, fields) => {
                    if (error)
                        return reject(error)
                    return resolve(results[0]);
                })
            });
        },
    getUserByEmailorId: (data) => {
        return new Promise((resolve, reject) => {
            data = data + "";
            if (data.indexOf("@") != -1) {
                db.query(
                    `select id, email, password, created_at, firstname, name from user where email = ?`,
                    [data],
                    (error, results, fields) => {
                        if (error)
                            return reject(error)
                        return resolve(results[0]);
                })
            }
            else if (data.indexOf("@") === -1) {
                db.query(
                    `select id, email, password, created_at, firstname, name from user where id = ?`,
                    [data],
                    (error, results, fields) => {
                        if (error)
                            return reject(error)
                        return resolve(results[0]);
                }) 
            }
        })
    },
    create: (data) => {
        return new Promise((resolve, reject) => {
            db.query(
                `select id, email, password, name, firstname, created_at from user where email = ?`,
                [data.email],
                (error, results, fields) => {
                    if (error)
                        return reject(error)
                    if (!isEmptyObject(results)){
                        results = -1;
                        return resolve(results);
                    }
                }
            )
            db.query(
                `insert into user(email, password, name, firstname, created_at)
                value(?,?,?,?,?)`,
                [
                    data.email,
                    data.password,
                    data.name,
                    data.firstname,
                    new Date()
                ],
                (error, result, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result);
                }
            )
        })
    },
    getUsers: () => {
        return new Promise((resolve, reject) => {
            db.query(
                `select id, email, password, name, firstname, created_at from user`,
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
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `select id, email, password, name, firstname, created_at from user where id = ?`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            )
        });
    },
    updateUser: (data) => {
        return new Promise((resolve, reject) => {
            const created_at = undefined;
            db.query(
                `update user set email=?, password=?, name=?, firstname=? where id = ?`,
                [
                    data.email,
                    data.password,
                    data.name,
                    data.firstname,
                    data.id
                ],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    if (results.affectedRows === 0)
                        return reject(error);
                    db.query(
                        `select created_at from user where id = ?`,
                        [
                            data.id
                        ],
                        (errors, result, fields) => {
                            if (errors) {
                                return reject(errors);
                            }
                            if (isEmptyObject(result))
                                return resolve(result)
                            results.created_at = result[0].created_at;
                            return resolve(results);
                        }
                    )
                }
            )
        });
    },
    deleteUser: (id) => {
        return new Promise((resolve, reject) => {
            db.query(
                `delete from user where id = ?`,
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