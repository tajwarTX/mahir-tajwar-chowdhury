import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollLetterRevealDelayed from "../components/ScrollLetterRevealDelayed";

/**
 * A high-end, 'gated' Resume page.
 * Uses a login-style interface where users provide credentials to request access.
 * Styled with our signature Orbitron/Geist typography and high-tech minimalism.
 */
export const Resume = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  // Handle Formspree submission (or any email endpoint)
  const handleSubmit = async (e) => {
     e.preventDefault();
     
     // We can use a simple Formspree endpoint (or the user's specific endpoint if provided)
     // For now, we perform the fetch as requested to tajwar185@gmail.com via Formspree API
     try {
       const response = await fetch("https://formspree.io/f/xvgzbgzl", { // Note: Replace with actual ID later if needed, but for now this is a generic placeholder
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           name: formData.name,
           email: formData.email,
           message: "REQUESTING RESUME ACCESS"
         })
       });
       
       if (response.ok) {
         setSubmitted(true);
       }
     } catch (error) {
       console.error("Submission error:", error);
     }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-black px-8 md:px-24 py-32 overflow-hidden selection:bg-[#a600ff] selection:text-white">
      
      {/* Cinematic Backdrop Glow - Replaced heavy CSS blur with a much lighter radial gradient */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(166,0,255,0.15)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-[20]">
        
        {/* Left Side: Typography and Info */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left z-10 w-full relative lg:pt-40">
          <h1 className="font-orbitron text-[50px] md:text-[75px] lg:text-[90px] font-extrabold text-white uppercase leading-[0.8] tracking-tighter">
            <ScrollLetterRevealDelayed text="REQUEST" duration={200} delay={0} />
            <br />
            <span className="text-[#a600ff]">
               <ScrollLetterRevealDelayed text="RESUME.PDF" duration={200} delay={0.1} />
            </span>
          </h1>
          
          <div className="mt-8 flex flex-col lg:flex-row items-center gap-4">
             <div className="h-[1px] w-12 bg-[#a600ff]" />
             <span className="font-geist text-[10px] md:text-[11px] text-white/60 uppercase tracking-[0.4em] font-medium">
               ARCHIVE_002 // DATA_SYNC
             </span>
          </div>

          <p className="font-geist text-white/80 text-xs md:text-sm uppercase tracking-[0.3em] font-medium leading-relaxed max-w-lg mt-8 mx-auto lg:mx-0">
            PROVIDE YOUR DETAILS TO RECEIVE A DIRECT COPY OF MAHIR TAJWAR'S DIGITAL DOSSIER AND ENGINEERING RESUME.
          </p>

          <div className="mt-12 hidden md:flex flex-col items-center lg:items-start gap-4">
            <div className="w-[1.5px] h-24 bg-[#a600ff] opacity-40"></div>
            <div className="text-[#a600ff] text-2xl md:text-3xl font-orbitron font-bold opacity-30 tracking-widest mt-2">(02)</div>
          </div>
        </div>

        {/* Right Side: High-Tech Interactive Form */}
        <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto z-10">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="request-form"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ 
                  y: -40, 
                  opacity: 0,
                  filter: "blur(10px)",
                  transition: { duration: 0.4, ease: [0.19, 1, 0.22, 1] }
                }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="relative p-8 md:p-10 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden group"
              >
                {/* Subtle scanning line background effect */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#a600ff] to-transparent animate-scan" style={{ animationDuration: '4s' }} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                  <div className="space-y-3 group/input">
                    <label className="block font-geist text-[10px] text-[#a600ff] uppercase tracking-[0.4em] font-bold">
                      SYSTEM_ACCESS // NAME
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      placeholder="IDENTIFY YOURSELF"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-4 font-geist text-sm text-white uppercase tracking-[0.2em] focus:outline-none focus:border-[#a600ff] focus:bg-white/[0.05] transition-all duration-500 placeholder:text-white/20"
                    />
                  </div>

                  <div className="space-y-3 group/input">
                    <label className="block font-geist text-[10px] text-[#a600ff] uppercase tracking-[0.4em] font-bold">
                      TRANSMISSION // DESTINATION
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      placeholder="SECURE_EMAIL_ADDRESS"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-4 font-geist text-sm text-white uppercase tracking-[0.2em] focus:outline-none focus:border-[#a600ff] focus:bg-white/[0.05] transition-all duration-500 placeholder:text-white/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full relative overflow-hidden cursor-target border border-[#a600ff]/50 bg-[#a600ff]/10 hover:bg-[#a600ff]/20 py-5 rounded-lg transition-all duration-500 active:scale-[0.98] group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10 font-geist text-[11px] text-white uppercase tracking-[0.6em] font-black">
                      EXECUTE_SYNC
                    </span>
                  </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#a600ff] animate-pulse" />
                    <p className="font-geist text-white/40 text-[8px] uppercase tracking-[0.3em]">
                      SECURE CHANNEL
                    </p>
                  </div>
                  <p className="font-geist text-white/20 text-[8px] uppercase tracking-[0.3em]">
                    v3.1 // ENCRYPTED
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="relative p-10 bg-[#a600ff]/5 border border-[#a600ff]/20 rounded-2xl text-center space-y-8 overflow-hidden"
              >
                {/* Success glow background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(166,0,255,0.1)_0%,_transparent_100%)] pointer-events-none" />
                
                <div className="relative z-10">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 border-2 border-[#a600ff] rounded-full flex items-center justify-center mx-auto mb-8"
                  >
                    <div className="w-8 h-[2px] bg-[#a600ff] rotate-45 translate-x-1 translate-y-1" />
                    <div className="w-4 h-[2px] bg-[#a600ff] -rotate-45 -translate-x-2 translate-y-2" />
                  </motion.div>

                  <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white uppercase tracking-tighter">
                    TRANSFER <br/>
                    <span className="text-[#a600ff] drop-shadow-[0_0_15px_rgba(166,0,255,0.5)]">COMPLETE</span>
                  </h2>
                  
                  <div className="w-12 h-[1px] bg-[#a600ff]/50 mx-auto my-8" />
                  
                  <p className="font-geist text-white/80 text-[10px] md:text-xs uppercase tracking-[0.4em] leading-loose max-w-xs mx-auto">
                    THE DIGITAL DOSSIER HAS BEEN DISPATCHED TO YOUR COORDINATES. CHECK YOUR INBOX FOR RESUME.PDF
                  </p>
                  
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-12 font-geist text-[9px] text-white/40 hover:text-[#a600ff] border border-white/10 hover:border-[#a600ff]/40 px-6 py-3 rounded-full uppercase tracking-[0.4em] transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    RETURN TO TERMINAL
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Resume;
