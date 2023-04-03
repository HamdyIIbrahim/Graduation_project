const express = require('express');
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const parentRoute =require('./routes/parent');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.set('strictQuery', true);
mongoose.connect(`${process.env.DB_URL_CONNECTION}`).then(() => {
    console.log("connect successfully");
}).catch(() => {
    console.log("can't connect");
});

app.get('/',(req,res)=>{
    res.json('welcome from home page')
});

app.use('/parent',parentRoute);

app.listen(2000);