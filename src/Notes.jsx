import React, { useEffect,useState,useRef } from 'react'
import { Oval, ThreeDots } from 'react-loader-spinner';
import './Notes.css'
import axios from 'axios';
import moment from 'moment';
import empty from './empty.svg';
import login from './login.svg'
import { Editor } from '@monaco-editor/react';
import SpeechRecognition,{useSpeechRecognition} from 'react-speech-recognition';
import { app } from "./envariable";
import { getDatabase, ref, set, onValue,remove, child } from "firebase/database";
import { toast, ToastContainer } from 'react-toastify';
export default function Notes({signindata,getaudiodata,donelogin,sendmode}) {

  const [slideStyle,setslideStyle] = useState("1");
  const [createcount,setcreatecount] = useState(false);
  const [edit,setedit] = useState({flag:false,index:''});
  const [currentmode,setcurrentmode] = useState();
  const [phoneopt,setphoneopt] = useState(false);
  const [heading,setheading] = useState("");
  const [searchval,setsearchval]= useState("");
  const [save,setsave] = useState(false);
  const [audio,setaudio] = useState(false);
  const [notes,setnotes]=useState([]);
  const [value,setvalue] = useState();
  const [user, setUser] = useState({});
  const [checkid, setcheckid] = useState({name:"test",pass:"test1"});
  const entries = Object.entries(user);
  const start =()=> SpeechRecognition.startListening({continuous:true});
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

const [result,setresult] = useState("")
const [loading,setloading] = useState(false)

// const API_KEY = ""
// const sendData = async (e) => {
//   e.preventDefault();

//   try {
//     setloading(true);

//     const payload = {
//       contents: [
//         {
//           parts: [
//             { text: `${transcript} - (correct mistakes and grammer, length same)` }
//           ]
//         }
//       ]
//     };

//     const options = {
//       headers: {
//         "Content-Type": "application/json",
//         "X-goog-api-key": API_KEY
//       }
//     };

//     const res = await axios.post(
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
//       payload,
//       options
//     );

//     const finalAns =
//       res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
//       setresult(finalAns);

//   } catch (err) {
//     toast.error(err.message);
   
//   } finally {
//     setloading(false);
     
//   }
// };

 // Add data to Firebase
 
const savenote = async(e) => {

 const db = getDatabase(app);
 const temptime = new Date();
 const localtime = moment(temptime).format("MM /DD ,hh:mm");
 if(edit.flag===true){
    const newnotes = [...notes];
     newnotes[edit.index] = {contant:value,time:localtime,heading:notes[edit.index].heading};
     await set(ref(db, `user/${checkid.name}/message`), {
     getnotes:newnotes})
     setedit({flag:false,index:''})
 }

else{
      if(checkid.name!=="test"&&checkid.pass!=="test1")
 { 
    if(e==="1"){
        await set(ref(db, `user/${checkid.name}/message`), {
       getnotes:[...notes,{contant: transcript, time: localtime,heading:heading}]});}
    else if(e==="2"){
        await set(ref(db, `user/${checkid.name}/message`), {
       getnotes:[...notes,{contant: result, time: localtime,heading:heading}]});}
    else if(e==="3"){
        await set(ref(db, `user/${checkid.name}/message`), {
       getnotes:[...notes,{contant: value, time: localtime,heading:heading}]});}
}}
 resetTranscript();
 setresult();
 setvalue('');
 setslideStyle("1");
 setheading("");
}

  // Fetch data automatically using useEffect
  useEffect(() => {
    const db = getDatabase(app);
    const userRef = ref(db, "user");
    const unsub = onValue(userRef, (snapshot) => {
    const data = snapshot.val();
      setUser(data || {});
    });
    return () => unsub();
   
  }, []);
  
  const deletedata = async(id, index) => {
  const updatedNotes = notes.filter((_, i) => i !== index);
  setnotes(updatedNotes);

  const db = getDatabase(app);
  await set(ref(db, `user/${id}/message`), {
    getnotes: updatedNotes
  });

  setphoneopt({ status: false });
  setvalue('');
  setslideStyle('1');
}
  
useEffect(() => {setcheckid(signindata);}, [signindata]);

useEffect(() => {
  const entry = user[checkid.name];
  if (entry) {
    const data = Object.values(entry.message?.getnotes || {})
    setnotes(data);
  }
}, [checkid.name, user]);

const speak = (e,condition)=>{
    const speech = new SpeechSynthesisUtterance(e);
  if(condition===1){
    speech.lang = "hi-IN";
    speech.rate = .8;     // speed
    speech.pitch = 1;    // tone
    speech.volume = 1; 
    window.speechSynthesis.speak(speech);
    setaudio(true);
    const wordspeed = e.trim().split(/\s+/).length;
    const wtime = (wordspeed/2);
    setTimeout(() => {
      setaudio(false);
    },wtime*1000);
  }
  else{
      window.speechSynthesis.cancel(speech);
      setaudio(false);
  }
}
useEffect(()=>{
  getaudiodata(audio)
},[audio])

 const editdata=(index)=>{
    setsave(true);
    setphoneopt({status:false})
    setedit({flag:true,index:index});
 }
const funslideStyle = (e)=>{
  
 { if(heading!==""||slideStyle==="2"){
  setslideStyle(e);
  }
  else if(heading===""&&e!=="1"){toast.error("Enter heading first")}}

 {if(e==="1"&&createcount===false){
   setcreatecount(true);
  }
  else if(e==="1"&&createcount===true){setcreatecount(false);}}
  
}


const copydata = (e)=>{
   navigator.clipboard.writeText(e);
   toast.success('copied')
}

useEffect(()=>{
 const user = entries.find(([id, value]) => {
    return id === checkid.name && value.userdetails?.password === checkid.pass;
  });

  if (user) {
    const [, value] = user;
     setcurrentmode(value.userdetails.mode);
    sendmode(value.userdetails.mode)
    donelogin({
      username: value.userdetails?.name,
      gender: value.userdetails?.gender,
      phone: value.userdetails?.phone,
      email: value.userdetails?.email,
      password: value.userdetails?.password,
      mode: value.userdetails?.mode,
      index: notes.length,
    });
  }
},[notes])

const selectnote = (i,val)=>{
     setvalue(val);
     setslideStyle("2")
     setcreatecount(false);
     setphoneopt({
     status: true, 
      bnum: i
});
}
 
  return (
    <div>
    <div className='note-con' style={{background:`${currentmode? "#0f1f17":'white'}`}}>
      
  <div className='note-box'>
      <div className="note-area">

       {checkid.name==='test'? <div className='lf-box'><h2 style={{color:`${currentmode? 'white':"#0f1f17"}`}} >Login First</h2> <img src={login} alt='login'/></div>
        :
        
        <div className={`note-bar ${createcount?"active-note-bar":''}`} >
            <button style={{transition:".3s linear",transform: `${createcount?'rotate(315deg)':'rotate(0deg)'}`}} className={`slide-b ${notes.length===0?'anim-sb': ''}`} onClick={()=>{funslideStyle("1"),setphoneopt(false),setvalue('')}}><i className="fa-solid fa-plus"></i></button>
            <button className={`slide-b ${createcount?"":'active-slide-b'}`} onClick={()=>{funslideStyle("2"),setsave(true)}}><i className="fa-regular fa-keyboard"></i></button>
            <button className={`slide-b ${createcount?"":'active-slide-b'}`} onClick={()=>{funslideStyle("3")}}><i className="fa-solid fa-microphone"></i></button>
            <input value={heading} onChange={(e)=>{setheading(e.target.value.trim())}} placeholder='Heading...' style={{display:`${(createcount&&slideStyle==="1")?"flex":"none"}`}}/>
        </div>}
      <div style={{height:'100%',width:"100%",background:`${currentmode? "#0f1f17":'white'}`,display:"flex",alignItems:'center',justifyContent:'center',display:`${(checkid.name!='test'&&notes.length===0)?"flex": "none"}`}}><img className='empty-img' src={empty} alt='empty'/></div>
      {/* Loop through all users */}
      <div value={searchval} onChange={(e)=>{setsearchval(e.target.value.trim())}} style={{display:`${(slideStyle==="1"&&checkid.name!='test')?"flex":"none"}`}} className= 'search'><input placeholder='Search Notes...'/><i className="fa-solid fa-magnifying-glass"></i></div>
      
      {entries.map(([id, value]) => (
        <div className='note-ele' key={id}  >
          {checkid.name === id &&     
          (
            <> 
             {  Object.values(value.message?.getnotes || {}).filter((hed)=>hed.heading.toLowerCase().startsWith(searchval.toLocaleLowerCase())||searchval==="").map((m, index) => (
                 
                 <div className='note-elements' key={index} style={{border:`${currentmode?"2px solid rgb(150, 215, 150)":"2px solid #026302"}`}} >
                  <h2 style={{color:`${currentmode? "white":"black"}`}} >{index+1}<p className='time'>{m.time}</p></h2>
                  <div onClick={()=>{selectnote(index,m.contant)}} className='note-content' style={{color:`${currentmode? "rgb(150, 215, 150)":"#026302"}`}} ><p style={{color:`${currentmode? "white":"black"}`}} >{m.heading}</p>{m.contant}</div>
                  <i style={{color:`${currentmode? "white":"black"}`}} onClick={()=>{copydata(m.contant)}} id='note-toggle' className="fa-regular fa-clone"></i>
                { (phoneopt.bnum===index && phoneopt.status===true) &&
                  <div className='note-opt'>
                     <button onClick={()=>{deletedata(id,index)}}><i className="fa-regular fa-trash-can"></i></button>
                     <button onClick={()=>{editdata(index)}}><i className="fa-regular fa-pen-to-square"></i></button>
                     <button onClick={()=>{speak(m.contant,1)}}><i className="fa-solid fa-bullhorn"></i></button>
                     <button onClick={()=>{speak(m.contant,2)}}><i className="fa-regular fa-circle-stop"></i></button>
                </div>}
                </div> 
                
              ))}
            </>
          )}
        </div>
      ))}
     </div>
        <div style={{background:`${currentmode? "#0f1f17":'white'}`}} className={`create-voice-area ${slideStyle==="3"? "active-create-voice-area":""}`}>
          <div className="voice-note">
           <div className='voice-result'>{transcript}</div>
           <div className='buttons'>
            <button onClick={()=>{setaudio(true),start()}} className='start'>start</button>
            <button onClick={()=>{SpeechRecognition.stopListening(),setaudio(false)}} className="stop">stop</button>
            <button onClick={()=>{savenote("1")}} className="save">save</button>
           </div>
          </div>
          <div className="ai-note">
            <i id='lock' className="fa-solid fa-lock"></i>
            <div className='ai-result'>{loading? <ThreeDots 
                  height="40"
                  width="40"
                  color="black"
                  visible={true}
                   wrapperStyle={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100%'}}
             /> : result}</div>
            <div className='buttons'>            
            <button className="ai" ><i className="fa-solid fa-wand-magic-sparkles"></i>Ai</button>
            <button className="save" >save</button>
           </div>
          </div>
        </div>
         <div style={{background:`${currentmode? "#1a1d1f":"white"}`}} className={`create-written-area ${slideStyle==="2"? "active-create-written-area":""}`}>
         <div style={{marginTop:'15px'}}> 
          <Editor
  height="70vh"
  width="100vw"
  theme={`${currentmode? "vs-dark" : "default"}`}
  value={value}
  onChange={(value)=>setvalue(value)}
  options={{
    fontSize: 16,
    minimap: { enabled: false }
  }}
/>
     </div>
     <button style={{display:`${save? "inline":"none"}`}} className='written-save-btn' onClick={()=>{savenote("3"),setsave(false)}}>save</button>
         </div>
        </div>
   </div>
   <ToastContainer/>
   </div>
  )}
