/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollLetterRevealDelayed from "../components/ScrollLetterRevealDelayed";

export const Contact = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
     e.preventDefault();
     setIsSubmitting(true);

     try {
       const response = await fetch("https://formspree.io/f/mvzddpak", { 
         method: "POST",
         headers: { 
           "Content-Type": "application/json",
           "Accept": "application/json"
         },
         body: JSON.stringify({
           name: formData.name,
           email: formData.email,
           message: `CONTACT FORM MESSAGE:\n\n${formData.message}`
         })
       });

       if (response.ok) {
         setSubmitted(true);
       }
     } catch (error) {
       console.error("Submission error:", error);
     } finally {
       setIsSubmitting(false);
     }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-black px-6 md:px-24 py-20 md:py-32 overflow-hidden selection:bg-[#a600ff] selection:text-white">

      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(166,0,255,0.15)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-[20]">

        <div className="flex flex-col items-center text-center lg:items-start lg:text-left z-10 w-full relative">
          <h1 className="font-orbitron text-[38px] md:text-[75px] lg:text-[90px] font-extrabold text-white uppercase leading-[0.9] lg:leading-[0.8] tracking-tighter">
            <ScrollLetterRevealDelayed text="INITIATE" duration={200} delay={0} />
            <br />
            <span className="text-[#a600ff]">
               <ScrollLetterRevealDelayed text="CONTACT" duration={200} delay={0.1} />
            </span>
          </h1>

          <div className="mt-8 flex flex-col lg:flex-row items-center gap-4">
             <div className="h-[1px] w-12 bg-[#a600ff]" />
             <span className="font-geist text-[10px] md:text-[11px] text-white/60 uppercase tracking-[0.4em] font-medium">
               ARCHIVE_003 
             </span>
          </div>

          <p className="font-geist text-white/80 text-xs md:text-sm uppercase tracking-[0.3em] font-medium leading-relaxed max-w-lg mt-8 mx-auto lg:mx-0">
            PROVIDE YOUR DETAILS AND MESSAGE TO INITIATE A SECURE COMMUNICATION CHANNEL WITH MAHIR TAJWAR.
          </p>

          <div className="flex gap-6 mt-10 mx-auto lg:mx-0">
            <motion.a 
              href="https://www.facebook.com/tajwar.tx" 
              target="_blank" 
              rel="noreferrer" 
              initial="initial"
              whileHover="hover"
              className="relative w-14 h-14 flex items-center justify-center rounded-full border border-white/20 hover:border-[#a600ff] text-white/60 hover:text-white transition-colors duration-300 cursor-target overflow-hidden group"
            >
              <motion.div
                variants={{
                  initial: { y: "100%" },
                  hover: { y: 0 }
                }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0 bg-[#a600ff] z-0 rounded-full"
              />
              <span className="relative z-10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </span>
            </motion.a>
            <motion.a 
              href="https://www.linkedin.com/in/mahir-tajwar-chowdhury/" 
              target="_blank" 
              rel="noreferrer" 
              initial="initial"
              whileHover="hover"
              className="relative w-14 h-14 flex items-center justify-center rounded-full border border-white/20 hover:border-[#a600ff] text-white/60 hover:text-white transition-colors duration-300 cursor-target overflow-hidden group"
            >
              <motion.div
                variants={{
                  initial: { y: "100%" },
                  hover: { y: 0 }
                }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0 bg-[#a600ff] z-0 rounded-full"
              />
              <span className="relative z-10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </span>
            </motion.a>
            <motion.a 
              href="https://www.youtube.com/@mahirtajwar_tx" 
              target="_blank" 
              rel="noreferrer" 
              initial="initial"
              whileHover="hover"
              className="relative w-14 h-14 flex items-center justify-center rounded-full border border-white/20 hover:border-[#a600ff] text-white/60 hover:text-white transition-colors duration-300 cursor-target overflow-hidden group"
            >
              <motion.div
                variants={{
                  initial: { y: "100%" },
                  hover: { y: 0 }
                }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0 bg-[#a600ff] z-0 rounded-full"
              />
              <span className="relative z-10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </span>
            </motion.a>
            <motion.a 
              href="https://github.com/tajwarTX" 
              target="_blank" 
              rel="noreferrer" 
              initial="initial"
              whileHover="hover"
              className="relative w-14 h-14 flex items-center justify-center rounded-full border border-white/20 hover:border-[#a600ff] text-white/60 hover:text-white transition-colors duration-300 cursor-target overflow-hidden group"
            >
              <motion.div
                variants={{
                  initial: { y: "100%" },
                  hover: { y: 0 }
                }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0 bg-[#a600ff] z-0 rounded-full"
              />
              <span className="relative z-10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </span>
            </motion.a>
            <motion.a 
              href="mailto:tajwar185@gmail.com" 
              target="_blank" 
              rel="noreferrer" 
              initial="initial"
              whileHover="hover"
              className="relative w-14 h-14 flex items-center justify-center rounded-full border border-white/20 hover:border-[#a600ff] text-white/60 hover:text-white transition-colors duration-300 cursor-target overflow-hidden group"
            >
              <motion.div
                variants={{
                  initial: { y: "100%" },
                  hover: { y: 0 }
                }}
                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                className="absolute inset-0 bg-[#a600ff] z-0 rounded-full"
              />
              <span className="relative z-10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
            </motion.a>
          </div>

        </div>

        <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto z-10">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="contact-form"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                className="space-y-12 relative"
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2 group">
                    <label className="block font-geist text-[10px] text-white/90 uppercase tracking-[0.4em] transition-colors duration-200 group-focus-within:text-[#a600ff]">
                      FULL NAME
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      placeholder="ENTER NAME"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border-b border-white/20 py-3 font-geist text-[15px] text-white uppercase tracking-[0.2em] focus:outline-none focus:border-[#a600ff] transition-all duration-300 placeholder:text-white/30"
                    />
                  </div>

                  <div className="space-y-2 group">
                    <label className="block font-geist text-[10px] text-white/90 uppercase tracking-[0.4em] transition-colors duration-200 group-focus-within:text-[#a600ff]">
                      CONTACT EMAIL
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      placeholder="ENTER EMAIL ADDRESS"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent border-b border-white/20 py-3 font-geist text-[15px] text-white tracking-[0.2em] focus:outline-none focus:border-[#a600ff] transition-all duration-300 placeholder:text-white/30"
                    />
                  </div>

                  <div className="space-y-2 group">
                    <label className="block font-geist text-[10px] text-white/90 uppercase tracking-[0.4em] transition-colors duration-200 group-focus-within:text-[#a600ff]">
                      MESSAGE
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      placeholder="ENTER YOUR MESSAGE"
                      rows={4}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-transparent border-b border-white/20 py-3 font-geist text-[15px] text-white tracking-[0.2em] focus:outline-none focus:border-[#a600ff] transition-all duration-300 placeholder:text-white/30 resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover="hover"
                    initial="initial"
                    className="relative w-full cursor-target border border-[#a600ff]/30 hover:border-[#a600ff] py-5 transition-all duration-300 active:scale-[0.98] mt-4 overflow-hidden group"
                  >
                    <motion.div
                      variants={{
                        initial: { x: "-100%" },
                        hover: { x: 0 }
                      }}
                      transition={{ duration: 0.85, ease: [0.19, 1, 0.22, 1] }}
                      className="absolute inset-0 bg-[#a600ff] z-0"
                    />
                    <span className="relative z-10 font-geist text-[11px] text-[#a600ff] group-hover:text-white uppercase tracking-[0.5em] font-bold transition-colors duration-300">
                      {isSubmitting ? "TRANSMITTING..." : "TRANSMIT MESSAGE"}
                    </span>
                  </motion.button>
                </form>

                <div className="flex items-center gap-4 absolute -bottom-16 left-0">
                  <div className="h-[1px] w-6 bg-white/20" />
                  <p className="font-geist text-white/50 text-[8px] uppercase tracking-[0.3em]">
                    SECURE 
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center text-center p-8"
              >
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  className="mb-8"
                >
                  <svg className="w-20 h-20 text-[#a600ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>

                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="font-orbitron text-2xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-4"
                >
                  TRANSMISSION <span className="text-[#a600ff]">SUCCESSFUL</span>
                </motion.h2>

                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="font-geist text-white/60 text-[10px] md:text-xs uppercase tracking-[0.3em] leading-relaxed max-w-sm"
                >
                  DATA SYNC COMPLETE. YOUR MESSAGE HAS BEEN SECURELY DELIVERED TO THE INBOX.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  onClick={() => {
                    navigate('/');
                  }}
                  className="mt-16 px-8 py-4 cursor-target border border-[#a600ff]/30 hover:border-[#a600ff] bg-transparent hover:bg-[#a600ff]/5 font-geist text-[11px] text-[#a600ff] uppercase tracking-[0.4em] transition-all duration-300"
                >
                  RETURN TO HOME
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Contact;