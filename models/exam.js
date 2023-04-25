const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const examSechema = mongoose.Schema({
  question1: {
    title: String,
    ans1: String,
    ans2: String,
    ans3:String,
    correctAns: String,
  },
  question2: {
    title: String,
    ans1: String,
    ans2: String,
    ans3:String,
    correctAns: String,
  },
  question3: {
    title: String,
    ans1: String,
    ans2: String,
    ans3:String,
    correctAns: String,
  },
  question4: {
    title: String,
    ans1: String,
    ans2: String,
    ans3:String,
    correctAns: String,
  },
  question5: {
    title: String,
    ans1: String,
    ans2: String,
    ans3:String,
    correctAns: String,
  },
  question6: {
    title: String,
    ans1: String,
    ans2: String,
    ans3:String,
    correctAns: String,
  },
  question7: {
    title: String,
    ans1: String,
    ans2: String,
    ans3:String,
    correctAns: String,
  },
  question8: {
    title: String,
    ans1: String,
    ans2: String,
    ans3:String,
    correctAns: String,
  },
  question9: {
    title: String,
    ans1: String,
    ans2: String,
    ans3:String,
    correctAns: String,
  },
  
});

examSechema.plugin(uniqueValidator);
module.exports = mongoose.model("Exam", examSechema);
