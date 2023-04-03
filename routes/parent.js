const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const Parent = require("../models/parent");
const Child = require("../models/child");

// parent sign up to create his account and another to one child
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
// parent login to the application and i will return a token as a json object and message
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
//parent will add a new child and i need from the front jwt from headers as authorization variable
router.post(
  "/addchild",
  body("childName")
    .trim()
    .custom(async (value) => {
      const child = await Child.findone({ childName: value });
      if (child) {
        return Promise.reject("Child name already in use");
      }
    }),
  async (req, res) => {
    const { childName, childPassword, childGender, childAge } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const resChild = await Child.create({
      childName: childName,
      childPassword: bcrypt.hashSync(childPassword, 12),
      childGender: childGender,
      childAge: childAge,
      parentId: decodedToken.parentId,
    });
    if (resChild) {
      res.status(200).json("Child added successfully");
    }
    res.status(500).json("Can't add Child please try again");
  }
);
// end point to find all childs related to current parent
router.get('/allchilds',async (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const allChilds = await Child.find({parentId:decodedToken.parentId});
    if(allChilds){
        res.status(200).json(allChilds);
    }
    res.status(500).json("no childs found");
});

module.exports = router;
