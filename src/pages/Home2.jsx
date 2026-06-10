import React, { useRef, useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

import IntroBlock from "../components/IntroBlock";
import NameTag from "../components/NameTag";
import scrollDown from "../assets/miscellaneous/scrolldown.gif";
import profileImg from "../assets/photo/profile.jpg";

import DigitalCaliper from "../components/DigitalCaliper";
import IPadKicad from "../components/IPadKicad";
import WorkshopGrunge from "../components/WorkshopGrunge";

const ModelSlider = lazy(() => import('../components/ModelSlider'));


export default function Home2() {
  const introRef = useRef(null);
  const canvasSectionRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const ipadWrapperRef = useRef(null);
  const sliderApiRef = useRef(null);        // imperative handle for ModelSlider
  const sliderSectionRef = useRef(null);    // the <section> wrapping ModelSlider
  const [showArrowScroll, setShowArrowScroll] = useState(false);
  const [showSliderArrow, setShowSliderArrow] = useState(false);

  // iPad scroll physics logic
  const ipadPhysicsRef = useRef({ x: 180, y: 320, rot: 0 });

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let ticking = false;
    const updateIpad = () => {
      const el = ipadWrapperRef.current;
      if (!el) { ticking = false; return; }

      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const scrollTop = container.scrollTop;
      
      // Section 1 is 0vh, Section 2 is 100vh.
      // To animate as we scroll down into Section 3 (200vh), we watch progress from 1vh to 2vh.
      const scrollPos = scrollTop - vh;
      let progress = scrollPos / vh;
      progress = Math.max(0, Math.min(1, progress));

      // Use a gentle Ease-Out curve to prevent high peak-velocities in the middle of the scroll
      const ease = 1 - (1 - progress) * (1 - progress);

      const startX = 180; 
      const startY = 320; 
      const startRot = 0;
      
      const endX = 260 - (vw / 2);
      const endY = (vh / 2) + 330;
      const endRot = 16; 

      // These are the scroll-target coordinates
      const targetX = startX + (endX - startX) * ease;
      const targetY = startY + (endY - startY) * ease;
      const targetRot = startRot + (endRot - startRot) * ease;

      // High lerp = snaps to target quickly = feels heavy/grounded (no long coast after scroll stops)
      const p = ipadPhysicsRef.current;
      p.x += (targetX - p.x) * 0.1;
      p.y += (targetY - p.y) * 0.1;
      p.rot += (targetRot - p.rot) * 0.1;

      el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rot}deg)`;
      
      // Keep physics ticking until momentum completely stops
      if (Math.abs(p.x - targetX) > 0.5 || Math.abs(p.y - targetY) > 0.5 || Math.abs(p.rot - targetRot) > 0.1) {
        requestAnimationFrame(updateIpad);
      } else {
        ticking = false;
      }
    };

    const handleScroll = () => {
      // Always re-awaken the physics loop on scroll if it settled
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateIpad);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    updateIpad(); // initial position

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    let fadeTimeout1;
    let fadeTimeout2;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === introRef.current) {
            if (entry.isIntersecting) {
              clearTimeout(fadeTimeout1);
              fadeTimeout1 = setTimeout(() => setShowArrowScroll(true), 800);
            } else {
              clearTimeout(fadeTimeout1);
              setShowArrowScroll(false);
            }
          } else if (entry.target === sliderSectionRef.current) {
            if (entry.isIntersecting) {
              clearTimeout(fadeTimeout2);
              fadeTimeout2 = setTimeout(() => setShowSliderArrow(true), 800);
            } else {
              clearTimeout(fadeTimeout2);
              setShowSliderArrow(false);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (introRef.current) {
      observer.observe(introRef.current);
    }
    if (sliderSectionRef.current) {
      observer.observe(sliderSectionRef.current);
    }

    fadeTimeout1 = setTimeout(() => setShowArrowScroll(true), 1500);

    return () => {
      observer.disconnect();
      clearTimeout(fadeTimeout1);
      clearTimeout(fadeTimeout2);
    };
  }, []);

  // ── Scroll-hijack via overflow lock ──────────────────────────────────────────
  // Strategy: when the slider section snaps into view, lock the container's
  // overflow-y to 'hidden' so the browser CANNOT snap to the next section.
  // We then drive the slider ourselves via window wheel/touch events.
  // Once all models are shown (or we go back past model 0), unlock the container.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let lockTimeout;

    const lockScroll = () => {
      // Do NOT instantly change overflowY, because altering overflow violently aborts
      // any native CSS 'snap-mandatory' smooth easing currently in progress. 
      // We wait for the snap to finish math-perfectly using a scroll debounce later.
    };
    const unlockScroll = () => {
      container.style.overflowY = 'auto';
    };

    const handleScrollSettle = () => {
      clearTimeout(lockTimeout);
      lockTimeout = setTimeout(() => {
        if (isLocked) {
          container.style.overflowY = 'hidden';
          // Now perfectly snapped & physically cemented.
        }
      }, 150);
    };
    container.addEventListener('scroll', handleScrollSettle, { passive: true });

    let isLocked = false;
    let cooldown = false;
    let accumulatedDelta = 0;
    let wheelTimeout;
    let touchStartY = 0;
    let touchStartX = 0;
    
    let horizontalCooldown = false;
    let horizontalTimeout;

    const observerOptions = { root: container, threshold: 0.90 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLocked) {
          isLocked = true;
          lockScroll();
          
          // CRUCIAL: Add a strict cooldown to absorb residual trackpad momentum 
          // when sliding into the section natively, so they don't accidentally skip a model!
          accumulatedDelta = 0;
          cooldown = true;
          setTimeout(() => { cooldown = false; }, 800);
        }
      });
    }, observerOptions);

    if (sliderSectionRef.current) {
      observer.observe(sliderSectionRef.current);
    }

    const onWheel = (e) => {
      if (!isLocked) return;
      
      // Ignore primarily horizontal scrolling and lock out vertical switching temporarily
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 5) {
        horizontalCooldown = true;
        clearTimeout(horizontalTimeout);
        horizontalTimeout = setTimeout(() => { horizontalCooldown = false; }, 300);
        accumulatedDelta = 0;
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      if (horizontalCooldown) return;

      e.preventDefault(); // Stop native scroll bounce
      const api = sliderApiRef.current;
      if (!api) return;

      if (cooldown) return;

      accumulatedDelta += e.deltaY;
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => { accumulatedDelta = 0; }, 100);

      // Require a very deliberate, heavy trackpad swipe to switch
      if (Math.abs(accumulatedDelta) < 150) return;

      const goingDown = accumulatedDelta > 0;
      accumulatedDelta = 0;

      const activeIdx = api.getActiveIndex();
      const total = api.totalSlides;

      if (goingDown) {
        if (activeIdx >= total - 1) {
          isLocked = false;
          unlockScroll();
          
          // Double-rAF: wait for browser to fully re-enable overflow & repaint layout,
          // then nudge just enough for CSS scroll-snap to take over smoothly.
          requestAnimationFrame(() => requestAnimationFrame(() => {
            container.scrollBy({ top: window.innerHeight * 0.15, behavior: 'smooth' });
          }));
          return;
        }
        cooldown = true;
        setTimeout(() => { cooldown = false; }, 500);
        api.goNext();
      } else {
        if (activeIdx <= 0) {
          isLocked = false;
          unlockScroll();

          // Double-rAF: wait for browser to fully re-enable overflow & repaint layout,
          // then nudge just enough for CSS scroll-snap to take over smoothly.
          requestAnimationFrame(() => requestAnimationFrame(() => {
            container.scrollBy({ top: -window.innerHeight * 0.15, behavior: 'smooth' });
          }));
          return;
        }
        cooldown = true;
        setTimeout(() => { cooldown = false; }, 500);
        api.goPrev();
      }
    };

    // ── Touch support on window ──
    const onTouchStart = (e) => { 
      touchStartY = e.touches[0].clientY; 
      touchStartX = e.touches[0].clientX;
    };
    const onTouchMove = (e) => {
      if (!isLocked) return;

      const dx = touchStartX - e.touches[0].clientX;
      const dy = touchStartY - e.touches[0].clientY;
      
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        horizontalCooldown = true;
        clearTimeout(horizontalTimeout);
        horizontalTimeout = setTimeout(() => { horizontalCooldown = false; }, 300);
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      if (horizontalCooldown) return;

      e.preventDefault(); // Stop native scroll panning
      const api = sliderApiRef.current;
      if (!api) return;

      if (Math.abs(dy) < 50) return; // require stronger swipe

      const goingDown = dy > 0;
      const activeIdx = api.getActiveIndex();
      const total = api.totalSlides;

      if (goingDown) {
        if (activeIdx >= total - 1) {
          isLocked = false; 
          unlockScroll(); 
          requestAnimationFrame(() => requestAnimationFrame(() => {
            container.scrollBy({ top: window.innerHeight * 0.15, behavior: 'smooth' });
          }));
          return; 
        }
        if (cooldown) return;
        cooldown = true;
        touchStartY = e.touches[0].clientY;
        setTimeout(() => { cooldown = false; }, 500);
        api.goNext();
      } else {
        if (activeIdx <= 0) { 
          isLocked = false; 
          unlockScroll(); 
          requestAnimationFrame(() => requestAnimationFrame(() => {
            container.scrollBy({ top: -window.innerHeight * 0.15, behavior: 'smooth' });
          }));
          return; 
        }
        if (cooldown) return;
        cooldown = true;
        touchStartY = e.touches[0].clientY;
        setTimeout(() => { cooldown = false; }, 500);
        api.goPrev();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', onTouchStart, { passive: false, capture: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });

    return () => {
      observer.disconnect();
      unlockScroll();
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('touchstart', onTouchStart, { capture: true });
      window.removeEventListener('touchmove', onTouchMove, { capture: true });
      container.removeEventListener('scroll', handleScrollSettle);
      clearTimeout(lockTimeout);
    };
  }, []);


  return (
    <div ref={scrollContainerRef} className="w-full relative h-screen overflow-y-auto overflow-x-hidden bg-[#003B42] snap-y snap-mandatory">
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
        className="relative w-full min-h-max"
        style={{
          backgroundColor: '#003B42',
          overflow: 'visible',
        }}
      >
        <WorkshopGrunge />
        <DigitalCaliper containerRef={scrollContainerRef} />

        {/* Intro Section */}
        <section
          ref={introRef}
          className="snap-section relative w-full h-screen flex justify-center items-center flex-col snap-start snap-always shrink-0"
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
        <section className="snap-section relative w-full h-screen flex items-center justify-center px-6 md:px-24 py-4 z-10 block snap-start snap-always shrink-0">
          <div ref={ipadWrapperRef} className="absolute bottom-0 right-0 z-0 pointer-events-none" style={{ transform: 'translate3d(180px, 320px, 0)', willChange: 'transform' }}>
            <IPadKicad scrollRootRef={scrollContainerRef} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl items-center gap-0 md:gap-1">
            <div className="flex flex-col gap-8 md:gap-10">
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
            <div className="flex flex-col items-start text-left self-center space-y-6 -ml-20 md:-ml-28 lg:-ml-36">
              <h2 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[1.1] transition-colors relative z-0">
                WHO <span className="text-[#e1ff51]">AM I ?</span>
              </h2>
              <div className="max-w-md md:max-w-lg lg:max-w-xl">
                <span className="block text-white text-base md:text-lg lg:text-xl font-geist font-medium uppercase tracking-[0.2em] leading-tight">
                  ELECTRICAL ENGINEERING STUDENT WITH A FOCUS ON ROBOTICS, CURRENTLY PURSUING MY BACHELOR’S DEGREE AT <span style={{ color: '#FF671F' }}>ROCHESTER&nbsp;INSTITUTE&nbsp;OF&nbsp;TECHNOLOGY</span>
                </span>
                <span className="block text-white/40 text-[11px] md:text-xs lg:text-sm font-geist font-light uppercase tracking-widest leading-relaxed mt-4">
                  WITH A CREATIVE APPROACH AND A PASSION FOR ROBOTICS, I BUILD CIRCUITS, AUTONOMOUS ROBOTS, UAVS, DRONES, AND WORK ON PASSION PROJECTS THAT TURN ENGINEERING IDEAS INTO REAL WORKING SYSTEMS.
                </span>
                <div className="mt-12 flex flex-col items-start">
                  <span className="text-[#e1ff51] text-2xl md:text-3xl font-orbitron font-bold">
                    (01)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── iPad + Bio Section ───────────────────────────────────────────── */}
        <section className="snap-section relative w-full h-screen z-0 snap-start snap-always shrink-0 overflow-hidden">
          {/* Text content pinned to the right */}
          <div className="absolute right-4 md:right-8 lg:right-16 top-[40%] flex flex-col gap-8 max-w-md lg:max-w-lg z-10">

            {/* Bio body — three-tier opacity exactly from About page */}
            <div className="space-y-5 border-t border-white/10 pt-6">
              <span className="block font-geist text-white text-base md:text-lg lg:text-xl font-medium uppercase tracking-[0.2em] leading-tight">
                I am a multidisciplinary roboticist and engineer. My work focuses on the intersection of hardware logic and autonomous systems.
              </span>
              <span className="block font-geist text-white/50 text-[11px] md:text-xs lg:text-sm font-light uppercase tracking-widest leading-relaxed">
                As an International Robot Olympiad (IRO) Gold Medalist, I am dedicated to perfecting autonomous interactions. My background from Mirzapur Cadet College has shaped my precision-driven approach to engineering.
              </span>
              <span className="block font-geist text-white/30 text-[11px] md:text-xs lg:text-sm font-light uppercase tracking-widest leading-relaxed">
                With a relentless focus on the future, I aim to continue developing robotic solutions that redefine how we interact with autonomous machines.
              </span>
            </div>

            {/* Section counter — same as Who Am I */}
            <div className="flex flex-col items-start">
              <span className="text-[#e1ff51] text-2xl md:text-3xl font-orbitron font-bold">(02)</span>
            </div>
          </div>
        </section>

        {/* ── Model Slider ────────────────────────────────────────────────── */}
        <section ref={sliderSectionRef} className="snap-section relative z-10 w-full h-screen snap-start snap-always shrink-0 flex flex-col items-center justify-center px-6 md:px-24 pb-12 md:pb-20">

          <div className="flex flex-col items-start text-left mb-1 md:mb-2 w-full max-w-7xl pt-20 md:pt-28">
            <h2 className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[1.1] transition-colors relative z-0">
              Kind of <span className="text-[#e1ff51]">projects</span> <br />
              i worked on
            </h2>
            <Link to="/projects" className="inline-block mt-6 font-geist text-[13px] md:text-sm lowercase tracking-[0.2em] text-[#e1ff51] opacity-70 hover:opacity-100 font-light underline underline-offset-8 transition-opacity cursor-target relative z-20">
              explore work &rarr;
            </Link>
          </div>

          <div className="w-full relative z-10 flex justify-center items-center -mt-48">
            <Suspense fallback={<div style={{ height: '600px' }} />}>
              <ModelSlider ref={sliderApiRef} />
            </Suspense>
          </div>

          <img
            src={scrollDown}
            alt="scroll down"
            loading="lazy"
            decoding="async"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 pointer-events-none transition-opacity duration-700"
            style={{ opacity: showSliderArrow ? 0.3 : 0 }}
          />

        </section>

        {/* ── SECTION 03 ── */}
        <section className="snap-section relative w-full h-screen z-10 flex items-center justify-center snap-start snap-always shrink-0" />

        {/* ── SECTION 04 ── */}
        <section className="snap-section relative w-full h-screen z-10 flex items-center justify-center snap-start snap-always shrink-0" />

        {/* ── SECTION 05 ── */}
        <section className="snap-section relative w-full h-screen z-10 flex items-center justify-center snap-start snap-always shrink-0" />

        {/* ── SECTION 06 ── */}
        <section
          ref={canvasSectionRef}
          className="relative w-full h-screen z-10 flex items-center justify-center snap-start snap-always shrink-0"
        />

        {/* Footer Section */}
        <footer className="relative w-full z-20 overflow-hidden snap-end shrink-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.02) 4%, rgba(0,0,0,0.06) 8%, rgba(0,0,0,0.12) 13%, rgba(0,0,0,0.2) 19%, rgba(0,0,0,0.28) 25%, rgba(0,0,0,0.38) 32%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.62) 48%, rgba(0,0,0,0.73) 56%, rgba(0,0,0,0.83) 64%, rgba(0,0,0,0.91) 72%, rgba(0,0,0,0.97) 80%, #000 88%)' }}>
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