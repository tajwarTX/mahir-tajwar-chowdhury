import React, { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import IntroBlock from "../components/IntroBlock";
import NameTag from "../components/NameTag";
import scrollDown from "../assets/miscellaneous/scrolldown.gif";
import profileImg from "../assets/photo/profile.jpg";
import CuttingMatLayer from "../components/CuttingMatLayer";
import DigitalCaliper from "../components/DigitalCaliper";
import WorkshopGrunge from "../components/WorkshopGrunge";

const ModelSlider = lazy(() => import('../components/ModelSlider'));

export default function Home2() {
  const introRef = useRef(null);
  const canvasSectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const projectsSectionRef = useRef(null);
  const perspectiveRef = useRef(null);
  const tiltWrapperRef = useRef(null);

  const [showArrowScroll, setShowArrowScroll] = useState(false);

  // Scroll-driven 3D camera perspective tilt — instant, no delay
  useEffect(() => {
    const container = scrollContainerRef.current;
    const projectsSection = projectsSectionRef.current;
    const perspectiveEl = perspectiveRef.current;
    const tiltEl = tiltWrapperRef.current;
    if (!container || !projectsSection || !perspectiveEl || !tiltEl) return;

    let ticking = false;
    let cachedSectionTop = 0;
    let cachedViewportH = 0;
    let cachedSectionH = 0;

    const updateMetrics = () => {
      if (!container || !projectsSection) return;
      cachedViewportH = container.clientHeight;
      cachedSectionTop = projectsSection.offsetTop;
      cachedSectionH = projectsSection.offsetHeight;
    };

    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    
    // Also update metrics after a small delay in case lazily loaded components shift layout
    setTimeout(updateMetrics, 500);
    setTimeout(updateMetrics, 1500);

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = container.scrollTop;
          
          // Calculate progress using cached un-transformed metrics
          const sectionTopRelative = cachedSectionTop - scrollY;
          const progress = sectionTopRelative / cachedViewportH;

          let tilt = 0;
          
          if (progress <= 1.0 && progress > 0.8) {
            // Rapid entrance tilt: start aggressively right as the section hits the screen bottom
            tilt = ((1.0 - progress) / 0.2) * 40;
          } else if (progress <= 0.8 && progress >= -0.4) {
            tilt = 40;
          } else if (progress < -0.4 && progress > -0.5) {
            // Rapidly fade out tightly between 40% and 50% scrolled out
            tilt = ((progress + 0.5) / 0.1) * 40;
          }
          tilt = Math.max(0, Math.min(40, Math.round(tilt * 100) / 100));

          // 1. Perspective camera vanishing point locked to viewport center
          const centerY = scrollY + (cachedViewportH / 2);
          perspectiveEl.style.perspectiveOrigin = `50% ${centerY}px`;

          // 2. Physical 3D pivot fixed geometrically to avoid spatial leaping
          const pivotY = cachedSectionTop + (cachedSectionH / 2);
          tiltEl.style.transformOrigin = `50% ${pivotY}px`;
          tiltEl.style.transform = `rotateX(${tilt}deg)`;

          // 3. Counter-rotate the model slider so it sits completely flat to the screen!
          // We translate it along its local Z (which points straight at the camera after counter-rotation)
          // 400px ensures its bottom edge perfectly clears the tilted green mat coming up at the bottom.
          // We scale by 0.77 (1400/1800) to optically cancel the zoom from moving it 400px closer to the 1800px perspective camera.
          projectsSection.style.transform = `rotateX(${-tilt}deg) translateZ(400px) scale(0.77)`;
          projectsSection.style.transformStyle = 'preserve-3d';
          projectsSection.style.transformOrigin = '50% 50%';
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    container.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('resize', updateMetrics);
      container.removeEventListener('scroll', onScroll);
    };
  }, []);

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
    <div ref={scrollContainerRef} className="w-full relative h-screen overflow-y-auto overflow-x-hidden bg-[#0E4735]">
      <style>
        {`
          /* Peeling Curled Sticker Effect - Static */
          .curled-sticker::before, .curled-sticker::after {
            content: "";
            position: absolute;
            z-index: -1;
            bottom: 12px;
            left: 8px;
            width: 45%;
            height: 20%;
            box-shadow: 0 15px 12px rgba(0,0,0,0.3);
            transform: rotate(-4deg);
          }
          .curled-sticker::after {
            transform: rotate(4deg);
            right: 8px;
            left: auto;
          }

          /* Paper Tape Effect - Realistic Fiber/Matte */
          .tape-piece {
            position: absolute;
            top: 13px;
            left: -45px;
            width: 200px;
            height: 48px;
            background: rgba(244, 240, 230, 0.94);
            box-shadow: 
              1px 2px 6px rgba(0,0,0,0.15),
              inset 0 0 12px rgba(0,0,0,0.05);
            transform: rotate(-40deg);
            z-index: 100;
            pointer-events: none;
            /* Organic torn edges */
            clip-path: polygon(
              2% 0%, 5% 4%, 12% 1%, 18% 5%, 25% 2%, 35% 6%, 45% 1%, 55% 4%, 65% 2%, 75% 6%, 85% 1%, 92% 5%, 98% 0%,
              101% 15%, 99% 30%, 101% 50%, 99% 70%, 101% 85%,
              98% 100%, 92% 95%, 85% 99%, 75% 94%, 65% 98%, 55% 95%, 45% 99%, 35% 94%, 25% 98%, 15% 95%, 8% 99%, 2% 95%, 0% 100%,
              -1% 85%, 1% 70%, -1% 50%, 1% 30%, -1% 15%
            );
          }
          .tape-piece::after {
            content: "";
            position: absolute;
            inset: 0;
            background: 
              url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperFiber'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -0.8 0.6'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23paperFiber)' opacity='0.3'/%3E%3C/svg%3E"),
              linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
            opacity: 0.5;
            mix-blend-mode: multiply;
          }

          /* Fabric Wrinkles & Folds Overlay - Strengthened */
          .fabric-texture::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 50;
            pointer-events: none;
            background: 
              linear-gradient(108deg, transparent 46%, rgba(0,0,0,0.15) 50%, rgba(255,255,255,0.22) 54%, transparent 58%),
              linear-gradient(125deg, transparent 72%, rgba(0,0,0,0.2) 77%, transparent 82%),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='crumple'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015' numOctaves='3' result='noise'/%3E%3CfeDiffuseLighting in='noise' lighting-color='%23ffffff' surfaceScale='5.5'%3E%3CfeDistantLight azimuth='45' elevation='40'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23crumple)' opacity='0.6'/%3E%3C/svg%3E");
            mix-blend-mode: multiply;
          }
        `}
      </style>

      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <filter id="fabric-warp" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="1" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div 
        ref={perspectiveRef}
        className="relative w-full min-h-max"
        style={{
          perspective: '1800px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <div
          ref={tiltWrapperRef}
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(0deg)',
            willChange: 'transform',
          }}
        >
        <CuttingMatLayer />
        <WorkshopGrunge />
        <DigitalCaliper containerRef={scrollContainerRef} />
        
        {/* Intro Section */}
        <section
          ref={introRef}
          className="relative w-full h-screen flex justify-center items-center flex-col pb-[5vh]"
        >
          <div className="relative flex flex-col z-0 items-center">
            <NameTag scrollRootRef={scrollContainerRef} />
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
            <div className="flex flex-col gap-8 md:gap-10">
              <h2 className="text-[68px] md:text-[130px] lg:text-[160px] font-orbitron font-extrabold leading-[0.8] text-white uppercase tracking-tighter">
                WHO
                <br />
                <span className="text-[#000724] text-[75px] md:text-[145px] lg:text-[185px]">
                  AM I ?
                </span>
              </h2>
              <div 
                className="curled-sticker relative w-full max-w-xs md:max-w-sm aspect-[3/4]"
                style={{ transform: 'rotate(2deg)' }}
              >
                {/* Tape Piece */}
                <div className="tape-piece" />
                
                <div className="fabric-texture w-full h-full overflow-hidden" 
                     style={{ 
                       borderRadius: '4px',
                       filter: 'url(#fabric-warp)'
                     }}>
                  <img
                    src={profileImg}
                    alt="Mahir Tajwar Chowdhury"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top shadow-sm"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
              </div>
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

        {/* Text etched onto the 3D mat (tilts with the environment) */}
        <div className="relative w-full z-10 pointer-events-none mt-40 -mb-20">
          <div className="relative top-20 left-[12.25%] flex items-end inline-block">
            {/* Visual Layer (Behind Models) */}
            <div className="z-0 flex items-end pointer-events-none">
              <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none transition-colors">
                Kind of <span className="text-[#a600ff]">projects</span> <br />
                i worked on
              </h2>
              <div className="-ml-28 mb-[5px]">
                <span className="font-geist text-[13px] md:text-sm opacity-50 lowercase tracking-[0.2em] font-light underline underline-offset-4 text-white">
                  learn more &rarr;
                </span>
              </div>
            </div>

            {/* Interaction Layer (Invisible on top of Models) */}
            <div className="absolute inset-0 z-[2000] pointer-events-none flex items-end">
              <div className="invisible font-orbitron text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Kind of projects <br />
                i worked on
              </div>
              <Link to="/projects" className="cursor-target inline-block -ml-28 mb-[5px] pointer-events-auto opacity-0">
                <span className="font-geist text-[13px] md:text-sm lowercase tracking-[0.2em] font-light underline underline-offset-4">
                  learn more &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── SECTION 02 ── (Model Slider counter-rotates and floats completely flat) */}
        <section ref={projectsSectionRef} className="relative z-10 w-full min-h-screen">
          <Suspense fallback={<div style={{ height: '600px' }} />}>
            <ModelSlider />
          </Suspense>
        </section>

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
        </div>{/* Close preserve-3d wrapper */}
      </div>
    </div>
  );
}