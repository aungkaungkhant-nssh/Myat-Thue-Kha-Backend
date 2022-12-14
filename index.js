const express = require("express");
const app =express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const uuidv4 = require('uuid');
const compression = require('compression');
require('dotenv').config();

app.use((req,res,next)=>{
    
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,DELETE,PUT");
    res.setHeader("Access-Control-Allow-Headers","Content-Type,Authorization");
    next();
})

const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images");
    },
    filename:(req,file,cb)=>{
        cb(null,uuidv4.v4()+file.originalname);
    }
})


app.use(express.json());
app.use(compression())
app.use(bodyParser.urlencoded({extended:true}));
app.use(multer({storage:fileStorage}).fields([{name:'image',maxCount:1}]));
app.use(express.static(path.join(__dirname,"public")));
app.use("/images",express.static(path.join(__dirname,"images")));

//set template engine
app.set("view engine","ejs");
app.set('views',"views");




require('./startup/db')();

require('./startup/route')(app);

const PORT = process.env.PORT || 5000;


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.t9jp2.mongodb.net/${process.env.DB_DEFAULT_DATABASE}?retryWrites=true&w=majority`
).then(()=>{
    app.listen(PORT,function(){
        console.log("Server is run on port "+PORT);
    })
})
.catch((err)=>console.log(err))
