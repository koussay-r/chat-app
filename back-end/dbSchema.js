import mongoose from "mongoose";

const schema=mongoose.Schema({
    name:String,
    message:String
})

export  const data=mongoose.model('data',schema,'data')