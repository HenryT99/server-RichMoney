const e = require("express");
const db = require("../db/config");
const JWT = require("jsonwebtoken");
const userModel = require("../models/User.model");

const Base64 = require("crypto-js/enc-base64");

const { json } = require("body-parser");

module.exports = {
  //Lấy tất cả users
  getUsers: function (req, res) {
    try {
      const token = req.cookies.Token;
      const decodeToken = JWT.decode(token, "mk");
      if (!decodeToken) {
        return res.json({
          code: 400,
        });
      }

      userModel.getUsers((data) => {
        data.forEach((element) => {
          delete element.matkhau;
        });
        res.json({
          code: 200,
          users: data,
        });
      });
    } catch (err) {
      //Bắt lỗi kiểm tra token
      res.json(err.message);
    }
  },

  //Thay đổi status
  updateStatusUserByEmail(req, res) {
    const token = req.cookies.Token;
    const decodeToken = JWT.decode(token, "mk");
    userModel.getUserByEmail(decodeToken, (data) => {
      if (data) {
        userModel.updateStatusUserByEmail(req.body, (data) => {
          res.json({
            code: 200,
          });
        });
      } else {
        res.json({
          code: 400,
          status: "Failed",
        });
      }
    });
  },

  //Lấy user theo email phải có token
  getUserByEmailWithToken(req, res) {
    const token = req.cookies.Token;
    const decodeToken = JWT.decode(token, "mk");
    userModel.getUserByEmail(decodeToken, (data) => {
      if (data) {
        userModel.getUserByEmail(req.params, (data) => {
          delete data.matkhau;
          res.json({
            code: 200,
            user: data,
          });
        });
      } else {
        res.json({
          code: 400,
          status: "Failed",
        });
      }
    });
  },

  //Update user
  updateUser: (req, res) => {
    try {
      userModel.updateUser(req.body, (data) => {
        if (data)
          res.json({
            code: 200,
          });
      });
    } catch (err) {
      res.json({
        code: 400,
      });
    }
  },

  //Delete user
  deleteUserByEmail: (req, res) => {
    try {
      userModel.deleteUserByEmail(req.params, (data) => {
        if (data)
          res.json({
            code: 200,
          });
      });
    } catch (error) {
      res.json({
        code: 400,
        status: error.message,
      });
    }
  },
  //Tạo người dùng
  createUser: (req, res) => {
    try {
      userModel.createUser(req.body, (data) => {
        if (data) {
          res.json({
            code: 200,
          });
        }
      });
    } catch (err) {
      res.json({
        code: 400,
        status: err.message,
      });
    }
  },
  login: (req, res) => {
    userModel.getUserByEmailPassword(req.body, (data) => {
      if (data) {
        //Tạo sign trong JWT
        const token = JWT.sign(
          {
            email: data.email,
          },
          "mk",
          { expiresIn: 3600 * 100 }
        );

        res.set("Token", token);

        res.send({
          code: 200,
          user: Buffer.from(
            JSON.stringify({
              email: data.email,
            })
          ).toString("base64"),
        });
      } else {
        return res.json({
          code: 400,
        });
      }
    });
  },

  getUserLogin: (req, res) => {
    try {
      const token = req.cookies.Token;

      JWT.verify(token, "mk", (err, data) => {
        if (err)
          res.json({
            code: 400,
          });
        else {
          const decodeToken = data;

          userModel.getUserByEmail(decodeToken, (data) => {
            delete data.matkhau;
            res.json({
              code: 300,
              user: data,
            });
          });
        }
      });
    } catch (err) {
      res.json({ code: 200 });
    }
  },

  logoutUser: (req, res) => {
    JWT.res.json({ code: 200 });
  },
};
