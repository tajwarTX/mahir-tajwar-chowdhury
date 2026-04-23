import React, { useRef, Suspense, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import IntroBlock from "../components/IntroBlock";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PerformanceMonitor, AdaptiveDpr, AdaptiveEvents, Bvh, Preload, Float } from "@react-three/drei";
import Island from "../models/Island";
import CameraController from "../components/CameraController";
import scrollDown from "../assets/scrolldown.gif";
import scrollSide from "../assets/scrollside.gif";
import ScrollLetterRevealDelayed from "../components/ScrollLetterRevealDelayed";

const BASE_POSITION = { x: -2, y: -0, z: -63 };
const MOBILE_POSITION = { x: -2, y: 24, z: -60 };
const BASE_ROTATION_DEG = { x: -8, y: 124, z: 0 };
const degToRad = (deg) => (deg * Math.PI) / 180;

const MODEL_CENTER = [BASE_POSITION.x, BASE_POSITION.y, BASE_POSITION.z];

const ANNOTATIONS = [
  {
    id: 1,
    localPosition: [-67.22, -5.74, -19.56],
    title: "The Stranded Pilot",
    description:
      "Having crashed in this remote forest, the pilot has found a strange peace among the voxel trees. They now spend their evenings sharing stories and meals with the curious forest dwellers.",
    modelRotationY: degToRad(210),
    camera: {
      position: [-10.46, -29.06, -142.89],
    },
  },
  {
    id: 2,
    localPosition: [35.47, 46.5, -66.73],
    markerScale: 1.5,
    title: "Dinner Table",
    description:
      "The heart of the scene — a cozy dinner setup where the traveler shares a meal with friendly forest cats. Warm light spills from lanterns, creating an intimate atmosphere amid the wilderness.",
    modelRotationY: degToRad(180),
    camera: {
      position: [-59.59, 51.2, -127.2],
    },
  },
  {
    id: 3,
    localPosition: [-59.52, -28.19, 26.29],
    title: "The Forest Cats",
    description:
      "Curious cats have gathered around the campsite, drawn by the warmth and food. These forest dwellers have made friends with the stranded traveler, keeping them company through the night.",
    modelRotationY: degToRad(100),
    camera: {
      position: [-4.29, -26.91, 29.85],
    },
  },
  {
    id: 4,
    localPosition: [23.41, -28.62, 64.61],
    title: "The Treetops",
    description:
      "Towering voxel trees create a canopy overhead, their pixelated leaves filtering moonlight into the clearing below. The forest seems to close in protectively around the small campsite.",
    modelRotationY: degToRad(210),
    camera: {
      position: [35.89, -15.24, 36.67],
    },
  },
  {
    id: 5,
    localPosition: [-1.4, -5.88, -7.84],
    markerScale: 1.15,
    title: "Full Diorama",
    description:
      "The complete scene: a voxel masterpiece depicting a stranded pilot finding unexpected companionship. Made with MagicaVoxel and Blender by @ediediedi for the 'Robots are Coming' challenge.",
    modelRotationY: degToRad(145),
    camera: {
      position: [44.79, 8.34, -54.95],
    },
  },
  {
    id: 6,
    localPosition: [-38.87, -29.31, 67.93],
    title: "The Hidden Signal",
    description:
      "A rhythmic signal pulses from the dense overgrowth. It appears to be an automated distress beacon, long forgotten but still operational in the digital wilderness.",
    modelRotationY: degToRad(45),
    camera: {
      position: [28.74, -25.4, 56.71],
    },
  },
];

