import React from "react";
import "./Home.css";
import CloudImage from "./cloud.svg";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLock,
  FaCloud,
  FaMobileAlt,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
const Home = ({signindata,currentmode}) => {
  const navigator = useNavigate();
  const [checkid, setcheckid] = useState({name:"test",pass:"test1"});

  useEffect(() => {
    
    setcheckid(signindata);
  }, [signindata]);
  return (
    <div className="home">

      {/* HERO */}
      <section className="hero" style={{background:`${currentmode? "#0f1f17":'white'}`,color:`${currentmode? 'white':"#0f1f17"}`}}>
        <div className="hero-content">
          <h1>
            Secure Notes <span>In The Cloud</span>
          </h1>
          <p style={{color:`${currentmode? '#cbd5e1':"#78a788"}`}}>
            Never lose a thought again.
Securely save your ideas in the cloud and access them anytime, from any device — with blazing-fast sync and uncompromising protection.
          </p>

          <div className="hero-buttons">
            <button onClick={()=>{navigator('/Notes')}} className="btn primary" >Get Started</button>
            <button onClick={()=>{navigator('/Signin');}} className="btn outline"style={{display:`${checkid.name!='test'? 'none' : 'block'}`}} >Login</button>
          </div>
        </div>

        <div className="hero-image">
           <img src={CloudImage} alt="Cloud Sync" />
          
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" style={{background:`${currentmode? "rgb(16 15 15)":'rgb(128 128 128 / 14%)'}`}} >
        <div className="card" style={{background:`${currentmode? "rgba(255, 255, 255, .8)":'rgb(128 128 128)'}`,color:`${currentmode? '#0f1f17':"white"}`}}>
          <FaLock className="icon" />
          <h3>Secure Login</h3>
          <p>Protected authentication system keeps your data safe.</p>
        </div>

        <div className="card" style={{background:`${currentmode? "rgba(255, 255, 255, 0.8)":'rgb(128 128 128)'}`,color:`${currentmode? '#0f1f17':"white"}`}}>
          <FaCloud className="icon" />
          <h3>Cloud Sync</h3>
          <p>Real-time sync across all devices instantly.</p>
        </div>

        <div className="card" style={{background:`${currentmode? "rgba(255, 255, 255, 0.8)":'rgb(128 128 128)'}`,color:`${currentmode? '#0f1f17':"white"}`}} >
          <FaMobileAlt className="icon" />
          <h3>Multi Device</h3>
          <p>Works perfectly on phone, tablet and desktop.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
      </section>

      {/* BIG FOOTER */}
      <footer className="footer" style={{background:`${currentmode? "#0f1f17":'white'}`,color:`${currentmode? 'white':"#0f1f17"}`}} >
        <div className="footer-grid">

          <div>
            <h3>GreenNotes</h3>
            <p>
              A modern cloud note system designed for students and developers.
            </p>
          </div>

          <div>
            <h4>Product</h4>
            <ul>
              <li>Features</li>
              <li>Security</li>
              <li>Updates</li>
              <li>Pricing</li>
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li>About</li>
              <li>Careers</li>
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>

          <div>
            <h4>Social</h4>
            <div className="social">
              <FaGithub />
              <FaLinkedin />
              <FaTwitter />
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Cloudpad. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default Home;