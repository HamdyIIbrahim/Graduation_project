const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const missionSchema = mongoose.Schema({
  grade: { type: String, required: true, unique: true },
  missions: {
    planet1: {type:[String]},
    planet2: {type:[String]},
    planet3: {type:[String]},
  },
});

missionSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Mission", missionSchema);
