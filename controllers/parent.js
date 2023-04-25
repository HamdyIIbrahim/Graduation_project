const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Parent = require("../models/parent");
const Child = require("../models/child");
const Admin = require("../models/admin");

exports.createParent = (req, res, next) => {
  const {
    email,
    password,
    parentName,
    gender,
    childName,
    childPassword,
    childGender,
    childAge,
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed, entered data is incorrect ",
      errors: errors.array(),
    });
  }
  Parent.create({
    email: email,
    password: bcrypt.hashSync(password, 12),
    parentName: parentName,
    gender: gender,
  })
    .then((result) => {
      Child.create({
        childName: childName,
        childPassword: bcrypt.hashSync(childPassword, 12),
        childGender: childGender,
        childAge: childAge,
        parentId: result._id,
      });
    })
    .then(() => {
      res.json("Created successfully");
    });
};

exports.adminSignup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed, entered data is incorrect ",
      errors: errors.array(),
    });
  }
  const { email, password, gender, userName } = req.body;
  if (email && password && gender && userName) {
    Admin.create({
      email: email,
      password: bcrypt.hashSync(password, 12),
      gender: gender,
      userName: userName,
    }).then(() => {
      res.json("account created successfully");
    });
  }
};
