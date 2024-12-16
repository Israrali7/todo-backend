require("dotenv").config();
const express = require("express")
const mongoose = require('mongoose');
const auth  = require('./routes/auth') 
const todoRoute  = require('./routes/todoRoute') 
const cors = require("cors");

const App = express();
App.use(express.json());
App.use(cors());


App.use("/auth" , auth)
App.use("/todo" , todoRoute)



mongoose.connect(process.env.MONGO_URI).then(() => {
    App.listen(5000, () => {
        console.log("DB connected and SerVer Started");
    })
}).catch((err) => {
    console.log(err);
})

