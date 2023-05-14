const express = require("express");
const router = express.Router();
const Mission = require('../models/mission');

router.get('/',async (req,res)=>{
    try{
        const Missions = await Mission.find();
    if(Missions){
        res.status(200).json(Missions);
    }else{
        res.status(500).send({ message: "No missions found" });
    }
    }catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
});

router.post('/newmission',async (req,res)=>{
    const {grade,missions}=req.body;
    const NewMisson = await Mission.create({grade,missions});
    if(NewMisson){
        res.status(200).json({ message:"Mission Created Successfully"});
    }else{
        res.status(500).send({ message: "Can't create the mission" });
    }
});

router.delete("/deletemission",async (req,res)=>{
    const {Id} = req.body;
    const deletemission = await Mission.findByIdAndDelete(Id);
    if(deletemission){
        res.status(200).json({ message:"Mission deleted Successfully"});
    }else{
        res.status(500).send({ message: "Can't delete the mission" });
    }
});

module.exports=router;