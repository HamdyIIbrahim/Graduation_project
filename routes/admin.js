const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const Admin = require("../models/admin");
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
      const admin = await Admin.findOne({ email: emailValue });
      if (admin) {
        return Promise.reject("E-mail already in use by another customer");
      }
    }),
  async (req, res) => {
    const { email, password, gender, userName } = req.body;
    if (email && password && gender && userName) {
      await Admin.create({
        email: email,
        password: bcrypt.hashSync(password, 12),
        gender: gender,
        userName: userName,
      }).then(() => {
        res.json("account created successfully");
      });
    }
  }
);

router.post("/login", (req, res) => {
  let fetchedAdmin;

  Admin.findOne({ email: req.body.email })
    .then((admin) => {
      if (!admin) {
        return res.status(401).json({
          message: "Auth failed, No admin by this email!",
        });
      }
      fetchedAdmin = admin;
      return bcrypt.compareSync(req.body.password, admin.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed, Incorrect password!",
        });
      }
      const token = jwt.sign(
        { email: fetchedAdmin.email, adminId: fetchedAdmin._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        adminId: fetchedAdmin._id,
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Invalid Authentication Credentials!" });
    });
});

router.post(
  "/addparent",
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

router.get('/allchilds',async (req,res)=>{
    const allChilds = await Child.find();
    if(allChilds){
        res.status(200).json(allChilds);
    }
    res.status(500).json("no childs founded");
});

router.get('/allparents',async (req,res)=>{
    const allparents = await Parent.find();
    if(allparents){
        res.status(200).json(allparents);
    }
    res.status(500).json("no parents founded");
});

router.post('/deleteparent',async (req,res)=>{
    const{Id}= req.body;
    const result = await Child.find({parentId:Id});
    res.status(200).json(result)

    // const result = await Parent.findByIdAndDelete({ _id:Id})
    // if(result){
    //     return res.status(200).json({message:"Parent deleted successfully"})
    // }
})

router.post('/deletechild',async (req,res)=>{
    const Id = req.body;
    const result = await Child.findByIdAndDelete(Id)

    if(result){
        return res.status(200).json({message:"Child deleted successfully"})
    }
})
module.exports = router;

























// router.post('/deleteparent',async (req,res)=>{
//     const Id = req.body;
//     const result = await Parent.findByIdAndDelete({ _id:Id})

//     if(result){
//         return res.status(200).json({message:"Parent deleted successfully"})
//     }
// })
