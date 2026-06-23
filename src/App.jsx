import Signin from "./Signin";
import Notes from "./Notes";
import Home from "./Home";
import './App.css'
import { BrowserRouter, Routes, Route, NavLink} from 'react-router-dom';
import { useState } from "react";
import Account from "./Account";
import {Audio } from "react-loader-spinner";
import logo from './logo.png';
export default function App() {

  const [loginuserdata, setloginuserdata] = useState({ name: "test", pass: "test1" });
  const [navlogdata, setnavlogdata] = useState({username: "loginname",gender: "nodefine",email:"nodefine"});
  const [audiowork,setaudiowork] = useState(false);
  const [sidebar,setsidebar] = useState(false);
  const [currentmode,setcurrentmode] = useState(false)

  const logindata = (e) => {
    setloginuserdata(e);
  }
const profile = (e)=>{
   setnavlogdata(e);
}
const getaudiodata = (e)=>{
  setaudiowork(e);
}
const pagemode = (e)=>{
   setcurrentmode(e);
}
  return (
    <>
      <BrowserRouter>

        {/* Navbar must be inside BrowserRouter */}
        <div className="navbar">
          <img src={logo} alt="logo" style={{height:'135%', marginLeft:'2vw'}}/>
          {audiowork &&
          <div style={{display:'flex'}}>
          <Audio
                  height="40"
                  width="40"
                  color="white"
                  visible={true}
                   wrapperStyle={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100%'}}
             />
             <Audio
                  height="40"
                  width="40"
                  color="white"
                  visible={true}
                   wrapperStyle={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100%'}}
             />
             <Audio
                  height="40"
                  width="40"
                  color="white"
                  visible={true}
                   wrapperStyle={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100%'}}
             /></div>}
           <i onClick={()=>{setsidebar(sidebar?false:true)}} className="fa-solid fa-bars"></i>
          <div className={`nav-box ${sidebar?'active-nav-box':''}`} onClick={()=>{setsidebar(false)}} >
           <hr style={{width:'100%',color:'gray'}} />
          <NavLink  to="/"  end onClick={() => { setsidebar(false) }} className={({ isActive }) => `nav-opt ${isActive ? "nav-opt-active" : ""}`}>Home</NavLink>
          <NavLink onClick={()=>{setsidebar(false)}} className={({isActive})=>`nav-opt ${isActive?"nav-opt-active":""}`} to="/Notes">Notes</NavLink>

          {
            navlogdata.username==="loginname"&& navlogdata.gender==="nodefine"?  <NavLink onClick={()=>{setsidebar(false)}} className={({isActive})=>`nav-opt ${isActive?"nav-opt-active":""}`} to="/Signin">Login</NavLink> : <NavLink onClick={()=>{setsidebar(false)}} className={({isActive})=>`nav-opt ${isActive?"nav-opt-active":""}`} to="/Account"><img className="image" src={`${navlogdata.gender==="male"? 'https://i.pinimg.com/236x/0b/97/6f/0b976f0a7aa1aa43870e1812eee5a55d.jpg' : 'https://i.pinimg.com/236x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg'}`} alt=''/>{navlogdata.username}</NavLink>
          }
          <hr style={{width:'100%',color:'gray'}} />
           <h3  className="all-rights">GreenNotes</h3>
            <p  className="all-rights">
              A modern cloud note system designed for students and developers.
            </p>
          <p style={{opacity:'.5'}} className="all-rights"> © {new Date().getFullYear()} Cloudpad. All rights reserved.</p>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Home signindata={loginuserdata} currentmode={currentmode}/>} />
          <Route path="/Notes" element={<Notes signindata={loginuserdata} getaudiodata={getaudiodata} donelogin={profile} sendmode={pagemode} />} />
          <Route path="/Account" element={<Account navlogdata={navlogdata} sendmode={pagemode}/>} />
          <Route path="/Signin" element={<Signin submitlogindata={logindata}/>} />
        </Routes>

      </BrowserRouter>
    </>
  );
}
