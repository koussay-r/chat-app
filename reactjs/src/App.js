import axios from './axios'
import React, { useEffect, useState } from 'react'
import './index.css'
import Pusher from 'pusher-js'
export default function App() {
  const [messages,setMessages]=useState([])
    const handleapi=async (e)=>{
      e.preventDefault()
      const message=document.getElementById("message").value;
      const name=document.getElementById("inpt").value;
      try{
        await axios.post(`http://localhost:5000/data`,{name:name,message:message})     
      }
      catch(err){
        console.log(err)
      }
      document.getElementById("message").value="";
      document.getElementById("inpt").value="";

        
    }
    useEffect(()=>{
      const handlegetapi= async ()=>{
        try{
        const res= await axios.get("/new")
        setMessages(res.data);   
        }
        catch(err){
          console.log(err)
        }
      }
      handlegetapi()
    },[])
    useEffect(()=>{
      const pusher = new Pusher('0d8cf22564509b818c0d', {
        cluster: 'eu'
      }); 
      const channel = pusher.subscribe('messages');
      channel.bind('inserted', (data)=> {
        setMessages([...messages,data])
      });
      return ()=>{
        channel.unbind_all()
        channel.unsubscribe()
      }
      
    },[messages])
    
  return (
    <>
    <div className='es'>
      <div className='es1'>
        <form>

        <p>Name</p>
        <input id='inpt' type={'text'} />
        <input id='message' type={'text'}/>
        <button type="submit" onClick={handleapi}>click</button>
        </form>
      </div>
      { messages.length!==0 &&
      <div>
        {messages.map(item=>{
          return(<p key={item}>
            {item.message}
          </p>)
        })}
          
      </div>
}
    </div>
    </>
  )
}
