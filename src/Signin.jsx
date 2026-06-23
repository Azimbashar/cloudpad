import React from 'react'
import { getDatabase,set,ref,onValue } from 'firebase/database';
import { app } from './envariable';
import './Signin.css';
import { useState,useEffect } from 'react';
import { ToastContainer,toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export default function Signin({submitlogindata}) {
   
    const navigator = useNavigate();
    const [entries,setentries] = useState([]);
    const [olduser,setolduser] = useState("initial");
    
    const [loginsetup,setloginsetup] = useState({
      title:"Hello,friend",
      subtitle:"Enter your personal details and start journey with us",
      buttontitle:"SIGN UP",
      left:"0",
      page:"1"
    })
    const [phonelogstate,setphonelogstate] = useState({
      display1:"",
      display2: "flex",
      color1:"green",
      color2:'white'
    })
    const getsignindata = async (e) =>{
      e.preventDefault();
      if(olduser=="yes"){
      toast.success("Thanks For SignIN")
       const name = e.target[0].value;
       const email = e.target[1].value;
       const phoneno = e.target[2].value;
       const gender = e.target[3].value;
       const password = e.target[4].value;

       const db = getDatabase(app);
       await set(ref(db, "user/" + name), {
        userdetails: {
        name:name,
        email:email,
        phone:phoneno,
        password:password,
        gender:gender,
        mode:false
       },
             message: [], 
           });
    setloginsetup({
      title:"Hello,friend",
      subtitle:"Enter your personal details and start journey with us",
      buttontitle:"SIGN UP",
      left:"0",
      page:"3"
    })
    }
    else{toast.error("Username already exist")}
  }
   useEffect(() => {
  const db = getDatabase(app);
  const userRef = ref(db, "user");

  const unsub = onValue(userRef, (snapshot) => {
    const data = snapshot.val();

    if (data) {
      setentries(Object.entries(data));
    } else {
      setentries([]); // important fix
    }
  });

  return () => unsub();
}, []);

    const availableuser = (e)=>{
       setolduser("yes");
       
       const userExists = entries.some(([id]) => id === e);
setolduser(userExists ? "no" : "yes");  
    }

  const setloginpage = () =>{
    
   if(loginsetup.page==="3"){
 setloginsetup({
      title:"Hello,friend",
      subtitle:"Enter your personal details and start journey with us",
      buttontitle:"SIGN UP",
      left:"0",
      page:"3"
    })
   } 
   else if(loginsetup.page==="1"){
     setloginsetup({
      title:"Hello,friend",
      subtitle:"Enter your email and password",
      buttontitle:"LOG IN",
      left:"50",
      page:"2"
    })
   }
   else{ setloginsetup({
      title:"Hello,friend",
      subtitle:"Enter your personal details and start journey with us",
      buttontitle:"SIGN UP",
      left:"0",
      page:"1"
    })}
  }
  

 const logindata = (e) => {
  e.preventDefault();
 
  const logname = e.target[0].value.trim();
  const logpass = e.target[1].value.trim();

  const user = entries.find(([id, value]) => {

    return id === logname && value.userdetails?.password === logpass;
  });

  if (user) {
    const [, value] = user;
    submitlogindata({
      name: logname,
      pass: logpass,
    });

    navigator("/Notes");
  } else {
   
    toast.error("Wrong username or password");
  } 
};
const setphoneslide = (e)=>{
    if(e===2){
      setphonelogstate({
      display1:"flex",
      display2: "none",
      color1:"white",
      color2:'green'
      })
    }
    else{
      setphonelogstate({
      display1:"none",
      display2: "flex",
      color1:"green",
      color2:'white'
      })
    }
}
  return (
     <>
    <div className='sign-page' >
      <div className='sign-box'>
        <div className='phone-slide'><h2 onClick={()=>{setphoneslide(1)}} style={{background:`${phonelogstate.color1}`,fontSize:'7vw',height:'100%',width:'50%',borderRadius:'4vw 0 0 4vw'}}>LOGIN</h2><h2 onClick={()=>{setphoneslide(2)}} style={{background:`${phonelogstate.color2}`,fontSize:'7vw',height:'100%',width:'50%',borderRadius:'0 4vw 4vw 0'}} >SIGN UP</h2></div>
       <div  className='slider' style={{height:"100%",width:'50%',background:'green',position:'absolute',top:'0',left:`${loginsetup.left}%`,transition:'.4s ease-in-out',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'1.2vw'}}>
        <h1 style={{color:'white',fontSize:'3vw'}}>{loginsetup.title}</h1>
        <h4 style={{width:'80%',textAlign:'center',color:'white',fontSize:'1.3vw',fontWeight:'00'}}>{loginsetup.subtitle}</h4>
        <button style={{height:'8%',width:'50%',background:'green',border:".1vw solid white",color:'white',cursor:'pointer',borderRadius:'10vw',fontSize:'1.5vw'}} onClick={setloginpage} >{loginsetup.buttontitle}</button>
       </div>
        <form style={{display:`${phonelogstate.display1}`}} className='form-1' onSubmit={getsignindata}>
          <h1>Create an account</h1>
          <div className='f1-div'>
          <input required  className={`f1-div-inp ${olduser==="initial"? "": "activef1inp"}`}  onChange={(e)=>{availableuser(e.target.value)}} type='text' placeholder='Username' />
          <p  style={{ display:`${olduser==="initial"? "none": "block"}`}} >{olduser==="yes"? <i style={{color:'green'}} className="fa-solid fa-circle-check"></i> : <i style={{color:'red'}} className="fa-solid fa-circle-xmark"></i>}</p>
          </div>
          <input className='f1-inputs' type='email' placeholder='Email Address'/>
          <input className='f1-inputs'  type='number' placeholder='Phone No.'/>
           <select className='f1-inputs' >
            <option value="male">Male</option>
            <option value="female">Female</option>
           </select>
          
           <input className='f1-inputs' type='password' autoComplete='none' placeholder='password' />
          <button className='f1-inputs' type='submit' >Submit</button>
        </form>
      <form style={{display:`${phonelogstate.display2}`}} className='form-2' onSubmit={logindata} >
        <h1>Log in</h1>
       <input className='f2-inputs' type='text' placeholder='username'/>
       <input className='f2-inputs' type='password' autoComplete='none' placeholder='password'/>
       <button className='f2-inputs' type='submit'>Submit</button>
    </form>
    </div> 
        <ToastContainer/>
    </div>
    </>
  )
}