const InfiniteScrollText = React.memo(() => {
  const text = "ROBOTICS • CREATIVE DEVELOPER • 3D DESIGNING • CINEMATIC • ";
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const fontSize = 200;
      ctx.font = `800 ${fontSize}px "Orbitron", sans-serif`;

      const metrics = ctx.measureText(text);
      const textWidth = metrics.width;

      canvas.width = textWidth;
      canvas.height = fontSize * 1.5;

      ctx.font = `800 ${fontSize}px "Orbitron", sans-serif`;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.strokeText(text, 0, canvas.height / 2);

      if (containerRef.current) {
        containerRef.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
        containerRef.current.style.backgroundRepeat = 'repeat-x';
        containerRef.current.style.backgroundSize = `${textWidth}px auto`;

        containerRef.current.style.width = `${textWidth * 2}px`;
      }
    };

    if (document.fonts) {

      document.fonts.load('800 200px Orbitron').then(initCanvas).catch(initCanvas);
    } else {
      setTimeout(initCanvas, 500);
    }
  }, []);

  return (
    <div className="absolute left-0 top-[55%] md:top-[45%] w-full h-[150px] md:h-[300px] overflow-hidden pointer-events-none z-0 select-none">
      <canvas ref={canvasRef} className="hidden" />
      <div
        ref={containerRef}
        className="marquee-optimized h-full flex transform-gpu"
      />
      <style>{`
        .marquee-optimized {
          animation: scrollCanvas 30s linear infinite;
          will-change: transform;
        }
        @keyframes scrollCanvas {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  );
});

function useDragRotation(targetRef, rotateSpeed = 0.005, isLocked = false) {
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);

  const onStart = (clientX) => {
    if (isLocked) return;
    draggingRef.current = true;
    lastXRef.current = clientX;
  };

  const onMove = (clientX) => {
    if (isLocked || !draggingRef.current || !targetRef.current) return;
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
  }, [isLocked]);
}

export default function Home() {
  const islandRef = useRef(null);
  const cameraRef = useRef(null);
  const introRef = useRef(null);
  const canvasSectionRef = useRef(null);

  const [showArrowScroll, setShowArrowScroll] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  const [scale, setScale] = useState([1, 1, 1]);

  const [dpr, setDpr] = useState(1.5);
  const [position, setPosition] = useState([
    BASE_POSITION.x,
    BASE_POSITION.y,
    BASE_POSITION.z,
  ]);

  const handleAnnotationClick = useCallback((annotation) => {
    setActiveAnnotation(annotation.id);

    setTimeout(() => setShowInfoPanel(true), 600);
  }, []);

  const resetCamera = useCallback(() => {
    setShowInfoPanel(false);
    setTimeout(() => setActiveAnnotation(null), 300);
  }, []);

  const goToAnnotation = useCallback(
    (direction) => {
      const currentIdx = ANNOTATIONS.findIndex(
        (a) => a.id === activeAnnotation
      );
      let nextIdx;
      if (direction === "next") {
        nextIdx = (currentIdx + 1) % ANNOTATIONS.length;
      } else {
        nextIdx =
          (currentIdx - 1 + ANNOTATIONS.length) % ANNOTATIONS.length;
      }
      setShowInfoPanel(false);
      setTimeout(() => {
        setActiveAnnotation(ANNOTATIONS[nextIdx].id);
        setTimeout(() => setShowInfoPanel(true), 600);
      }, 200);
    },
    [activeAnnotation]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeAnnotation !== null) {
        if (e.key === "Escape") resetCamera();
        if (e.key === "ArrowRight" || e.key === "ArrowDown")
          goToAnnotation("next");
        if (e.key === "ArrowLeft" || e.key === "ArrowUp")
          goToAnnotation("prev");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeAnnotation, resetCamera, goToAnnotation]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setScale([0.45, 0.45, 0.45]);
        setPosition([
          MOBILE_POSITION.x,
          MOBILE_POSITION.y + 2,
          MOBILE_POSITION.z,
        ]);
      } else {
        setScale([1, 1, 1]);
        setPosition([BASE_POSITION.x, BASE_POSITION.y, BASE_POSITION.z]);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useDragRotation(islandRef, 0.007, activeAnnotation !== null);

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

  const activeAnn = ANNOTATIONS.find((a) => a.id === activeAnnotation);

  return (
    <div className="w-full relative h-screen overflow-y-auto snap-y snap-mandatory">
      <section
        ref={introRef}
        className="relative w-full h-screen flex justify-start items-center flex-col pt-[28vh] md:pt-[32vh] snap-start snap-always"
      >
        <div
          className="absolute text-white text-xs font-light leading-none z-50 pointer-events-none"
          style={{
            top: "19px",
            left: "160px",
          }}
        >
          <ScrollLetterRevealDelayed
            text="@mahir_tajwar_chowdhury"
            duration={500}
            delay={500}
            className="block"
          />
          <ScrollLetterRevealDelayed
            text="Personal Portfolio Website"
            duration={500}
            delay={500}
            className="block"
          />
          <ScrollLetterRevealDelayed
            text="2025-2026"
            duration={500}
            delay={500}
            className="block"
          />
        </div>

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

      <section className="relative w-full h-screen flex items-center justify-center px-6 md:px-24 py-16 md:py-20 z-10 snap-start snap-always">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl items-center gap-12">
          <div className="flex flex-col">
            <h2 className="text-[52px] md:text-[100px] lg:text-[130px] font-orbitron font-extrabold leading-[0.85] text-white uppercase tracking-tighter">
              <ScrollLetterRevealDelayed text="THE" duration={200} delay={0} />
              <br />
              <span className="text-[#a600ff]">
                <ScrollLetterRevealDelayed
                  text="IDENTITY"
                  duration={200}
                  delay={0.1}
                />
              </span>
            </h2>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-[1px] w-10 bg-[#a600ff]" />
              <span className="font-geist text-[9px] md:text-[11px] text-white/40 uppercase tracking-[0.4em] font-medium">
                ARCHIVE_001
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
                <span className="text-[#a600ff] text-2xl md:text-3xl font-orbitron font-bold">
                  (01)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={canvasSectionRef}
        className="relative w-full overflow-hidden flex items-center h-screen snap-start snap-always"
      >
        <div className="absolute left-6 md:left-24 max-w-lg z-20 top-1/2 -translate-y-[150%] md:-translate-y-[140%] flex flex-col space-y-4">
          <div className="flex flex-col gap-1">
            <ScrollLetterRevealDelayed
              text="OPEN_WORLD_MODULE"
              duration={100}
              delay={0}
              className="text-[#a600ff] font-geist text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-bold"
            />
            <h3 className="text-white text-3xl md:text-5xl font-orbitron font-black uppercase tracking-tighter leading-none border-none outline-none">
              <ScrollLetterRevealDelayed
                text="EXPLORE THE "
                duration={200}
                delay={0.1}
              />
              <span className="text-[#a600ff]">
                <ScrollLetterRevealDelayed
                  text="MATRIX"
                  duration={200}
                  delay={0.2}
                />
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
                text="CLICK ANNOTATIONS TO EXPLORE • DRAG TO ROTATE"
                duration={100}
                delay={0.1}
                className="text-white/40 text-[10px] md:text-xs font-geist uppercase tracking-[0.3em] font-medium block"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none origin-center p-2 mb-2">
          <img
            src={scrollSide}
            alt="scroll side"
            className="opacity-30 w-32"
          />
          <p className="font-geist text-[8px] md:text-[9px] text-white/10 uppercase tracking-[0.3em] whitespace-nowrap">
            MODEL
          </p>
        </div>

        <div className="annotation-nav-sidebar">
          {ANNOTATIONS.map((ann) => (
            <button
              key={ann.id}
              onClick={() => handleAnnotationClick(ann)}
              className={`annotation-nav-btn cursor-target group ${activeAnnotation === ann.id ? "active" : ""
                }`}
              title={ann.title}
            >
              <span className="annotation-nav-number">{ann.id}</span>
              <span className="annotation-nav-title">
                {ann.title.split('').map((char, index, array) => (
                  <span
                    key={index}
                    style={{
                      transitionDelay: `${(array.length - 1 - index) * 0.03}s`,
                      display: 'inline-block'
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
            </button>
          ))}
          {activeAnnotation !== null && (
            <button
              onClick={resetCamera}
              className="annotation-nav-btn reset-btn cursor-target"
              title="Reset View"
            >
              <span className="annotation-nav-number">✕</span>
              <span className="annotation-nav-title">
                {"Reset View".split('').map((char, index, array) => (
                  <span
                    key={index}
                    style={{
                      transitionDelay: `${(array.length - 1 - index) * 0.03}s`,
                      display: 'inline-block'
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
            </button>
          )}
        </div>

        {activeAnn && (
          <div
            className={`annotation-info-panel ${showInfoPanel ? "visible" : ""
              }`}
          >
            <div className="annotation-info-header">
              <div className="annotation-info-badge">{activeAnn.id} / {ANNOTATIONS.length}</div>
              <button
                onClick={resetCamera}
                className="annotation-info-close cursor-target"
              >
                ✕
              </button>
            </div>
            <h3 className="annotation-info-title">{activeAnn.title}</h3>
            <p className="annotation-info-desc">{activeAnn.description}</p>
            <div className="annotation-info-nav">
              <button
                onClick={() => goToAnnotation("prev")}
                className="annotation-info-nav-btn arrow-btn cursor-target"
                title="Previous"
              >
                ←
              </button>
              <button
                onClick={() => navigate("/projects")}
                className="annotation-info-nav-btn learn-more-btn cursor-target"
              >
                Learn More
              </button>
              <button
                onClick={() => goToAnnotation("next")}
                className="annotation-info-nav-btn arrow-btn cursor-target"
                title="Next"
              >
                →
              </button>
            </div>
          </div>
        )}

        <InfiniteScrollText />

        <Canvas
          ref={cameraRef}
          dpr={[1, dpr]}
          gl={{
            antialias: false,
            powerPreference: "high-performance",
            alpha: true,
            stencil: false,
            depth: true,
            precision: "mediump"
          }}
          camera={{ position: [0, 0, 50], near: 0.1, far: 2000 }}
        >
          <PerformanceMonitor onFallback={() => setDpr(1)} />
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <ambientLight intensity={2} />
          <directionalLight position={[1, 10, 1]} intensity={2} />

          <Suspense fallback={null}>
            <Bvh firstHitOnly>
              <CameraController
                activeAnnotation={activeAnnotation}
                annotations={ANNOTATIONS}
                islandRef={islandRef}
                defaultCameraPosition={[0, 0, 50]}
              />
              <Float
                speed={2} 
                rotationIntensity={0.5} 
                floatIntensity={0.5} 
                floatingRange={[0, 1.5]} 
              >
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
                />
              </Float>
            </Bvh>
            <Preload all />
          </Suspense>
        </Canvas>
      </section>
    </div>
  );
}