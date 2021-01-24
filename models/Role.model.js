const db = require("../db/config");

module.exports = {
  getAllActiveRole() {
    return new Promise((resolve, reject) => {
      var sql = `select role.id, role.title from role where role.status = 1 and role.id !=1`;
      db.query(sql, (err, data) => {
        if (err) reject(new Error(err));
        return resolve(data);
      });
    });
  },
};
