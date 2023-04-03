const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const Parent = require("../models/parent");
const Child = require("../models/child");

router.post(
  "/signup",
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email")
    .custom(async (emailValue) => {
      const parent = await Parent.findOne({ email: emailValue });
      if (parent) {
        return Promise.reject("E-mail already in use by another customer");
      }
    }),
  body("childName")
    .trim()
    .custom(async (value) => {
      const child = await Child.findone({ childName: value });
      if (child) {
        return Promise.reject("Child name already in use");
      }
    }),
  async (req, res) => {
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
    if (
      email &&
      password &&
      parentName &&
      gender &&
      childName &&
      childPassword &&
      childGender &&
      childAge
    ) {
      await Parent.create({
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
    }
  }
);
router.post("/login", (req, res) => {
  let fetchedParent;

    Parent.findOne({ email: req.body.email })
    .then((parent) => {
      if (!parent) {
        return res.status(401).json({
          message: "Auth failed, No Parent by this email!",
        });
      }
        fetchedParent = parent;

      return bcrypt.compareSync(req.body.password, parent.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed, Incorrect password!",
        });
      }

      const token = jwt.sign(
        { email: fetchedParent.email, parentId: fetchedParent._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        parentId: fetchedParent._id,
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Invalid Authentication Credentials!" });
    });
});

module.exports = router;
