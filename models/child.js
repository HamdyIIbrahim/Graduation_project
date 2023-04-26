const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const childSchema = mongoose.Schema({
  childName: {
    type: String,
    required: true,
  },
  childPassword: {
    type: String,
    required: true,
  },
  childGender: {
    type: String,
    required: true,
  },
  childAge: {
    type: Number,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Child",
  },
  examScore: Number,
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child'
  }],
  friendsRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child'
  }],
});

childSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Child", childSchema);
