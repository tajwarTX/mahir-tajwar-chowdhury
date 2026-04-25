import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, PerspectiveCamera, Environment, ContactShadows, Bvh, Preload, PerformanceMonitor, AdaptiveDpr, AdaptiveEvents, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import KVRC from '../models/KVRC';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollLetterRevealDelayed from '../components/ScrollLetterRevealDelayed';
import scrolldown from '../assets/scrolldown.gif';

const ProjectLoader = ({ progress }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center pointer-events-none"
    >
      <div className="relative flex flex-col items-center">
        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-[#ff6b00]"
            initial={{ x: "-100%" }}
            animate={{ x: `${progress - 100}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          />
        </div>
        
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-4 flex flex-col items-center gap-1"
        >
          <span className="font-geist text-[8px] md:text-[10px] text-white/40 uppercase tracking-[0.5em]">
            INITIALIZING_MODULE_002
          </span>
          <span className="font-geist text-[8px] md:text-[10px] text-[#ff6b00]/60 uppercase tracking-[0.5em]">
            ARCHIVE_SYNC_IN_PROGRESS
          </span>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.05)_0%,transparent_70%)] opacity-50" />
    </motion.div>
  );
};

const TypingText = ({ text, delay = 0, speed = 30, className = "" }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, started, text, speed]);

  return <span className={className}>{displayedText}</span>;
};

const HackerTerminal = () => {
  const [stage, setStage] = useState(0); // 0: hacking, 1: revealed, 2: details, 3: exiting
  const [logs, setLogs] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sortBy, setSortBy] = useState('type');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  const projectData = {
    DRONE: [
      { id: 'D01', title: 'QUAD_X.EXE', desc: 'F450 based autonomous quadcopter.', tech: 'ArduPilot, Pixhawk', date: '2023-01-15', type: 'HARDWARE' },
      { id: 'D02', title: 'VTOL_PROTO.BIN', desc: 'Vertical take-off and landing fixed wing.', tech: 'PX4, Carbon Fiber', date: '2023-05-20', type: 'FLIGHT_OS' },
      { id: 'D03', title: 'SWARM_NET.SYS', desc: 'Mesh communication for multiple drones.', tech: 'ESP32, LoRa', date: '2023-08-10', type: 'NETWORK' }
    ],
    AUTONOMOUS: [
      { id: 'A01', title: 'ROVER_V4.EXE', desc: 'Outdoor GPS-based autonomous rover.', tech: 'ROS2, Python, GPS', date: '2022-11-05', type: 'ROBOTICS' },
      { id: 'A02', title: 'NAV_CORE.DLL', desc: 'Pathfinding algorithm for unknown terrain.', tech: 'C++, A-Star, SLAM', date: '2023-03-12', type: 'SOFTWARE' }
    ],
    OLYMPIAD: Array.from({ length: 12 }, (_, i) => ({
      id: `O${String(i + 1).padStart(2, '0')}`,
      title: `OLYMPIAD_PRJ_${i + 1}.SYS`,
      desc: 'Project developed for international robotics competition.',
      tech: 'C, AVR, Embedded Systems',
      date: `202${(i % 3) + 1}-0${(i % 9) + 1}-15`,
      type: 'COMPETITION'
    })),
    HOBBY: [
      { id: 'H01', title: 'LED_MATRIX.BIN', desc: '16x64 scrolling LED display wall.', tech: 'Arduino, WS2812B', date: '2021-06-30', type: 'VISUAL' },
      { id: 'H02', title: 'AUDIO_VIS.EXE', desc: 'Real-time music visualizer using FFT.', tech: 'Processing, Java', date: '2022-02-14', type: 'SOFTWARE' }
    ]
  };

  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      return 0;
    });
  };

  useEffect(() => {
    if (stage === 0) {
      const startSequence = [
        { text: "Folder PATH listing", delay: 50, color: "white" },
        { text: "Volume serial number is 000000B3 0A54:682B", delay: 100, color: "white" },
        { text: "C:.", delay: 150, color: "white" },
        { text: "├───PROJECTS", delay: 200, color: "white" },
        { text: "│   ├───DRONE", delay: 250, color: "white" },
        { text: "│   ├───AUTONOMOUS", delay: 300, color: "white" },
        { text: "│   ├───OLYMPIAD", delay: 350, color: "white" },
        { text: "│   └───HOBBY", delay: 400, color: "white" },
        { text: " ", delay: 450, color: "white" },
        { text: "C:\\> nmap -sS -T4 -O 10.0.0.42", delay: 500, color: "white" },
        { text: "Scanning ports... [OK]", delay: 600, color: "white" },
        { text: "C:\\> crunch 8 8 abcdef -o wordlist.txt", delay: 750, color: "white" },
        { text: "Generating wordlist... [OK]", delay: 900, color: "white" },
        { text: "C:\\> hydra -l root -P wordlist.txt ssh://vault.local", delay: 1050, color: "white" },
        { text: "[AUTHENTICATED] root/********", delay: 1350, color: "#a600ff" },
        { text: "C:\\> msfconsole -q", delay: 1500, color: "white" },
        { text: "exploit -j", delay: 1650, color: "white" },
        { text: "[*] Session opened", delay: 1800, color: "#a600ff" },
        { text: "C:\\> decrypt --vault", delay: 1950, color: "white" },
        { text: "Decrypting system blocks... 100%", delay: 2100, color: "#a600ff" },
        { text: "[AUTHENTICATED] ACCESS GRANTED", delay: 2250, color: "#a600ff" },
        { text: "C:\\> tree /A /F", delay: 2550, color: "white" }
      ];

      let currentDelay = 0;
      startSequence.forEach((item) => {
        setTimeout(() => setLogs(prev => [...prev, item]), item.delay);
        currentDelay = Math.max(currentDelay, item.delay);
      });

      setTimeout(() => setStage(1), currentDelay + 400);
    }
  }, [stage]);

  const handleExit = () => {
    setStage(3);
    setLogs([]);
    const exitSequence = [
      { text: ">>> EMERGENCY LOCKDOWN...", delay: 100, color: "#a600ff" },
      { text: ">>> SHUTTING DOWN CORE SYSTEMS...", delay: 300, color: "white" },
      { text: ">>> WIPING CACHE...", delay: 600, color: "white" },
      { text: ">>> OVERWRITING MEMORY SECTORS...", delay: 900, color: "white" },
      { text: ">>> RE-ENCRYPTING VAULT...", delay: 1200, color: "#a600ff" },
      { text: ">>> DESTROYING TRACES...", delay: 1500, color: "white" },
      { text: "[+] SECURE LOGOUT COMPLETE.", delay: 2000, color: "#a600ff" },
      { text: ">>> CONNECTION TERMINATED.", delay: 2500, color: "white" }
    ];

    exitSequence.forEach((item, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, item]);
        if (i === exitSequence.length - 1) {
          setTimeout(() => window.location.href = '/', 500);
        }
      }, item.delay);
    });
  };

  const renderProjectBox = (item) => (
    <div 
      key={item.id} 
      onClick={() => { setSelectedProject(item); setStage(2); }}
      className="aspect-square border border-white/20 p-3 flex flex-col hover:border-[#a600ff] hover:bg-[#a600ff]/10 cursor-pointer transition-colors duration-300 cursor-target group relative"
    >
      <div className="absolute top-0 right-0 w-2 h-2 bg-[#a600ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300 m-2" />
      
      <div className="flex justify-between items-center font-bold pb-2 text-[10px] tracking-widest">
        <span className="text-[#a600ff]">[{item.id}]</span>
        <span className="text-white/50 group-hover:text-white transition-colors duration-300">{item.type}</span>
      </div>
      
      {/* Full Color Square Thumbnail -> Negative on hover */}
      <div className="flex-1 relative border border-white/10 overflow-hidden mb-3 bg-black">
        <img 
          src={`https://picsum.photos/seed/${item.id}/400/400`} 
          alt="preview" 
          className="w-full h-full object-cover group-hover:invert transition-all duration-1000 ease-out relative z-10"
        />
        <div className="absolute inset-0 bg-[#a600ff] mix-blend-color opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-20 pointer-events-none" />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-white font-bold tracking-widest uppercase">{item.title}</span>
        <div className="flex justify-between items-end">
          <span className="text-white/40">{item.date}</span>
          <span className="text-white opacity-0 group-hover:opacity-100 font-bold tracking-widest hidden md:block transition-opacity duration-300">EXEC_></span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex items-center justify-center font-mono bg-black overflow-hidden relative z-[100] text-[10px]">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] z-[110] bg-[length:100%_4px]" />
      
      <div className="w-full h-full flex flex-col justify-center gap-6 relative z-[120]">
        {(stage === 0 || stage === 3) && (
          <div className="space-y-1 w-full max-w-4xl mx-auto px-4 overflow-y-auto max-h-[80vh] scrollbar-hide py-12">
            {logs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] md:text-xs leading-relaxed uppercase tracking-widest font-mono" 
                style={{ color: log.color }}
              >
                {log.text}
              </motion.div>
            ))}
            <motion.div 
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-white ml-1 align-middle"
            />
          </div>
        )}

        {stage === 1 && (
          <div className="flex flex-col h-full w-full py-8 text-white font-mono text-[10px] md:text-xs overflow-hidden">
            <div className="flex-none w-full max-w-7xl mx-auto px-4 md:px-8 mb-6">
              <div className="overflow-hidden whitespace-nowrap text-white/20">{"=".repeat(200)}</div>
              <div className="flex justify-between py-2 font-bold tracking-widest text-white/80">
                <span>|| PROJECT ARCHIVE DIRECTORY</span>
                <span>SYSTEM READY ||</span>
              </div>
              <div className="overflow-hidden whitespace-nowrap text-white/20">{"=".repeat(200)}</div>
            </div>

            <div className="flex-none w-full max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center mb-8 text-[#a600ff]">
              <button 
                onClick={() => setSortBy(prev => prev === 'name' ? 'date' : prev === 'date' ? 'type' : 'name')}
                className="w-40 md:w-48 text-center bg-transparent text-[#a600ff] px-6 py-2 cursor-target uppercase tracking-widest font-bold border border-[#a600ff] hover:bg-[#a600ff] hover:text-white hover:shadow-[0_0_15px_rgba(166,0,255,0.4)] transition-all duration-300"
              >
                [ SORT: {sortBy} ]
              </button>
              <button 
                onClick={handleExit}
                className="w-40 md:w-48 text-center bg-transparent text-[#a600ff] px-6 py-2 cursor-target uppercase tracking-widest font-bold border border-[#a600ff] hover:bg-[#a600ff] hover:text-white hover:shadow-[0_0_15px_rgba(166,0,255,0.4)] transition-all duration-300"
              >
                [ RETURN HOME ]
              </button>
            </div>

            <div 
              className="flex-1 overflow-y-auto w-full custom-scrollbar"
              onScroll={(e) => {
                if (e.target.scrollTop > 50) setHasScrolled(true);
              }}
            >
              <div className="w-full max-w-7xl mx-auto px-4 md:px-8 space-y-12">
                {sortBy === 'type' ? (
                Object.entries(projectData).map(([category, items]) => (
                  <div key={category}>
                    <div className="overflow-hidden whitespace-nowrap font-bold mb-6 text-white/20">
                      <span className="text-white/80">+--- {category}</span> {"-".repeat(200)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {sortItems(items).map(renderProjectBox)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {sortItems(Object.values(projectData).flat()).map(renderProjectBox)}
                </div>
              )}
              <div className="pb-16 opacity-50 space-y-1 text-white/20">
                 <div className="overflow-hidden whitespace-nowrap">{"=".repeat(200)}</div>
                 <div className="tracking-widest">EOF</div>
              </div>
              </div>
            </div>

            <AnimatePresence>
              {!hasScrolled && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-[130] flex flex-col items-center gap-2"
                >
                  <img src={scrolldown} alt="scroll down" className="w-12 opacity-50" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {stage === 2 && selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full w-full py-8 text-white font-mono text-[10px] md:text-xs overflow-hidden"
          >
            <div className="flex-none w-full max-w-7xl mx-auto px-4 md:px-8 mb-6">
              <div className="overflow-hidden whitespace-nowrap text-white/20">{"=".repeat(200)}</div>
              <div className="flex justify-between py-2 font-bold tracking-widest text-white/80 uppercase">
                <span>|| PROJECT_DETAILS: {selectedProject.title}</span>
                <span className="hidden md:inline">DATASTREAM SECURE ||</span>
              </div>
              <div className="overflow-hidden whitespace-nowrap text-white/20">{"=".repeat(200)}</div>
            </div>

            <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
              <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-12 pb-16">
              
              <div className="w-full md:w-1/3 flex flex-col space-y-8 min-w-0">
                <div className="border border-[#a600ff]/30 p-2 relative group cursor-target bg-black">
                  <div className="absolute top-0 right-0 w-2 h-2 bg-[#a600ff] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 m-2 z-10" />
                  <div className="aspect-square relative overflow-hidden bg-black">
                    <img 
                      src={`https://picsum.photos/seed/${selectedProject.id}/800/800`} 
                      className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:invert relative z-10" 
                      alt="detail" 
                    />
                    <div className="absolute inset-0 bg-[#a600ff] mix-blend-color opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-20 pointer-events-none" />
                  </div>
                </div>
                
                <div className="space-y-4 text-white/80 font-bold tracking-widest uppercase">
                  <div className="overflow-hidden whitespace-nowrap text-white/20 mb-2">{"-".repeat(100)}</div>
                  <div className="flex justify-between items-center">
                    <span>ID_HASH:</span><span className="text-[#a600ff]">[{selectedProject.id}]</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>SECTOR:</span><span className="text-[#a600ff]">{selectedProject.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>COMPILED:</span><span className="text-[#a600ff]">{selectedProject.date}</span>
                  </div>
                  <div className="overflow-hidden whitespace-nowrap text-white/20 mt-2">{"-".repeat(100)}</div>
                </div>
              </div>

              <div className="flex-1 space-y-12 flex flex-col mt-4 md:mt-0 min-w-0">
                <div className="space-y-6">
                  <div className="text-white/80 font-bold tracking-widest uppercase overflow-hidden whitespace-nowrap">
                    +--- ABSTRACT_DUMP <span className="text-white/20">{"-".repeat(100)}</span>
                  </div>
                  <p className="text-white/70 leading-relaxed pl-6 border-l-2 border-white/20 text-xs md:text-sm">
                    {selectedProject.desc}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="text-white/80 font-bold tracking-widest uppercase overflow-hidden whitespace-nowrap">
                    +--- HARDWARE_CORE <span className="text-white/20">{"-".repeat(100)}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 pl-6">
                    {selectedProject.tech.split(',').map((t, i) => (
                      <span key={i} className="text-[#a600ff] uppercase tracking-widest bg-white/5 px-4 py-2 border border-white/10">
                        [{t.trim()}]
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-16 flex flex-col sm:flex-row gap-6 text-[#a600ff]">
                  <button 
                    onClick={() => setStage(1)} 
                    className="flex-1 hover:bg-[#a600ff] hover:text-white px-6 py-4 cursor-target uppercase tracking-widest font-bold border border-[#a600ff] transition-colors duration-300"
                  >
                    [ RETURN_TO_ARCHIVE ]
                  </button>
                </div>
              </div>

              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const Scene = React.memo(({ setIsLocked }) => {
  const scroll = useScroll();
  const groupRef = useRef();
  const innerGroupRef = useRef();

  // Starting Values
  const startX = -0.8;
  const startY = 0.05;
  const startZ = 1.30;
  const startYPos = 1.6;
  const startZPos = -2.8;
  const startXPos = 1.2;

  // Final Target Values
  const endX = -0.17;
  const endY = -1.9;
  const endZ = 9;
  const endXRot = 0.22;
  const endYRot = 0.46;
  const endZRot = 0.35;
  const endScale = 1;

  const floatSpeed = 1.8;
  const floatRotation = 1.4;
  const floatIntensity = 0.0;

  useFrame((state) => {
    const progress = scroll.offset;
    const t = state.clock.getElapsedTime();
    const fFactor = 1 - progress;

    if (progress > 0.99) {
      setIsLocked(true);
    }

    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(startX, endXRot, progress);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(startY, endYRot, progress);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(startZ, endZRot, progress);
      groupRef.current.scale.setScalar(0.35 + progress * (endScale - 0.35));
      groupRef.current.position.x = THREE.MathUtils.lerp(startXPos, endX, progress);
      groupRef.current.position.y = THREE.MathUtils.lerp(startYPos, endY, progress);
      groupRef.current.position.z = THREE.MathUtils.lerp(startZPos, endZ, progress);
    }

    if (innerGroupRef.current) {
      innerGroupRef.current.position.y = Math.sin(t * floatSpeed) * 0.1 * floatIntensity * fFactor;
      innerGroupRef.current.rotation.z = Math.cos(t * floatSpeed * 0.5) * 0.05 * floatRotation * fFactor;
      innerGroupRef.current.rotation.x = Math.sin(t * floatSpeed * 0.5) * 0.05 * floatRotation * fFactor;
    }
  });

  return (
    <Bvh firstHitOnly>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 5, 5]} intensity={8} color="#ffffff" />
      <group ref={groupRef}>
        <pointLight position={[-2.2, 4.3, 3.3]} intensity={10.2} distance={15.4} decay={2} color="#ffffff" />
        <group ref={innerGroupRef}>
          <KVRC />
        </group>
      </group>
      <ContactShadows position={[0, -4.5, 0]} opacity={0.6} scale={20} blur={2.5} far={4.5} resolution={256} frames={1} />
    </Bvh>
  );
});

const Projects = () => {
  const [dpr, setDpr] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const { progress, active } = useProgress();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!active && progress === 100) {
      const timer = setTimeout(() => setIsReady(true), 500);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLocked]);

  return (
    <div className="w-full h-screen bg-transparent overflow-hidden relative">
      {/* Blackout Overlay */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            key="blackout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            onAnimationComplete={() => setIsUnmounted(true)}
            className="fixed inset-0 z-[5000] bg-black flex items-center justify-center"
          >
            <HackerTerminal />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Scene - Only unmount after blackout is complete */}
      {!isUnmounted && (
        <div className="w-full h-screen relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.02)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="max-w-[1400px] w-full px-6 md:px-24 flex flex-col items-center">
              <div className="mb-6 flex items-center gap-4 opacity-40">
                <span className="font-geist text-[9px] md:text-[10px] text-white uppercase tracking-[0.5em] font-bold">
                  ARCHIVE // MODULE_002
                </span>
              </div>
              <h1 className="font-orbitron text-[45px] md:text-[85px] lg:text-[120px] font-extrabold text-white uppercase leading-none tracking-tighter text-center">
                PROJECTS
              </h1>

              <div className="mt-8 flex flex-col items-center gap-6">
                <div className="h-[1px] w-24 bg-[#ff6b00]" />
                <p className="font-geist text-white/70 text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-medium leading-relaxed max-w-lg text-center">
                  A CINEMATIC SHOWCASE OF INNOVATIVE DIGITAL EXPERIENCES, 
                  3D SYSTEMS, AND ENGINEERING PROTOTYPES.
                </p>
              </div>
            </div>
          </div>

          <Canvas 
            shadows={false} 
            dpr={dpr}
            performance={{ min: 0.5 }}
            gl={{ antialias: false, powerPreference: "high-performance", stencil: false, depth: true, alpha: true, desynchronized: true }}
            className="relative z-10"
            onCreated={(state) => state.gl.compile(state.scene, state.camera)}
          >
            <PerformanceMonitor onFallback={() => setDpr(1)} onIncline={() => setDpr(2)} />
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
            <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
            <Suspense fallback={null}>
              <ScrollControls pages={1.3} damping={0} infinite={false}>
                <Scene setIsLocked={setIsLocked} />
              </ScrollControls>
              <Preload all />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
};

export default Projects;