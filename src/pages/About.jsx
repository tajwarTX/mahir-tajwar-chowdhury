/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import profileImg from "../assets/profile.jpg";
import ModelSlider from "../components/3d/ModelSlider";

const About = () => {
  const [systemTime, setSystemTime] = useState("");
  
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-black selection:bg-[#a600ff] selection:text-white pb-32">


      {/* Background Decor */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none z-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <section className="relative pt-40 px-6 md:px-24 max-w-[1200px] mx-auto z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* Circular Profile Image - Simplified for performance */}
          <div className="mb-12">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-[#a600ff] shadow-[0_0_30px_rgba(166,0,255,0.2)]">
              <img 
                src={profileImg} 
                alt="Mahir Tajwar Chowdhury" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="font-orbitron text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">
              Mahir Tajwar <span className="text-[#a600ff]">Chowdhury</span>
            </h1>

            <div className="flex items-center justify-center gap-4 mb-10 opacity-60">
              <span className="font-geist text-xs tracking-[0.4em] text-white uppercase">Roboticist // Engineer // IRO Gold Medalist</span>
            </div>

            <div className="space-y-8 text-left border-t border-white/10 pt-10">
              <p className="font-geist text-white/90 text-xl leading-relaxed">
                I am a multidisciplinary roboticist and engineer. My work focuses on the intersection of hardware logic and autonomous systems.
              </p>
              
              <p className="font-geist text-white/60 text-base leading-loose uppercase tracking-wide">
                As an International Robot Olympiad (IRO) Gold Medalist, I am dedicated to perfecting autonomous interactions. My background from Mirzapur Cadet College has shaped my precision-driven approach to engineering.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16 pt-10 border-t border-white/10">
                <div>
                  <h3 className="font-orbitron text-[#a600ff] text-sm font-bold uppercase mb-4 tracking-widest">Achievements</h3>
                  <ul className="font-geist text-xs text-white/50 space-y-2 uppercase tracking-wider">
                    <li>• IRO Gold Medalist</li>
                    <li>• National Robotics Champion</li>
                    <li>• Mirzapur Cadet College Alumnus</li>
                    <li>• STCSTC Framework Specialist</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-orbitron text-[#a600ff] text-sm font-bold uppercase mb-4 tracking-widest">System Info</h3>
                  <ul className="font-geist text-xs text-white/50 space-y-2 uppercase tracking-wider">
                    <li>• Status: Active</li>
                    <li>• Location: Dhaka, BD</li>
                    <li>• Local Time: {systemTime}</li>
                    <li>• Specialization: Autonomous Logic</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model Slider — smooothy style */}
      <section className="relative mt-40 z-10">
        <div className="px-6 md:px-24 max-w-[1200px] mx-auto mb-12">
          <div className="w-full flex items-center gap-8 opacity-20">
            <div className="h-[1px] flex-grow bg-white" />
            <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.6em' }} className="text-white uppercase whitespace-nowrap">OBJECT_ARCHIVE</span>
            <div className="h-[1px] flex-grow bg-white" />
          </div>
        </div>
        <ModelSlider />
      </section>

      <footer className="mt-24 border-t border-white/10 pt-10 px-6 md:px-24 max-w-[1200px] mx-auto opacity-30 text-center">
        <span className="font-geist text-[9px] text-white tracking-[0.5em] uppercase">
          © 2026 // MAHIR_TAJWAR_CHOWDHURY
        </span>
      </footer>
    </div>
  );
};

export default About;