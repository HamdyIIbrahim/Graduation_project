const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const parentSchema = mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
},
  password: { 
    type: String, 
    required: true 
},
parentName: { 
    type: String,
    required: true 
},
  gender:{
    type:String,
    required: true 
  },
  
});

parentSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Parent", parentSchema);