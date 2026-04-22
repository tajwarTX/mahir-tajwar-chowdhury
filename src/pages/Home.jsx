import React, { useRef, Suspense, useState, useEffect } from "react";
import IntroBlock from "../components/IntroBlock";
import { Canvas, useFrame } from "@react-three/fiber";
import Island from "../models/Island";
import scrollDown from "../assets/scrolldown.gif";
import scrollSide from "../assets/scrollside.gif";
import ScrollLetterRevealDelayed from "../components/ScrollLetterRevealDelayed";
import gsap from "gsap";

const BASE_POSITION = { x: -2, y: 43, z: -60 };
const MOBILE_POSITION = { x: -2, y: 24, z: -60 }; // Your requested mobile Y change
const BASE_ROTATION_DEG = { x: -8, y: 124, z: 0 };
const degToRad = (deg) => (deg * Math.PI) / 180;

// Annotation data with camera positions for each view
const ANNOTATIONS = [
  {
    id: 1,
    position: [30, -2, -5],
    title: "Main Dining Area",
    description: "Where the feast begins",
    cameraPosition: { x: 35, y: 30, z: 40 },
    cameraRotation: { x: -0.3, y: 0.5, z: 0 }
  },
  {
    id: 2,
    position: [-8, 2, 6],
    title: "The Cozy Corner",
    description: "A hidden gem",
    cameraPosition: { x: -20, y: 25, z: 35 },
    cameraRotation: { x: -0.2, y: -0.8, z: 0 }
  },
  {
    id: 3,
    position: [12, 5, -8],
    title: "Window View",
    description: "Scenic overlook",
    cameraPosition: { x: 25, y: 35, z: -30 },
    cameraRotation: { x: -0.4, y: 0.3, z: 0 }
  },
  {
    id: 4,
    position: [-15, -3, 10],
    title: "Kitchen Detail",
    description: "Where magic happens",
    cameraPosition: { x: -30, y: 20, z: 35 },
    cameraRotation: { x: -0.25, y: -0.6, z: 0 }
  },
  {
    id: 5,
    position: [5, 8, -12],
    title: "Overhead Scene",
    description: "The complete picture",
    cameraPosition: { x: 0, y: 50, z: -20 },
    cameraRotation: { x: -0.8, y: 0, z: 0 }
  },
];

