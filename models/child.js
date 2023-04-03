const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const childSchema = mongoose.Schema({
    childName:{
        type:String,
        required:true,
        unique:true
    },
    childPassword:{
        type:String,
        required:true,
        unique:true
    },
    childGender:{
        type:String,
        required:true,
    },
    childAge:{
        type:Number,
        required:true,
    },
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Child"
    }
});

childSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Child", childSchema);