const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const childSchema = mongoose.Schema({
    childName:{
        type:string,
        required:true,
        unique:true
    },
    childPassword:{
        type:string,
        required:true,
        unique:true
    },
    childGender:{
        type:string,
        required:true,
    },
    childAge:{
        type:number,
        required:true,
    },
});

childSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Child", childSchema);