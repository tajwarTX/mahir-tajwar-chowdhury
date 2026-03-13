import React, { useRef, Suspense, useState, useEffect } from "react";
import IntroBlock from "../components/IntroBlock";
import { Canvas } from "@react-three/fiber";
import Island from "../models/Island";
import scrollDown from "../assets/scrolldown.gif";
import scrollSide from "../assets/scrollside.gif";
import arrow from "../assets/arrow.png";
import ScrollLetterRevealDelayed from "../components/ScrollLetterRevealDelayed";

const BASE_POSITION = { x: -2, y: 43, z: -60 };
const MOBILE_POSITION = { x: -2, y: 24, z: -60 }; // Your requested mobile Y change
const BASE_ROTATION_DEG = { x: -8, y: 124, z: 0 };
const degToRad = (deg) => (deg * Math.PI) / 180;

// Infinite scroll text component
const InfiniteScrollText = () => (
  <div className="absolute left-0 top-[40%] w-full overflow-hidden pointer-events-none z-0">
    <div className="marquee whitespace-nowrap">
      <span className="text-[200px] font-orbitron font-outline text-white">
        ROBOTICS • CREATIVE DEVELOPER • 3D DESIGNING • CINEMATIC • ROBOTICS • CREATIVE DEVELOPER • 3D DESIGNING • CINEMATIC •
      </span>
    </div>
    <style>{`
      .marquee {
        display: flex;
        width: max-content;
        animation: scrollLeft 25s linear infinite;
        will-change: transform;
      }
      @keyframes scrollLeft {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

// Custom hook for drag rotation (Desktop + Mobile)
function useDragRotation(targetRef, rotateSpeed = 0.005) {
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);

  const onStart = (clientX) => {
    draggingRef.current = true;
    lastXRef.current = clientX;
  };

  const onMove = (clientX) => {
    if (!draggingRef.current || !targetRef.current) return;
    const deltaX = clientX - lastXRef.current;
    lastXRef.current = clientX;
    targetRef.current.rotation.y += deltaX * rotateSpeed;
    targetRef.current.userData.dragging = true;
  };

  const onEnd = () => {
    draggingRef.current = false;
    if (targetRef.current) targetRef.current.userData.dragging = false;
  };

  useEffect(() => {
    const handleMouseDown = (e) => onStart(e.clientX);
    const handleMouseMove = (e) => onMove(e.clientX);
    const handleTouchStart = (e) => onStart(e.touches[0].clientX);
    const handleTouchMove = (e) => onMove(e.touches[0].clientX);

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);
}

export default function Home() {
  const islandRef = useRef(null);
  const cameraRef = useRef(null);
  const introRef = useRef(null);
  const canvasSectionRef = useRef(null);

  const [showArrowScroll, setShowArrowScroll] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Responsive States
  const [scale, setScale] = useState([1, 1, 1]);
  const [position, setPosition] = useState([BASE_POSITION.x, BASE_POSITION.y, BASE_POSITION.z]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 430) {
        setScale([0.5, 0.5, 0.5]); 
        setPosition([MOBILE_POSITION.x, MOBILE_POSITION.y, MOBILE_POSITION.z]);
      } else {
        setScale([1, 1, 1]);
        setPosition([BASE_POSITION.x, BASE_POSITION.y, BASE_POSITION.z]);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useDragRotation(islandRef, 0.007);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (canvasSectionRef.current) observer.observe(canvasSectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let fadeTimeout;
    const checkIntroVisible = () => {
      if (!introRef.current) return;
      const rect = introRef.current.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      if (visible) {
        clearTimeout(fadeTimeout);
        fadeTimeout = setTimeout(() => setShowArrowScroll(true), 800);
      } else {
        clearTimeout(fadeTimeout);
        setShowArrowScroll(false);
      }
    };
    window.addEventListener("scroll", checkIntroVisible);
    checkIntroVisible();
    fadeTimeout = setTimeout(() => setShowArrowScroll(true), 1500);
    return () => {
      window.removeEventListener("scroll", checkIntroVisible);
      clearTimeout(fadeTimeout);
    };
  }, []);

  const islandRotation = [
    degToRad(BASE_ROTATION_DEG.x),
    degToRad(BASE_ROTATION_DEG.y),
    degToRad(BASE_ROTATION_DEG.z),
  ];

  return (
    <div className="w-full relative">
      <section ref={introRef} className="relative w-full h-screen flex justify-center items-center flex-col">
        <div className="relative flex flex-col z-20 items-center">
          <IntroBlock />
          <div
            className={`absolute flex items-center gap-3 transition-opacity duration-1000`}
            style={{
              top: "80%",
              left: "26%",
              transform: "translateX(-50%)",
              opacity: showArrowScroll ? 0.4 : 0,
            }}
          >
            <img src={arrow} alt="arrow" className="w-12 h-16" />
            <span className="text-white text-sm tracking-wide relative top-7">switch_languages_</span>
          </div>
        </div>
        <img
          src={scrollDown}
          alt="scroll down"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 pointer-events-none transition-opacity duration-700"
          style={{ opacity: showArrowScroll ? 0.3 : 0 }}
        />
      </section>

      <section className="relative w-full min-h-screen flex items-center justify-center px-10 md:px-24 py-20 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl items-center gap-12">
          <div className="flex flex-col">
            <h2 className="text-[100px] md:text-[180px] lg:text-[220px] font-orbitron font-extrabold leading-[0.8] text-white uppercase tracking-tighter">
              <ScrollLetterRevealDelayed text="WHO" duration={200} delay={0} />
              <br />
              <ScrollLetterRevealDelayed text="AM I?" duration={200} delay={0} />
            </h2>
          </div>
          <div className="flex flex-col items-end text-right self-center space-y-6">
            <div className="max-w-md md:max-w-lg">
              <ScrollLetterRevealDelayed
                text="HI! I'M A CREATIVE DEVELOPER WHO BELIEVES THAT EVERY INTERACTION HAS A STORY WORTH HEARING."
                duration={100}
                delay={0}
                className="block text-white text-lg md:text-xl font-geist font-medium uppercase tracking-[0.2em] leading-tight"
              />
              <ScrollLetterRevealDelayed
                text="WITH A TECHNICAL APPROACH AND ORGANIC STRATEGY, I HELP BRANDS AND INDIVIDUALS TO BE AUTHENTIC, RELEVANT AND ENGAGING IN THE DIGITAL WORLD."
                duration={100}
                delay={0}
                className="block text-white text-sm md:text-base font-geist font-light opacity-70 uppercase tracking-widest leading-relaxed"
              />
              <div className="mt-16 flex flex-col items-end">
                <div className="w-[1.5px] h-24 bg-white opacity-30 mb-4"></div>
                <span className="text-white text-5xl font-orbitron font-bold">(1)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={canvasSectionRef} className="relative w-full -mt-[70px] overflow-hidden flex items-center" style={{ height: "120vh" }}>
        <div className="absolute left-9 md:left-24 max-w-lg z-20 top-1/2 -translate-y-[140%] flex flex-col space-y-0.5">
          <ScrollLetterRevealDelayed text="EXPLORE EVERYTHING ABOUT ME..." duration={100} delay={0} className="text-white text-lg md:text-xl font-geist font-medium uppercase tracking-wide leading-snug" />
          <ScrollLetterRevealDelayed text="STEP INTO AN OPEN 3D WORLD, DISCOVER MY WORK, PASSIONS, AND IDEAS." duration={100} delay={0} className="text-white text-lg md:text-xl font-geist font-medium uppercase tracking-wide leading-snug opacity-80" />
          <ScrollLetterRevealDelayed text="DRAG SIDEWAYS, INTERACT WITH ELEMENTS, DISCOVER HIDDEN STORIES, AND CLICK THE ANNOTATIONS TO DIVE DEEPER." duration={100} delay={0} className="text-white text-sm md:text-base font-geist font-light uppercase tracking-widest leading-relaxed opacity-60" />
        </div>
        <img src={scrollSide} alt="scroll side" className="absolute opacity-40 bottom-10 left-1/2 -translate-x-1/2 w-32 z-10 pointer-events-none" />
        <InfiniteScrollText />
        <Canvas
          ref={cameraRef}
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 50], near: 0.1, far: 1000 }}
        >
          <ambientLight intensity={2} />
          <directionalLight position={[1, 10, 1]} intensity={2} />
          <Suspense fallback={null}>
            <Island
              ref={islandRef}
              cameraRef={cameraRef}
              isIntersecting={isIntersecting}
              position={position} // Responsive Position
              scale={scale}       // Responsive Scale
              rotation={islandRotation}
              annotations={[
                { id: 1, position: [30, -2, -5], title: "My Journey", description: "This is the top view" },
                { id: 2, position: [-8, 2, 6], title: "Experience", description: "A giant old tree" },
              ]}
            />
          </Suspense>
        </Canvas>
      </section>
    </div>
  );
}