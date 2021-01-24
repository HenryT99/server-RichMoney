const db = require("../db/config");

module.exports = {
  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      var sql = `
      select
       t1.id, 
       t1.email, 
       t1.ho, 
       t1.ten, 
       t1.status, 
       t1.role_name, 
       t2.email as parent from 
        (select 
          users.id, 
          users.email, 
          users.parent_id, 
          users.ho, 
          users.ten, 
          users.status, 
          role.title as role_name 
          from users INNER JOIN role 
          ON users.role_id = role.id) t1, users t2 
          where t1.parent_id = t2.id
      `;
      db.query(sql, (err, data) => {
        if (err) reject(new Error(err));
        return resolve(data);
      });
    });
  },

  getUserByEmailPassword: (body) => {
    return new Promise((resolve, reject) => {
      var sql = `select * from users where email = ? and matkhau = ? and status = 1`;
      db.query(sql, [body.email, body.matkhau], (err, data) => {
        if (err) reject(new Error(err));
        if (data) return resolve(data[0]);
        else return resolve(null);
      });
    });
  },

  getUserByEmail: (body) => {
    return new Promise((resolve, reject) => {
      var sql = `select 
      users.ho, 
      users.ten, 
      users.email, 
      users.status, 
      users.role_id, 
      role.title from users 
      INNER JOIN role ON users.role_id = role.id  where users.email = ?`;

      db.query(sql, [body.email], (err, data) => {
        if (err) reject(new Error(err));
        if (data) return resolve(data[0]);
        else return resolve(null);
      });
    });
  },

  updateUser: (body, callback) => {
    var sql =
      "update `users` set `ho` = ?, `ten` = ?, `create` = ?, `edit` = ?, `delete` = ?, `view` = ? where `email` = ?";
    db.query(
      sql,
      [
        body.ho,
        body.ten,
        body.create === true ? 1 : 0,
        body.edit === true ? 1 : 0,
        body.delete === true ? 1 : 0,
        body.view === true ? 1 : 0,
        body.email,
      ],
      (err, data) => {
        if (err) throw err;
        else {
          return callback(data.affectedRows);
        }
      }
    );
  },

  deleteUserByEmail: (body, callback) => {
    var sql = "delete from users where email = ?";
    db.query(sql, [body.email], (err, data, fields) => {
      if (err) throw err;
      else return callback(data);
    });
  },

  createUser: (body, callback) => {
    var sql =
      "insert into users (`email`, `matkhau`, `ho`, `ten`, `create`, `delete`, `edit`, `view`) value(?,?,?,?,?,?,?,?)";
    db.query(
      sql,
      [
        body.email,
        body.matkhau,
        body.ho,
        body.ten,
        body.create === true ? 1 : 0,
        body.delete === true ? 1 : 0,
        body.edit === true ? 1 : 0,
        body.view === true ? 1 : 0,
      ],
      (err, data) => {
        if (err) throw err;
        else return callback(data);
      }
    );
  },

  updateStatusUserByEmail: (body) => {
    return new Promise((resolve, reject) => {
      var sql = "update `users` set `status` = ? where `email` = ?";
      db.query(sql, [body.status, body.email], (err, data) => {
        if (err) reject(new Error(err));
        else {
          return resolve(data.affectedRows);
        }
      });
    });
  },

  isAdminUser: (body) => {
    return new Promise((resolve, reject) => {
      var sql = `select users.email, 
      users.ho, 
      users.ten, 
      users.status, 
      users.role_id
      from users  where status = 1`;
      db.query(sql, (err, data) => {
        if (err) reject(new Error(err));
        if (data) return resolve(data[0]);
        else return resolve(null);
      });
    });
  },
};
