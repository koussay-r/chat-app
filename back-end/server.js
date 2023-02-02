import express from 'express'
import mongoose from "mongoose"
import {data} from './dbSchema.js'
import dotenv from "dotenv";
import cors from "cors"
import Pusher from 'pusher';
dotenv.config()
const app=express()
const port = process.env.PORT||5000
app.use(express.json()) 
app.use(cors())
const mongoURl=`mongodb+srv://admin:${process.env.URL_PASSWORD}@cluster0.8l6tnuj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
mongoose.connect(mongoURl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const pusher = new Pusher({
  appId: "1547331",
  key: "0d8cf22564509b818c0d",
  secret: "e8c6b5d71553374171df",
  cluster: "eu",
  useTLS: true
});

const db=mongoose.connection;
db.once("open",()=>{
    console.log("db connected")
    const msgCollection=db.collection("data")
    const chnageStream=msgCollection.watch()
    chnageStream.on("change",(change)=>{
    if(change.operationType=="insert"){
        const messageDetail=change.fullDocument;
        pusher.trigger("messages","inserted",{
            _id:messageDetail._id,
            name:messageDetail.name,
            message:messageDetail.message
        })
    }
    else{
        console.log(err)
    }
})
})
app.post("/data",(req,res)=>{
    data.create(req.body,(err,data)=>{
        res.send(req.body)
        if(err) res.status(500).status(err)
    })
})
app.get("/new",async(req,res)=>{
    const items= await data.find()
    res.send(items)

    })

app.listen(port,()=>console.log(`listening on port : ${port}`))