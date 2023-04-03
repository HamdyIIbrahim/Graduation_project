const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Child = require("../models/child");

router.post("/login", (req, res) => {
  let fetchedChild;

  Child.findOne({ childName: req.body.childName })
    .then((child) => {
      if (!child) {
        return res.status(401).json({
          message: "Auth failed, No child by this name!",
        });
      }
      fetchedChild = child;

      return bcrypt.compareSync(req.body.childPassword, child.childPassword);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed, Incorrect password!",
        });
      }

      const token = jwt.sign(
        { childName: fetchedChild.childName, childId: fetchedChild._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        childId: fetchedChild._id,
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Invalid Authentication Credentials!" });
    });
});

module.exports = router;
