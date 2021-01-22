const db = require("../db/config");

module.exports = {
  getAllActiveRole(callback) {
    var sql = `select role.id, role.title from role where role.status = 1`;
    db.query(sql, (err, data) => {
      if (err) throw err;
      return callback(data);
    });
  },
};
