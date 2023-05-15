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

router.post("/:userId/friend-requests", async (req, res) => {
  const { userId } = req.params;
  const { friendId } = req.body;
  try {
    const user = await Child.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "Child not found" });
    }

    const friend = await Child.findById(friendId);
    if (!friend) {
      return res.status(404).send({ message: "Friend not found" });
    }
    const existingRequest = friend.friendsRequests.find((id) =>
      id.equals(friendId)
    );
    if (existingRequest) {
      return res.status(400).send({ message: "Friend request already sent" });
    }

    friend.friendsRequests.push(userId);
    await friend.save();

    res.send({ message: "Friend request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});
// To accept a friend request
router.put("/:userId/friend-requests/:friendId", async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    const user = await Child.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "Child not found" });
    }

    const friend = await Child.findById(friendId);
    if (!friend) {
      return res.status(404).send({ message: "Friend not found" });
    }

    const requestIndex = user.friendsRequests.findIndex((id) =>
      id.equals(friendId)
    );
    if (requestIndex === -1) {
      return res.status(400).send({ message: "Friend request not found" });
    }

    user.friendsRequests.splice(requestIndex, 1);
    user.friends.push(friendId);
    await user.save();

    friend.friends.push(userId);
    await friend.save();

    res.send({ message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});
// canecl request

router.delete("/:userId/friend-requests/:friendId", async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    const user = await Child.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "Child not found" });
    }

    const requestIndex = user.friendsRequests.findIndex((id) =>
      id.equals(friendId)
    );
    if (requestIndex === -1) {
      return res.status(400).send({ message: "Friend request not found" });
    }

    user.friendsRequests.splice(requestIndex, 1);
    await user.save();

    res.send({ message: "Friend request deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});

router.delete("/:userId/delete-friend/:friendId", async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    const user = await Child.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "Child not found" });
    }

    const friend = await Child.findById(friendId);
    if (!friend) {
      return res.status(404).send({ message: "Friend not found" });
    }
    const requestIndex = user.friends.findIndex((id) => id.equals(friendId));
    if (requestIndex === -1) {
      return res.status(400).send({ message: "Friend request not found" });
    }

    user.friends.splice(requestIndex, 1);
    await user.save();

    friend.friends.splice(requestIndex, 1);
    await friend.save();

    res.send({ message: "Friend deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});
// get all friends for spacific user 
router.post("/allfriends", async (req, res) => {
  const { userId } = req.body;
  let allFriendsArray = [];
  try {
    const user = await Child.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "Child not found" });
    }
    const allFriends = user.friends;
    if (allFriends.length > 0) {
      for (let i = 0; i < allFriends.length; i++) {
        const result = await Child.findById(allFriends[i]);
        allFriendsArray.push(result);
        if (i === allFriends.length - 1) {
          res.status(200).json(allFriendsArray);
        }
      }
    }else{
      res.status(500).send({ message: "This child doesn't have any friends" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});
router.post("/friendrequests", async (req, res) => {
  const { userId } = req.body;
  let allFriendsArray = [];
  try {
    const user = await Child.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "Child not found" });
    }
    const allFriends = user.friendsRequests;
    if (allFriends.length > 0) {
      for (let i = 0; i < allFriends.length; i++) {
        const result = await Child.findById(allFriends[i]);
        allFriendsArray.push(result);
        if (i === allFriends.length - 1) {
          res.status(200).json(allFriendsArray);
        }
      }
    }else{
      res.status(500).send({ message: "This child doesn't have any friend requests" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Server error" });
  }
});
module.exports = router;
