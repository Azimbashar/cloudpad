import React, { useEffect, useState } from "react";
import "./Account.css";
import { app } from "./envariable";
import { useNavigate } from "react-router-dom";
import { getDatabase,set,ref,onValue,remove } from 'firebase/database';
import { toast,ToastContainer } from "react-toastify";

export default function Account({ navlogdata,pagelogout,sendmode}) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [change,setchange] = useState(false);
  const [deleteacc,setdeleteacc] = useState(false);
  const [oldpassword,setoldpassword] = useState("");
  const [newpassword,setnewpassword] = useState({
    opass:"",
    npass:"",
    cpass:""
  })
  useEffect(() => {
    if (!navlogdata || navlogdata.email === "nodefine") {
      navigate("/Signin");
    }
  }, [navlogdata, navigate]);

  const logout = () => {
    window.location.reload();
    navigate("/Signin");
    
  };

useEffect(() => {
    const db = getDatabase(app);
    const userRef = ref(db, "user");
    const unsub = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      const user = (data || {});
      const entries = Object.entries(user);
      const userdata = entries.find(([id, value]) => {
      setoldpassword(value.userdetails?.password);
    return id === navlogdata.username && value.userdetails?.password === navlogdata.password;
  });

  if (userdata) {
    const [, value] = userdata;
    setDarkMode(value.userdetails?.mode);
    sendmode(value.userdetails?.mode)
}});
    return () => unsub();
  

  }, [darkMode]);

const modefun= async ()=>{
       const db = getDatabase(app);
       await set(ref(db, `user/${navlogdata.username}/userdetails`), {
        name:navlogdata.username,
        email:navlogdata.email,
        phone:navlogdata.phone,
        password:oldpassword,
        gender:navlogdata.gender,
        mode: !darkMode
       });
       setDarkMode(!darkMode)
}
 const changepass = async(e)=>{
  e.preventDefault();
   const oldpass = e.target[0].value.trim();
   const newpass = e.target[1].value.trim();
   const conpass = e.target[2].value.trim();
   if(newpass===conpass && oldpass===oldpassword){
      const db = getDatabase(app);
      setchange(false);
       await set(ref(db, `user/${navlogdata.username}/userdetails`), {
        name:navlogdata.username,
        email:navlogdata.email,
        phone:navlogdata.phone,
        password:newpass,
        gender:navlogdata.gender,
        mode: darkMode
       });
       setnewpassword({
        opass:"",
        npass:"",
        cpass:""
       })
       toast.success("Password changed successfully");
   }
   else{
    toast.error("Passwords do not match")
   }
    
 }
   const deleteaccount = async (e) => {
    e.preventDefault();
    const inp = e.target[0].value.trim();
    if(inp==="DELETE")
    {
    const db = getDatabase(app);
    await remove(ref(db, `user/${navlogdata.username}`));
    toast.success("Account deleted successfully");
    window.location.reload();
    navigate("/Signin");
    }
    else{
      toast.error('Delete failed. Try again.')
    }
};

  return (
    <div className={`account-wrapper ${darkMode ? "dark" : ""}`}>
      
      <div className="account-card">

        <form style={{display:`${change?"flex":"none"}`}} className="operation-box" onSubmit={changepass}>
         <input
  value={newpassword.opass}
  onChange={(e) =>
    setnewpassword({ ...newpassword, opass: e.target.value.trim() })
  }
  placeholder="Old Password"
/>
<input
  value={newpassword.npass}
  onChange={(e) =>
    setnewpassword({ ...newpassword, npass: e.target.value.trim() })
  }
  placeholder="New Password"
/>
<input
  value={newpassword.cpass}
  onChange={(e) =>
    setnewpassword({ ...newpassword, cpass: e.target.value.trim() })
  }
  placeholder="Confirm Password"
/>
        <button type="submit">Change Password</button>
         <i onClick={()=>{setchange(false);setnewpassword({opass:"",npass:"",cpass:""})}} className="fa-solid fa-xmark"></i>
        </form>
  <form className="operation-box" onSubmit={deleteaccount}  style={{display:`${deleteacc?"flex":"none"}`}}>
    <h2>Type <p style={{color:'red',margin:'0 .5vw'}}> "DELETE" </p> to confirm</h2>
    <input />
    <button type="submit">Confirm</button>
    <i onClick={()=>{setdeleteacc(false)}} className="fa-solid fa-xmark"></i>
  </form>
        {/* LEFT SIDE */}
        <div className="left-section" style={{opacity:`${change||deleteacc?".3":"1"}`}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'centet',flexDirection:'column',gap:'2vw'}}>
          <img
            className="profile-img"
            src={
              navlogdata.gender === "male"
                ? "https://i.pinimg.com/236x/0b/97/6f/0b976f0a7aa1aa43870e1812eee5a55d.jpg"
                : "https://i.pinimg.com/236x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg"
            }
            alt=""
          />
          <h2>{navlogdata.username}</h2>
</div>
<div className="left-2">
          <p><i  className="fa-regular fa-envelope"></i>{navlogdata.email}</p>
          <p><i  className="fa-regular fa-address-book"></i>{navlogdata.phone}</p>
          <button className="logout-btn" onClick={logout}>
            Log Out
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-section" style={{opacity:`${change||deleteacc?".3":"1"}`}}>

          <div className="stats-row">
            <div className="stat-box">
              <h4>Total Notes</h4>
              <p>{navlogdata.index}</p>
            </div>

            <div className="stat-box">
              <h4>Storage Used</h4>
              <p>{navlogdata.index*.5}MB</p>
            </div>

            <div className="stat-box">
              <h4>Total Storage</h4>
              <p>50MB</p>
            </div>
          </div>
          <div className="settings-box">
            <div className="storage-percent" style={{background:'white',borderRadius:'10vw',position:'relative',border:'.2vw solid green'}}>
          <div style={{height:'100%',width:`${navlogdata.index}%`,borderRadius:'10vw',position:"absolute",top:'0',left:'0',background:'black'}}></div>
         </div>
            <label>
              <input
                checked={darkMode? true: false} 
                type="checkbox"
                onChange={modefun}
              />
              Dark Mode
            </label>

            <button onClick={()=>{setchange(true)}} className="small-btn">Change Password</button>
            <button onClick={()=>{setdeleteacc(true)}} className="delete-btn">Delete Account</button>
          </div>

        </div>

      </div>
      <ToastContainer/>
    </div>
  );
}