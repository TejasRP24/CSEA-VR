import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";

import Zone1 from "./components/zones/Zone1/Zone1";
import Zone2_StudentInnovationGallery from "./components/zones/Zone2_StudentInnovationGallery/Zone2";
import Zone3 from "./components/zones/Zone3/Zone3";
import TechnologyPage from "./components/zones/Zone3/Technologypage";
import LabPage from "./components/zones/Zone3/LabPage";
import Zone4 from "./components/zones/Zone4/Zone4";
import Zone5 from "./components/zones/Zone5/Zone5";
import FloatingChatbot from "./components/chatbot/FloatingChatbot";

import "./App.css";

export default function App() {
  const [systemTime, setSystemTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(
        now.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="min-h-screen text-slate-800 relative font-sans flex flex-col antialiased">

        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          height: '70px',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 30px',
          boxShadow: '0 4px 30px rgba(0,0,0,0.03)',
        }}>
          <a href="index.html" style={{display:'flex', alignItems:'center', gap:'10px', textDecoration:'none'}}>
            <img src="/img/psg_logo.png" alt="PSG Logo" style={{height:'45px', width:'auto'}} />
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', fontFamily: "'Poppins', sans-serif"}}>
              <span style={{color:'#0f172a', fontWeight:800, fontSize:'1.1rem', lineHeight:1.1, letterSpacing:'0.5px'}}>PSG</span>
              <span style={{color:'#64748b', fontWeight:600, fontSize:'0.75rem', lineHeight:1.1}}>College of Technology</span>
            </div>
          </a>

          <div style={{display:'flex', background:'rgba(0,0,0,0.02)', padding:'4px', borderRadius:'14px', border:'1px solid rgba(0,0,0,0.05)', gap:'4px'}}>
            <Link to="/zone1" style={{padding:'8px 18px', borderRadius:'10px', fontSize:'0.78rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', transition:'all 0.3s', color:'#64748b', textDecoration:'none', display:'inline-block'}}
              onMouseOver={e=>{e.target.style.color='#0f172a';e.target.style.background='rgba(37,99,235,0.1)';e.target.style.boxShadow='0 0 15px rgba(37,99,235,0.15)'}}
              onMouseOut={e=>{e.target.style.color='#64748b';e.target.style.background='transparent';e.target.style.boxShadow='none'}}
            >Dept Highlights</Link>
            <Link to="/" style={{padding:'8px 18px', borderRadius:'10px', fontSize:'0.78rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', transition:'all 0.3s', color:'#64748b', textDecoration:'none', display:'inline-block'}}
              onMouseOver={e=>{e.target.style.color='#0f172a';e.target.style.background='rgba(37,99,235,0.1)';e.target.style.boxShadow='0 0 15px rgba(37,99,235,0.15)'}}
              onMouseOut={e=>{e.target.style.color='#64748b';e.target.style.background='transparent';e.target.style.boxShadow='none'}}
            >Innovation Gallery</Link>
            <Link to="/zone3" style={{padding:'8px 18px', borderRadius:'10px', fontSize:'0.78rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', transition:'all 0.3s', color:'#64748b', textDecoration:'none', display:'inline-block'}}
              onMouseOver={e=>{e.target.style.color='#0f172a';e.target.style.background='rgba(37,99,235,0.1)';e.target.style.boxShadow='0 0 15px rgba(37,99,235,0.15)'}}
              onMouseOut={e=>{e.target.style.color='#64748b';e.target.style.background='transparent';e.target.style.boxShadow='none'}}
            >AI & Emerging Tech</Link>
            <Link to="/zone4" style={{padding:'8px 18px', borderRadius:'10px', fontSize:'0.78rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', transition:'all 0.3s', color:'#64748b', textDecoration:'none', display:'inline-block'}}
              onMouseOver={e=>{e.target.style.color='#0f172a';e.target.style.background='rgba(37,99,235,0.1)';e.target.style.boxShadow='0 0 15px rgba(37,99,235,0.15)'}}
              onMouseOut={e=>{e.target.style.color='#64748b';e.target.style.background='transparent';e.target.style.boxShadow='none'}}
            >Research & Innovation</Link>
            <Link to="/zone5" style={{padding:'8px 18px', borderRadius:'10px', fontSize:'0.78rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', transition:'all 0.3s', color:'#64748b', textDecoration:'none', display:'inline-block'}}
              onMouseOver={e=>{e.target.style.color='#0f172a';e.target.style.background='rgba(37,99,235,0.1)';e.target.style.boxShadow='0 0 15px rgba(37,99,235,0.15)'}}
              onMouseOut={e=>{e.target.style.color='#64748b';e.target.style.background='transparent';e.target.style.boxShadow='none'}}
            >Industry Connect</Link>
          </div>

          <a href="index.html" style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            background:'rgba(37,99,235,0.1)', border:'1px solid rgba(37,99,235,0.2)',
            color:'#2563eb', padding:'8px 20px', borderRadius:'50px',
            fontSize:'0.8rem', fontWeight:600, textDecoration:'none',
            transition:'all 0.3s'
          }}
            onMouseOver={e=>{e.target.style.background='rgba(37,99,235,0.2)';e.target.style.boxShadow='0 0 15px rgba(37,99,235,0.2)'}}
            onMouseOut={e=>{e.target.style.background='rgba(37,99,235,0.1)';e.target.style.boxShadow='none'}}
          >
            ← Back to Home
          </a>
        </header>

        <div className="flex-grow w-full">
          <Routes>
            <Route path="/zone1" element={<Zone1 />} />
            <Route path="/" element={<Zone2_StudentInnovationGallery />} />
            <Route path="/zone3" element={<Zone3 />} />
            <Route path="/technology/:slug" element={<TechnologyPage />} />
            <Route path="/technology/:slug/lab/:labId" element={<LabPage />} />
            <Route path="/zone4" element={<Zone4 />} />
            <Route path="/zone5" element={<Zone5 />} />
          </Routes>
        </div>

        <FloatingChatbot />
      </div>
    </Router>
  );
}