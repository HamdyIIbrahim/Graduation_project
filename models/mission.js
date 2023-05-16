const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const missionSchema = mongoose.Schema({
  grade: { type: String, required: true, unique: true },
  missions: {
    planet1: {type:[{NAME:{type:String},URL:{type:String}}]},
    planet2: {type:[{NAME:{type:String},URL:{type:String}}]},
    planet3: {type:[{NAME:{type:String},URL:{type:String}}]},
  },
});

missionSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Mission", missionSchema);
