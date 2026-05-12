import React from 'react';
import { motion } from 'framer-motion';
import ScrollLetterRevealDelayed from "../components/ScrollLetterRevealDelayed";

const awardsData = [
  {
    year: "2025",
    title: "OUTSTANDING ENGINEERING ACHIEVEMENT",
    org: "ROCHESTER INSTITUTE OF TECHNOLOGY",
    description: "RECOGNIZED FOR EXCEPTIONAL CONTRIBUTIONS TO ROBOTICS RESEARCH AND AUTONOMOUS SYSTEMS DEVELOPMENT."
  },
  {
    year: "2024",
    title: "GLOBAL INNOVATION CHALLENGE - FINALIST",
    org: "ROBOTICS WORLD EXPO",
    description: "TOP 10 GLOBAL FINALIST FOR DEVELOPING AN ADVANCED LIDAR-BASED NAVIGATION SYSTEM FOR UAVS."
  },
  {
    year: "2023",
    title: "TECHNICAL EXCELLENCE AWARD",
    org: "IEEE STUDENT BRANCH",
    description: "AWARDED FOR DESIGNING AND IMPLEMENTING A HIGH-EFFICIENCY POWER DISTRIBUTION SYSTEM FOR DRONES."
  },
  {
    year: "2022",
    title: "DEAN'S HONOR LIST",
    org: "ROCHESTER INSTITUTE OF TECHNOLOGY",
    description: "CONSISTENT ACADEMIC EXCELLENCE WITHIN THE KATE GLEASON COLLEGE OF ENGINEERING."
  }
];

export const Awards = () => {
  return (
    <div className="w-full min-h-screen bg-black px-6 md:px-24 py-32 md:py-48 overflow-hidden selection:bg-[#a600ff] selection:text-white relative">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(166,0,255,0.1)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-[20]">
        
        {/* Header Section */}
        <div className="flex flex-col mb-24">
          <h1 className="font-orbitron text-[38px] md:text-[75px] lg:text-[100px] font-extrabold text-white uppercase leading-[0.9] lg:leading-[0.8] tracking-tighter">
            <ScrollLetterRevealDelayed text="HONORS &" duration={200} delay={0} />
            <br />
            <span className="text-[#a600ff]">
               <ScrollLetterRevealDelayed text="AWARDS" duration={200} delay={0.1} />
            </span>
          </h1>
          
          <div className="mt-12 max-w-xl">
             <p className="font-geist text-white/40 text-xs md:text-sm uppercase tracking-[0.3em] font-medium leading-relaxed">
               A COLLECTION OF RECOGNITIONS, ACHIEVEMENTS, AND MILESTONES THROUGHOUT MY ACADEMIC AND PROFESSIONAL ENGINEERING JOURNEY.
             </p>
          </div>
        </div>

        {/* Awards List Section */}
        <div className="grid grid-cols-1 gap-px bg-white/10 border border-white/10">
          {awardsData.map((award, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="bg-black p-8 md:p-12 group hover:bg-white/[0.02] transition-all duration-500 relative overflow-hidden"
            >
              {/* Hover Effect Line */}
              <motion.div 
                className="absolute bottom-0 left-0 h-[2px] bg-[#a600ff] w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_200px] items-start gap-8 md:gap-16">
                
                {/* Year */}
                <div className="font-orbitron text-2xl md:text-3xl font-bold text-white/20 group-hover:text-[#a600ff] transition-colors duration-500">
                  {award.year}
                </div>

                {/* Content */}
                <div className="flex flex-col">
                  <h3 className="font-orbitron text-xl md:text-2xl font-bold text-white mb-3 tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                    {award.title}
                  </h3>
                  <p className="font-geist text-white/50 text-[10px] md:text-xs uppercase tracking-widest leading-relaxed max-w-2xl">
                    {award.description}
                  </p>
                </div>

                {/* Organization */}
                <div className="md:text-right flex md:flex-col justify-between md:justify-start items-center md:items-end">
                   <span className="font-geist text-[9px] md:text-[10px] text-[#a600ff] font-bold uppercase tracking-[0.4em] mb-2">
                     ISSUED BY
                   </span>
                   <span className="font-geist text-[10px] md:text-[11px] text-white/70 uppercase tracking-widest text-right">
                     {award.org}
                   </span>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Accent */}
        <div className="mt-24 flex flex-col items-center">
          <div className="w-[1px] h-20 bg-gradient-to-b from-[#a600ff] to-transparent opacity-40"></div>
          <span className="mt-4 font-orbitron text-[10px] text-white/20 uppercase tracking-[0.8em]">
            END_OF_RECORD
          </span>
        </div>

      </div>
    </div>
  );
};

export default Awards;
