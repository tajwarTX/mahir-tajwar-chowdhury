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

        {/* Right Side: High-Tech Minimalist Form (Refined Scale) */}
        <div className="relative w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto z-10">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="request-form"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="relative p-1 px-1"
              >
                {/* Clean technical frame */}
                <div className="absolute inset-0 border border-[#a600ff]/10 bg-white/[0.01] pointer-events-none" />
                <div className="absolute top-0 left-0 w-6 h-[1px] bg-[#a600ff]" />
                <div className="absolute top-0 left-0 w-[1px] h-6 bg-[#a600ff]" />
                <div className="absolute bottom-0 right-0 w-6 h-[1px] bg-[#a600ff]" />
                <div className="absolute bottom-0 right-0 w-[1px] h-6 bg-[#a600ff]" />

                <form onSubmit={handleSubmit} className="relative p-12 lg:p-16 space-y-16">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-2 h-2 bg-[#a600ff] animate-pulse" />
                    <span className="font-geist text-[10px] text-[#a600ff] uppercase tracking-[0.5em] font-bold">
                      DATA_REQUEST_TERMINAL
                    </span>
                  </div>

                  <div className="space-y-6 group">
                    <div className="flex justify-between items-end">
                      <label className="block font-geist text-xs text-white/90 uppercase tracking-[0.3em] font-bold">
                        IDENT_NAME
                      </label>
                      <span className="font-geist text-[9px] text-[#a600ff]/50 uppercase">REQUIRED</span>
                    </div>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      placeholder="ENTER FULL NAME"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 py-5 font-geist text-base md:text-lg text-white uppercase tracking-[0.1em] focus:outline-none focus:border-[#a600ff] transition-all duration-500 placeholder:text-white/5"
                    />
                  </div>

                  <div className="space-y-6 group">
                    <div className="flex justify-between items-end">
                      <label className="block font-geist text-xs text-white/90 uppercase tracking-[0.3em] font-bold">
                        IDENT_EMAIL
                      </label>
                      <span className="font-geist text-[9px] text-[#a600ff]/50 uppercase">REQUIRED</span>
                    </div>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      placeholder="ENTER EMAIL ADDRESS"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent border-b border-white/10 py-5 font-geist text-base md:text-lg text-white uppercase tracking-[0.1em] focus:outline-none focus:border-[#a600ff] transition-all duration-500 placeholder:text-white/5"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group relative w-full overflow-hidden border border-[#a600ff]/30 hover:border-[#a600ff] bg-[#a600ff]/5 py-7 transition-all duration-500 active:scale-[0.99] mt-12"
                  >
                    <div className="absolute inset-0 bg-[#a600ff] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700 ease-[0.19, 1, 0.22, 1]" />
                    <span className="relative z-10 font-geist text-xs md:text-sm text-[#a600ff] group-hover:text-white uppercase tracking-[0.8em] font-black transition-colors duration-500">
                      EXECUTE_SYNC
                    </span>
                  </button>

                  <div className="flex justify-between items-center pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-[1px] w-6 bg-[#a600ff]/30" />
                      <p className="font-geist text-white/40 text-[8px] uppercase tracking-[0.5em]">
                        SECURE_UPLINK
                      </p>
                    </div>
                    <p className="font-geist text-white/20 text-[8px] uppercase tracking-[0.5em]">
                      v2.1 // ENCRYPTED
                    </p>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="relative p-16 text-center border border-[#a600ff]/20 bg-white/[0.01]"
              >
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#a600ff]" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#a600ff]" />

                <div className="mb-10 flex justify-center">
                  <div className="w-20 h-20 border border-[#a600ff]/30 rounded-full flex items-center justify-center relative overflow-hidden">
                    <motion.div 
                      initial={{ y: "100%" }}
                      animate={{ y: "-100%" }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-[#a600ff]/20"
                    />
                    <span className="text-[#a600ff] text-3xl font-bold">✓</span>
                  </div>
                </div>

                <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white uppercase tracking-[0.1em] mb-6">
                  SYNC <span className="text-[#a600ff]">COMPLETE</span>
                </h2>
                
                <p className="font-geist text-white/70 text-xs uppercase tracking-[0.3em] leading-relaxed mb-12 max-w-sm mx-auto">
                  ENCRYPTED DATA PACKET HAS BEEN DISPATCHED TO YOUR SPECIFIED TERMINAL.
                </p>
                
                <button
                  onClick={() => setSubmitted(false)}
                  className="mx-auto font-geist text-[10px] text-[#a600ff]/70 hover:text-[#a600ff] uppercase tracking-[0.5em] hover:tracking-[0.7em] transition-all duration-300 flex items-center gap-4"
                >
                  <span className="text-xl">←</span> RETURN_TO_ENTRY
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
