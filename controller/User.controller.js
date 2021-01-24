const e = require("express");
const db = require("../db/config");
const JWT = require("jsonwebtoken");
const userModel = require("../models/User.model");

const Base64 = require("crypto-js/enc-base64");

const { json } = require("body-parser");
const { verifyToken } = require("../services/verifyToken");
const { response } = require("express");

module.exports = {
  //Lấy tất cả users
  getUsers: async function (req, res) {
    try {
      const token = req.cookies.Token;

      const decodedToken = await verifyToken(token);

      const adminUser = await userModel.isAdminUser({
        email: decodedToken.email,
      });

      if (
        adminUser != null ||
        adminUser.role_id == 1 ||
        adminUser.role_id == 2
      ) {
        const userList = await userModel.getAllUsers();
        res.json({ code: 200, data: userList });
      }
    } catch (err) {
      //Bắt lỗi kiểm tra token
      res.json({ code: 500 });
    }
  },

  //Thay đổi status
  updateStatusUserByEmail: async (req, res) => {
    try {
      const token = req.cookies.Token;

      const decodeToken = await verifyToken(token);

      const isAdminUser = await userModel.getUserByEmail(decodeToken);

      if (isAdminUser.role_id == 1 || isAdminUser.role_id == 2) {
        const result = await userModel.updateStatusUserByEmail(req.body);

        return res.json({
          code: 200,
        });
      }
    } catch (err) {
      return res.json({
        code: 401,
      });
    }

    // userModel.getUserByEmail(decodeToken, (data) => {
    //   if (data) {
    //     userModel.updateStatusUserByEmail(req.body, (data) => {
    //       res.json({
    //         code: 200,
    //       });
    //     });
    //   } else {
    //     res.json({
    //       code: 400,
    //       status: "Failed",
    //     });
    //   }
    // });
  },

  //Lấy user theo email phải có token
  getUserByEmail: async (req, res) => {
    try {
      const token = req.cookies.Token;

      const decodeToken = await verifyToken(token);

      const adminUser = await userModel.getUserByEmail(decodeToken);

      if (adminUser.role_id == 1 || adminUser.role_id == 2) {
        const result = await userModel.getUserByEmail(req.params);
        console.log(result);
        return res.json({
          code: 200,
          data: result,
        });
      }
    } catch (err) {
      return res.json({
        code: 401,
      });
    }
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

  //Login

  login: async (req, res) => {
    const result = await userModel.getUserByEmailPassword({
      email: req.body.email,
      matkhau: req.body.matkhau,
    });

    if (result) {
      const token = JWT.sign(
        {
          email: result.email,
        },
        "mk",
        { expiresIn: 3600 * 100 }
      );
      res.set("Token", token);

      return res.send({
        code: 200,
      });
    }
    return res.send({
      code: 404,
    });
  },

  //Check user login
  getUserLogin: async (req, res) => {
    try {
      const token = req.cookies.Token;

      const decodeToken = await verifyToken(token);

      if (decodeToken) {
        const result = await userModel.getUserByEmail({
          email: decodeToken.email,
        });

        if (result) {
          delete result.matkhau;
          return res.json({
            code: 300,
            data: result,
          });
        } else {
          return res.json({
            code: 404,
          });
        }
      } else
        return res.json({
          code: 401,
        });
    } catch (err) {
      return res.json({
        code: 500,
      });
    }
    //   JWT.verify(token, "mk", (err, data) => {
    //     if (err)
    //       res.json({
    //         code: 400,
    //       });
    //     else {
    //       const decodeToken = data;

    //       userModel.getUserByEmail(decodeToken, (data) => {
    //         delete data.matkhau;
    //         res.json({
    //           code: 300,
    //           user: data,
    //         });
    //       });
    //     }
    //   });
    // } catch (err) {
    //   res.json({ code: 200 });
    // }
  },

  logoutUser: (req, res) => {
    JWT.res.json({ code: 200 });
  },
};
