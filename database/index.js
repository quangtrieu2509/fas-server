const mongoose = require("mongoose");
const db = require('../configs/db.config')
require("dotenv").config();

const uri = `mongodb+srv://${db.USER}:${db.PASSWORD}@cluster0.xdk8qqa.mongodb.net/${db.NAME}?retryWrites=true&w=majority`;

async function connect(){

    try{
        mongoose.set('strictQuery', false);
        await mongoose.connect(uri);
        console.log('Connect successfully!');
    }catch(err){
        console.log(`Connect failed!. Error: ${err}`);
    }

}

module.exports = { connect };
