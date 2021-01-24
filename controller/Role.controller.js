const e = require("express");
const db = require("../db/config");
const JWT = require("jsonwebtoken");
const roleModel = require("../models/Role.model");

const Base64 = require("crypto-js/enc-base64");

const { json } = require("body-parser");

const { verifyToken } = require("../services/verifyToken");

module.exports = {
  async getAllActiveRole(req, res) {
    try {
      const token = req.cookies.Token;

      const decodeToken = await verifyToken(token);

      if (!decodeToken) {
        return res.json({
          code: 400,
        });
      }

      const result = await roleModel.getAllActiveRole();

      return res.json({
        code: 200,
        data: result,
      });
    } catch (err) {
      return res.json({
        code: 500,
      });
    }
  },
};
