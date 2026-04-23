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

        {/* Right Side: Minimal Interactive Form */}
        <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto z-10">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="request-form"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="space-y-12"
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2 group">
                    <label className="block font-geist text-[9px] text-white/90 uppercase tracking-[0.4em] transition-colors duration-200 group-focus-within:text-[#a600ff]">
                      FULL NAME
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      placeholder="ENTER NAME"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border-b border-white/20 py-3 font-geist text-sm text-white uppercase tracking-[0.2em] focus:outline-none focus:border-[#a600ff] transition-all duration-300 placeholder:text-white/30"
                    />
                  </div>

                  <div className="space-y-2 group">
                    <label className="block font-geist text-[9px] text-white/90 uppercase tracking-[0.4em] transition-colors duration-200 group-focus-within:text-[#a600ff]">
                      CONTACT EMAIL
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      placeholder="ENTER EMAIL ADDRESS"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent border-b border-white/20 py-3 font-geist text-sm text-white uppercase tracking-[0.2em] focus:outline-none focus:border-[#a600ff] transition-all duration-300 placeholder:text-white/30"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full cursor-target border border-[#a600ff]/30 hover:border-[#a600ff] bg-[#a600ff]/5 hover:bg-[#a600ff]/10 py-5 transition-all duration-300 active:scale-[0.98] mt-4"
                  >
                    <span className="font-geist text-[10px] text-[#a600ff] uppercase tracking-[0.5em] font-bold">
                      EXECUTE SYNC
                    </span>
                  </button>
                </form>

                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-6 bg-white/20" />
                  <p className="font-geist text-white/50 text-[8px] uppercase tracking-[0.3em]">
                    SECURE // ENCRYPTED
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="space-y-8"
              >
                <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white uppercase tracking-tighter">
                  RESUME <br/>
                  <span className="text-[#a600ff]">DISPATCHED</span>
                </h2>
                
                <div className="w-12 h-[1px] bg-[#a600ff]/50" />
                
                <p className="font-geist text-white/80 text-[10px] md:text-sm uppercase tracking-[0.3em] leading-relaxed">
                  TRANSFER INITIATED. THE RESUME.PDF HAS BEEN SENT TO YOUR INBOX.
                </p>
                
                <button
                  onClick={() => setSubmitted(false)}
                  className="pt-8 font-geist text-[9px] text-[#a600ff]/60 uppercase tracking-[0.4em] hover:text-[#a600ff] transition-colors duration-300 flex items-center gap-2"
                >
                  <span className="text-[12px]">←</span> RETURN
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
