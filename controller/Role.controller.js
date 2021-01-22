const e = require("express");
const db = require("../db/config");
const JWT = require("jsonwebtoken");
const roleModel = require("../models/Role.model");

const Base64 = require("crypto-js/enc-base64");

const { json } = require("body-parser");
const RoleModel = require("../models/Role.model");

module.exports = {
  getAllActiveRole(req, res) {
    const token = req.cookies.Token;
    const decodeToken = JWT.decode(token, "mk");
    if (!decodeToken) {
      return res.json({
        code: 400,
      });
    }
    roleModel.getAllActiveRole((data) => {
      res.json({
        code: 200,
        data: data,
      });
    });
  },
};
