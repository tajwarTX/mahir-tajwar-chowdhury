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

        {/* Right Side: High-Tech Request Terminal */}
        <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto z-10 bg-white/[0.03] border border-white/10 p-8 md:p-12 backdrop-blur-md rounded-lg shadow-2xl">
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#a600ff]/50 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#a600ff]/50 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#a600ff]/50 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#a600ff]/50 rounded-br-lg" />

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="request-form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-10"
              >
                <div className="space-y-1">
                  <h3 className="font-orbitron text-white text-[10px] tracking-[0.5em] uppercase font-bold opacity-80">
                    ACCESS_TERMINAL // v.02
                  </h3>
                  <div className="h-[1px] w-full bg-gradient-to-r from-[#a600ff]/40 via-[#a600ff]/10 to-transparent" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-3 group">
                    <label className="block font-geist text-[10px] text-white/90 uppercase tracking-[0.4em] transition-colors duration-300 group-focus-within:text-[#a600ff]">
                      IDENTIFIER_NAME
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        value={formData.name}
                        placeholder="ENTER FULL NAME"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 px-4 py-4 font-geist text-[11px] text-white uppercase tracking-[0.2em] focus:outline-none focus:border-[#a600ff]/60 focus:bg-black/40 transition-all duration-300 placeholder:text-white/20 rounded-sm"
                      />
                      <div className="absolute bottom-0 left-0 h-[1px] bg-[#a600ff] w-0 group-focus-within:w-full transition-all duration-500 shadow-[0_0_10px_#a600ff]" />
                    </div>
                  </div>

                  <div className="space-y-3 group">
                    <label className="block font-geist text-[10px] text-white/90 uppercase tracking-[0.4em] transition-colors duration-300 group-focus-within:text-[#a600ff]">
                      COMMUNICATION_RELAY
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="email"
                        value={formData.email}
                        placeholder="ENTER EMAIL ADDRESS"
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 px-4 py-4 font-geist text-[11px] text-white uppercase tracking-[0.2em] focus:outline-none focus:border-[#a600ff]/60 focus:bg-black/40 transition-all duration-300 placeholder:text-white/20 rounded-sm"
                      />
                      <div className="absolute bottom-0 left-0 h-[1px] bg-[#a600ff] w-0 group-focus-within:w-full transition-all duration-500 shadow-[0_0_10px_#a600ff]" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="group relative w-full overflow-hidden border border-[#a600ff]/40 bg-transparent py-5 transition-all duration-500 hover:border-[#a600ff] active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-[#a600ff]/0 group-hover:bg-[#a600ff]/10 transition-colors duration-500" />
                    {/* Animated Line Effect */}
                    <div className="absolute top-0 left-[-100%] group-hover:left-[100%] w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-all duration-1000 ease-in-out" />
                    
                    <span className="relative font-geist text-[11px] text-[#a600ff] uppercase tracking-[0.6em] font-black group-hover:text-white transition-colors duration-500">
                      INITIATE_SYNC
                    </span>
                  </button>
                </form>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#a600ff] animate-pulse" />
                    <p className="font-geist text-white/40 text-[8px] uppercase tracking-[0.4em]">
                      SECURE_ENCRYPTION_ACTIVE
                    </p>
                  </div>
                  <span className="font-geist text-white/10 text-[8px] tracking-[0.2em]">STABLE_CONN</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8 flex flex-col items-center text-center py-6"
              >
                <div className="relative">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 border border-[#a600ff]/30 rounded-full flex items-center justify-center"
                  >
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-10 h-10 border-2 border-[#a600ff] rounded-full"
                    />
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white uppercase tracking-tighter leading-tight">
                    SYNC <br/>
                    <span className="text-[#a600ff]">SUCCESSFUL</span>
                  </h2>
                  <div className="w-12 h-[1px] bg-[#a600ff] mx-auto" />
                  <p className="font-geist text-white/70 text-[10px] md:text-xs uppercase tracking-[0.3em] leading-relaxed max-w-[280px]">
                    THE DIGITAL DOSSIER HAS BEEN DISPATCHED TO YOUR RELAY ADDRESS.
                  </p>
                </div>
                
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 font-geist text-[9px] text-[#a600ff] uppercase tracking-[0.4em] hover:text-white transition-all duration-300 flex items-center gap-2 border border-[#a600ff]/20 px-6 py-3 rounded-full hover:bg-[#a600ff]/10"
                >
                  <span>←</span> NEW_REQUEST
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Resume;