// High-performance Infinite scroll text component
const InfiniteScrollText = () => {
  const text = "ROBOTICS • CREATIVE DEVELOPER • 3D DESIGNING • CINEMATIC • ";
  
  return (
    <div className="absolute left-0 top-[45%] w-full overflow-hidden pointer-events-none z-0 select-none">
      <div className="marquee-container flex whitespace-nowrap">
        <div className="marquee-content flex shrink-0 items-center min-w-full">
           <span className="text-[200px] font-orbitron font-outline text-white uppercase">{text}</span>
           <span className="text-[200px] font-orbitron font-outline text-white uppercase">{text}</span>
        </div>
      </div>
      <style>{`
        .marquee-content {
          animation: scrollLeft 30s linear infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }
        @keyframes scrollLeft {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  );
};

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
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const animationRef = useRef(null);

  // Responsive States
  const [scale, setScale] = useState([1, 1, 1]);
  const [position, setPosition] = useState([BASE_POSITION.x, BASE_POSITION.y, BASE_POSITION.z]);

  // Handle annotation click and camera animation
  const handleAnnotationClick = (annotation) => {
    if (!cameraRef.current) return;

    // Kill previous animation if exists
    if (animationRef.current) animationRef.current.kill();

    const camera = cameraRef.current.camera;
    const targetPosition = annotation.cameraPosition;
    const targetRotation = annotation.cameraRotation;

    // Animate camera position and rotation
    animationRef.current = gsap.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 1.2,
      ease: "power2.inOut",
    });

    gsap.to(camera, {
      x: targetRotation.x,
      y: targetRotation.y,
      z: targetRotation.z,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(annotation.position[0], annotation.position[1], annotation.position[2]);
      },
    });

    setActiveAnnotation(annotation.id);
  };

  // Reset camera to default view when clicking "reset" or on empty space
  const resetCamera = () => {
    if (!cameraRef.current) return;
    if (animationRef.current) animationRef.current.kill();

    const camera = cameraRef.current.camera;
    gsap.to(camera.position, {
      x: 0,
      y: 0,
      z: 50,
      duration: 1.2,
      ease: "power2.inOut",
    });

    setActiveAnnotation(null);
  };

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
      <section ref={introRef} className="relative w-full h-screen flex justify-start items-center flex-col pt-[28vh] md:pt-[32vh]">
        <div className="relative flex flex-col z-20 items-center">
          <IntroBlock />
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
            <h2 className="text-[60px] md:text-[100px] lg:text-[130px] font-orbitron font-extrabold leading-[0.8] text-white uppercase tracking-tighter">
              <ScrollLetterRevealDelayed text="THE" duration={200} delay={0} />
              <br />
              <span className="text-[#a600ff]">
                <ScrollLetterRevealDelayed text="IDENTITY" duration={200} delay={0.1} />
              </span>
            </h2>
            <div className="mt-6 flex items-center gap-4">
               <div className="h-[1px] w-10 bg-[#a600ff]" />
               <span className="font-geist text-[9px] md:text-[11px] text-white/40 uppercase tracking-[0.4em] font-medium">
                 ARCHIVE_001 // PERSONAL_SPEC
               </span>
            </div>
          </div>
          <div className="flex flex-col items-end text-right self-center space-y-6">
            <div className="max-w-md md:max-w-lg lg:max-w-xl">
              <ScrollLetterRevealDelayed
                text="CREATIVE DEVELOPER OPERATING AT THE INTERSECTION OF ELECTRICAL ENGINEERING AND CINEMATIC VISUALS."
                duration={100}
                delay={0.2}
                className="block text-white text-base md:text-lg lg:text-xl font-geist font-medium uppercase tracking-[0.2em] leading-tight"
              />
              <ScrollLetterRevealDelayed
                text="SYNCHRONIZING TECHNICAL ARCHITECTURE WITH ORGANIC STRATEGY TO BUILD AUTHENTIC DIGITAL EXPERIENCES."
                duration={100}
                delay={0.3}
                className="block text-white/40 text-[11px] md:text-xs lg:text-sm font-geist font-light uppercase tracking-widest leading-relaxed mt-4"
              />
              <div className="mt-12 flex flex-col items-end">
                <div className="w-[1.5px] h-16 bg-[#a600ff] opacity-40 mb-4"></div>
                <span className="text-[#a600ff] text-2xl md:text-3xl font-orbitron font-bold">(01)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={canvasSectionRef} className="relative w-full -mt-[70px] overflow-hidden flex items-center" style={{ height: "120vh" }}>
        <div className="absolute left-9 md:left-24 max-w-lg z-20 top-1/2 -translate-y-[104%] flex flex-col space-y-4">
          <div className="flex flex-col gap-1">
            <ScrollLetterRevealDelayed 
              text="OPEN_WORLD_MODULE // v2.0" 
              duration={100} 
              delay={0} 
              className="text-[#a600ff] font-geist text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-bold" 
            />
            <h3 className="text-white text-3xl md:text-5xl font-orbitron font-black uppercase tracking-tighter leading-none border-none outline-none">
              <ScrollLetterRevealDelayed text="EXPLORE THE " duration={200} delay={0.1} />
              <span className="text-[#a600ff]">
                <ScrollLetterRevealDelayed text="MATRIX" duration={200} delay={0.2} />
              </span>
            </h3>
          </div>
          
          <div className="space-y-1 max-w-sm lg:max-w-md">
            <ScrollLetterRevealDelayed 
              text="DISCOVER PROJECTS, MILESTONES, AND MY ENGINEERING LIFE." 
              duration={100} 
              delay={0} 
              className="text-white text-sm md:text-base font-geist font-medium uppercase tracking-[0.2em] leading-relaxed" 
            />
            <div className="space-y-2">
              <ScrollLetterRevealDelayed 
                text="INTERACT WITH ANNOTATIONS AND DRAG TO ROTATE." 
                duration={100} 
                delay={0.1} 
                className="text-white/40 text-[10px] md:text-xs font-geist uppercase tracking-[0.3em] font-medium block" 
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none origin-center p-2 mb-2">
          <img src={scrollSide} alt="scroll side" className="opacity-30 w-32" />
          <p className="font-geist text-[8px] md:text-[9px] text-white/10 uppercase tracking-[0.3em] whitespace-nowrap">
            MODEL // DINNER WITH CATS BY @EDIEDIEDI SKETCHFAB
          </p>
        </div>

        {/* Annotation Controls */}
        <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-3 pointer-events-auto">
          {ANNOTATIONS.map((ann) => (
            <button
              key={ann.id}
              onClick={() => handleAnnotationClick(ann)}
              className={`px-4 py-2 rounded-lg font-geist text-xs md:text-sm font-medium uppercase tracking-[0.2em] transition-all duration-300 ${
                activeAnnotation === ann.id
                  ? "bg-[#a600ff] text-white shadow-lg shadow-[#a600ff]/50"
                  : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20"
              }`}
            >
              {ann.title}
            </button>
          ))}
          <button
            onClick={resetCamera}
            className="px-4 py-2 rounded-lg font-geist text-xs md:text-sm font-medium uppercase tracking-[0.2em] transition-all duration-300 bg-white/10 text-white/60 hover:text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 mt-2"
          >
            Reset View
          </button>
        </div>

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
              position={position}
              scale={scale}
              rotation={islandRotation}
              annotations={ANNOTATIONS}
              activeAnnotation={activeAnnotation}
              onAnnotationClick={handleAnnotationClick}
              onResetView={resetCamera}
            />
          </Suspense>
        </Canvas>
      </section>
    </div>
  );
}