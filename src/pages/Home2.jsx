import React, { useRef, useState, useEffect } from "react";
import IntroBlock from "../components/IntroBlock";
import NameTag from "../components/NameTag";
import scrollDown from "../assets/miscellaneous/scrolldown.gif";
import CuttingMatLayer from "../components/CuttingMatLayer";
import DigitalCaliper from "../components/DigitalCaliper";

export default function Home2() {
  const introRef = useRef(null);
  const canvasSectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [showArrowScroll, setShowArrowScroll] = useState(false);

  useEffect(() => {
    let fadeTimeout;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fadeTimeout);
          fadeTimeout = setTimeout(() => setShowArrowScroll(true), 800);
        } else {
          clearTimeout(fadeTimeout);
          setShowArrowScroll(false);
        }
      },
      { threshold: 0.1 }
    );

    if (introRef.current) {
      observer.observe(introRef.current);
    }

    fadeTimeout = setTimeout(() => setShowArrowScroll(true), 1500);

    return () => {
      observer.disconnect();
      clearTimeout(fadeTimeout);
    };
  }, []);

  return (
    <div ref={scrollContainerRef} className="w-full relative h-screen overflow-y-auto overflow-x-hidden bg-[#106653]">
      <div className="relative w-full min-h-max">
        <CuttingMatLayer />
        <DigitalCaliper containerRef={scrollContainerRef} />
        
        {/* Intro Section */}
        <section
          ref={introRef}
          className="relative w-full h-screen flex justify-center items-center flex-col pb-[5vh]"
        >
          <div className="relative flex flex-col z-0 items-center">
            <NameTag />
          </div>
          <img
            src={scrollDown}
            alt="scroll down"
            loading="lazy"
            decoding="async"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 pointer-events-none transition-opacity duration-700"
            style={{ opacity: showArrowScroll ? 0.3 : 0 }}
          />
        </section>

        {/* About Section */}
        <section className="relative w-full min-h-screen flex items-center justify-center px-6 md:px-24 py-16 md:py-20 z-10 block">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl items-center gap-12">
            <div className="flex flex-col">
              <h2 className="text-[68px] md:text-[130px] lg:text-[160px] font-orbitron font-extrabold leading-[0.8] text-white uppercase tracking-tighter">
                WHO
                <br />
                <span className="text-[#000724] text-[75px] md:text-[145px] lg:text-[185px]">
                  AM I ?
                </span>
              </h2>
            </div>
            <div className="flex flex-col items-end text-right self-center space-y-6">
              <div className="max-w-md md:max-w-lg lg:max-w-xl">
                <span className="block text-white text-base md:text-lg lg:text-xl font-geist font-medium uppercase tracking-[0.2em] leading-tight">
                  ELECTRICAL ENGINEERING STUDENT WITH A FOCUS ON ROBOTICS, CURRENTLY PURSUING MY BACHELOR’S DEGREE AT <span style={{ color: '#FF671F' }}>ROCHESTER&nbsp;INSTITUTE&nbsp;OF&nbsp;TECHNOLOGY</span>
                </span>
                <span className="block text-white/40 text-[11px] md:text-xs lg:text-sm font-geist font-light uppercase tracking-widest leading-relaxed mt-4">
                  WITH A CREATIVE APPROACH AND A PASSION FOR ROBOTICS, I BUILD CIRCUITS, AUTONOMOUS ROBOTS, UAVS, DRONES, AND WORK ON PASSION PROJECTS THAT TURN ENGINEERING IDEAS INTO REAL WORKING SYSTEMS.
                </span>
                <div className="mt-12 flex flex-col items-end">
                  <span className="text-[#000724] text-2xl md:text-3xl font-orbitron font-bold">
                    (01)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 02 ── */}
        <section className="relative w-full min-h-screen z-10" />

        {/* ── SECTION 03 ── */}
        <section className="relative w-full min-h-screen z-10" />

        {/* ── SECTION 04 ── */}
        <section className="relative w-full min-h-screen z-10" />

        {/* ── SECTION 05 ── */}
        <section className="relative w-full min-h-screen z-10" />

        {/* ── SECTION 06 ── */}
        <section
          ref={canvasSectionRef}
          className="relative w-full min-h-screen z-10"
        />

        {/* Footer Section */}
        <footer className="relative w-full z-20 overflow-hidden" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.02) 4%, rgba(0,0,0,0.06) 8%, rgba(0,0,0,0.12) 13%, rgba(0,0,0,0.2) 19%, rgba(0,0,0,0.28) 25%, rgba(0,0,0,0.38) 32%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.62) 48%, rgba(0,0,0,0.73) 56%, rgba(0,0,0,0.83) 64%, rgba(0,0,0,0.91) 72%, rgba(0,0,0,0.97) 80%, #000 88%)' }}>
          <div className="flex items-stretch min-h-[280px] md:min-h-[700px]">
            {/* Giant TX• Monogram - only bottom-clipped by parent overflow-hidden */}
            <div className="relative flex-shrink-0 w-[300px] md:w-[500px] select-none pointer-events-none">
              <div
                className="absolute bottom-[-0.18em] left-[-0.04em] font-orbitron font-extrabold text-white leading-none whitespace-nowrap flex items-center"
                style={{ fontSize: 'clamp(180px, 26vw, 350px)', letterSpacing: '-0.04em' }}
              >
                <span>TX</span>
                <span
                  className="inline-block rounded-full bg-white"
                  style={{ width: '0.16em', height: '0.16em', marginLeft: '0.06em', marginBottom: '0.5em', flexShrink: 0 }}
                />
              </div>
            </div>

            {/* Link Columns */}
            <div className="absolute inset-0 flex items-start pointer-events-none" style={{ paddingTop: '28.99rem', paddingLeft: 'clamp(380px, 42vw, 800px)', paddingRight: '8rem', paddingBottom: '2.5rem' }}>
              <div className="flex flex-1 items-start pointer-events-auto" style={{ gap: '0' }}>

                {/* Nav Links + Social Links grouped close together */}
                <div className="flex gap-16 md:gap-52">
                  {/* Nav Links */}
                  <div className="flex flex-col items-start gap-1.5">
                    <a href="/" className="text-white/60 font-geist text-[11px] md:text-xs tracking-widest uppercase hover:text-white hover:opacity-100 hover:font-bold transition-all duration-200"><span className="cursor-target px-2 py-0.5">HOME</span></a>
                    <a href="/home2" className="text-white font-geist font-bold text-[11px] md:text-xs tracking-widest uppercase hover:text-white hover:opacity-100 hover:font-bold transition-all duration-200"><span className="cursor-target px-2 py-0.5">HOME 2</span></a>
                    <a href="/about" className="text-white/60 font-geist text-[11px] md:text-xs tracking-widest uppercase hover:text-white hover:opacity-100 hover:font-bold transition-all duration-200"><span className="cursor-target px-2 py-0.5">ABOUT</span></a>
                    <a href="/projects" className="text-white/60 font-geist text-[11px] md:text-xs tracking-widest uppercase hover:text-white hover:opacity-100 hover:font-bold transition-all duration-200"><span className="cursor-target px-2 py-0.5">PROJECTS</span></a>
                    <a href="/awards" className="text-white/60 font-geist text-[11px] md:text-xs tracking-widest uppercase hover:text-white hover:opacity-100 hover:font-bold transition-all duration-200"><span className="cursor-target px-2 py-0.5">AWARDS</span></a>
                    <a href="/resume" className="text-white/60 font-geist text-[11px] md:text-xs tracking-widest uppercase hover:text-white hover:opacity-100 hover:font-bold transition-all duration-200"><span className="cursor-target px-2 py-0.5">RESUME</span></a>
                    <a href="/contact" className="text-white/60 font-geist text-[11px] md:text-xs tracking-widest uppercase hover:text-white hover:opacity-100 hover:font-bold transition-all duration-200"><span className="cursor-target px-2 py-0.5">CONTACT</span></a>
                  </div>

                  {/* Social Links */}
                  <div className="flex flex-col items-start gap-1.5">
                    <a href="https://www.facebook.com/tajwar.tx" target="_blank" rel="noreferrer" className="text-white/60 font-geist text-[11px] md:text-xs tracking-widest uppercase hover:text-white hover:opacity-100 hover:font-bold transition-all duration-200"><span className="cursor-target px-2 py-0.5">FACEBOOK</span></a>
                    <a href="https://www.linkedin.com/in/mahir-tajwar-chowdhury/" target="_blank" rel="noreferrer" className="text-white/60 font-geist text-[11px] md:text-xs tracking-widest uppercase hover:text-white hover:opacity-100 hover:font-bold transition-all duration-200"><span className="cursor-target px-2 py-0.5">LINKEDIN</span></a>
                    <a href="https://www.youtube.com/@tajwarTX" target="_blank" rel="noreferrer" className="text-white/60 font-geist text-[11px] md:text-xs tracking-widest uppercase hover:text-white hover:opacity-100 hover:font-bold transition-all duration-200"><span className="cursor-target px-2 py-0.5">YOUTUBE</span></a>
                    <a href="https://github.com/tajwarTX" target="_blank" rel="noreferrer" className="text-white/60 font-geist text-[11px] md:text-xs tracking-widest uppercase hover:text-white hover:opacity-100 hover:font-bold transition-all duration-200"><span className="cursor-target px-2 py-0.5">GITHUB</span></a>
                    <a href="mailto:mt5507@rit.edu" className="text-white/60 font-geist text-[11px] md:text-xs tracking-widest uppercase hover:text-white hover:opacity-100 hover:font-bold transition-all duration-200"><span className="cursor-target px-2 py-0.5">EMAIL</span></a>
                  </div>
                </div>

                {/* Label - pushed to far right */}
                <div className="flex flex-col items-start gap-1.5 ml-96">
                  <span className="text-white/60 font-geist text-[11px] md:text-xs tracking-widest uppercase">PERSONAL</span>
                  <span className="text-white/60 font-geist text-[11px] md:text-xs tracking-widest uppercase">PORTFOLIO</span>
                  <span className="text-white/60 font-geist text-[11px] md:text-xs tracking-widest uppercase">WEBSITE 26&apos;</span>
                </div>

              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}