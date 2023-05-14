const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const parentRoute =require('./routes/parent');
const childRoute = require('./routes/child')
const adminRoute = require('./routes/admin')
const Exam = require('./models/exam');
const MissionRoute =require('./routes/mission');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.set('strictQuery', true);
mongoose.connect(`${process.env.DB_URL_CONNECTION}`).then(() => {
    console.log("connect successfully");
}).catch(() => {
    console.log("can't connect");
});

app.get('/exam',async (req,res)=>{
    const exam = await Exam.find()
    if(exam){
        res.status(200).json(exam)
    }else{
        res.status(500).json('exam not found')
    }
});

app.use('/parent',parentRoute);
app.use('/child',childRoute);
app.use('/admin',adminRoute);
app.use('/mission',MissionRoute);

app.listen(2000);