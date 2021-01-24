const db = require("../db/config");

module.exports = {
  getUsers: (callback) => {
    var sql = `select users.email, 
                      users.ho, 
                      users.ten, 
                      users.status, 
                      role.title 
                      from users INNER JOIN role ON role.id=users.role_id where role_id != 1`;
    db.query(sql, (err, data) => {
      if (err) throw err;
      return callback(data);
    });
  },
  getUserByEmailPassword: (body, callback) => {
    var sql = `select * from users where email = ? and matkhau = ? and status = 1`;
    db.query(sql, [body.email, body.matkhau], (err, data, fields) => {
      if (err) throw err;
      if (data) return callback(data[0]);
      else return callback(null);
    });
  },

  getUserByEmail: (body, callback) => {
    var sql = `select 
              users.ho, 
              users.ten, 
              users.email, 
              users.status, 
              users.role_id, 
              role.title from users 
              INNER JOIN role ON users.role_id = role.id  where users.email = ?`;
    db.query(sql, [body.email], (err, data, fields) => {
      if (err) throw err;
      if (data) return callback(data[0]);
      else return callback(null);
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

  updateStatusUserByEmail: (body, callback) => {
    var sql = "update `users` set `status` = ? where `email` = ?";
    db.query(sql, [body.status, body.email], (err, data) => {
      if (err) throw err;
      else {
        return callback(data.affectedRows);
      }
    });
  },
};
