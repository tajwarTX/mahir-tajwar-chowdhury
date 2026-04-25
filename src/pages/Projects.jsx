import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, PerspectiveCamera, Environment, ContactShadows, Bvh, Preload, PerformanceMonitor, AdaptiveDpr, AdaptiveEvents, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import KVRC from '../models/KVRC';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollLetterRevealDelayed from '../components/ScrollLetterRevealDelayed';

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
  const [sortBy, setSortBy] = useState('name');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
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
        { text: "C:\\> nmap -sS -T4 -O 10.0.0.42", delay: 10, color: "white" },
        { text: "Scanning ports... [OK]", delay: 50, color: "white" },
        { text: "C:\\> crunch 8 8 abcdef -o wordlist.txt", delay: 100, color: "white" },
        { text: "Generating wordlist... [OK]", delay: 150, color: "white" },
        { text: "C:\\> hydra -l root -P wordlist.txt ssh://vault.local", delay: 200, color: "white" },
        { text: "[AUTHENTICATED] root/********", delay: 300, color: "#a600ff" },
        { text: "C:\\> msfconsole -q", delay: 350, color: "white" },
        { text: "exploit -j", delay: 400, color: "white" },
        { text: "[*] Session opened", delay: 450, color: "#a600ff" },
        { text: "C:\\> decrypt --vault", delay: 500, color: "white" },
        { text: "Decrypting system blocks... 100%", delay: 550, color: "#a600ff" },
        { text: "[AUTHENTICATED] ACCESS GRANTED", delay: 600, color: "#a600ff" },
        { text: "C:\\> tree /A /F", delay: 700, color: "white" }
      ];

      let currentDelay = 0;
      startSequence.forEach((item) => {
        setTimeout(() => setLogs(prev => [...prev, item]), item.delay);
        currentDelay = Math.max(currentDelay, item.delay);
      });

      setTimeout(() => setStage(1), currentDelay + 200);
    }
  }, [stage]);

  const handleExit = () => {
    setStage(3);
    setLogs([]);
    const exitSequence = [
      { text: ">>> EMERGENCY LOCKDOWN...", delay: 100, color: "#a600ff" },
      { text: ">>> WIPING CACHE...", delay: 400, color: "white" },
      { text: ">>> RE-ENCRYPTING VAULT...", delay: 800, color: "#a600ff" },
      { text: "[+] SECURE LOGOUT COMPLETE.", delay: 1500, color: "#a600ff" },
      { text: ">>> TERMINATING SESSION.", delay: 2000, color: "white" }
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

  return (
    <div className="w-full h-full flex items-center justify-center font-mono bg-black overflow-hidden relative z-[100] text-[10px]">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] z-[110] bg-[length:100%_4px]" />
      
      <div className="w-full max-w-7xl h-full flex flex-col justify-center gap-6 relative z-[120]">
        {(stage === 0 || stage === 3) && (
          <div className="space-y-1 w-full max-w-4xl mx-auto overflow-y-auto max-h-[80vh] scrollbar-hide py-12">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full w-full px-8 py-12">
            {/* Header - Navigation & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-8 mb-10 gap-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl md:text-4xl text-white font-black uppercase font-orbitron tracking-widest leading-none">Project_Archive</h2>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                {/* Unified Sort Control */}
                <div 
                  className="relative flex-1 md:flex-none group cursor-pointer cursor-target"
                  onMouseEnter={() => setIsSortOpen(true)}
                  onMouseLeave={() => setIsSortOpen(false)}
                >
                  <div className="px-12 py-3.5 bg-white text-black text-sm font-black uppercase tracking-[0.4em] flex items-center justify-between gap-6 transition-all hover:bg-[#a600ff] hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <span className="font-mono">SORT: {sortBy.toUpperCase()}</span>
                    <span className="text-[10px] opacity-40">▼</span>
                  </div>
                  
                  <AnimatePresence>
                    {isSortOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-black border border-[#a600ff]/30 py-2 z-[200] shadow-[0_10px_40px_rgba(0,0,0,0.9)]"
                      >
                        {['name', 'date', 'type'].map(option => (
                          <button 
                            key={option}
                            onClick={() => setSortBy(option)}
                            className={`w-full text-left px-8 py-2.5 text-[11px] uppercase tracking-[0.3em] hover:bg-[#a600ff]/10 transition-colors font-mono ${sortBy === option ? 'text-[#a600ff] font-black' : 'text-white/50'}`}
                          >
                            {option}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Unified Return Button */}
                <button 
                  onClick={handleExit}
                  className="flex-1 md:flex-none px-12 py-3.5 bg-white text-black text-sm font-black uppercase tracking-[0.4em] hover:bg-[#a600ff] hover:text-white transition-all active:scale-95 font-mono shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-target"
                >
                  RETURN_HOME
                </button>
              </div>
>
            </div>

            <div className="flex-1 overflow-y-auto pr-6 space-y-16 custom-scrollbar pb-16">
              {Object.entries(projectData).map(([category, items]) => (
                <div key={category} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <h3 className="text-[#a600ff] font-black tracking-[0.5em] uppercase text-xs font-mono">{category}</h3>
                    <div className="flex-1 h-[1px] bg-white/10" />
                    <span className="text-white/30 text-[10px] font-mono font-bold tracking-widest">{items.length} UNITS_DETECTED</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sortItems(items).map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -5, borderColor: '#a600ff', backgroundColor: 'rgba(166, 0, 255, 0.03)' }}
                        onClick={() => { setSelectedProject(item); setStage(2); }}
                        className="aspect-square border border-white/15 bg-white/[0.03] p-6 flex flex-col justify-between group cursor-pointer transition-all duration-150 relative overflow-hidden shadow-2xl cursor-target"
                      >
                        <div className="absolute top-0 right-0 p-2">
                          <div className="w-1.5 h-1.5 bg-[#a600ff] rounded-full animate-pulse opacity-20 group-hover:opacity-100 transition-opacity" />
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-white/30 font-bold tracking-tighter font-mono group-hover:text-[#a600ff]/60 transition-colors">#{item.id}</span>
                            <div className="h-[1px] w-4 bg-white/10 group-hover:bg-[#a600ff]/30 transition-all" />
                          </div>
                          <span className="text-sm md:text-base text-white font-black leading-snug uppercase group-hover:text-[#a600ff] transition-colors font-mono tracking-tight">{item.title}</span>
                        </div>

                        <div className="space-y-4">
                          <div className="h-[2px] w-0 bg-[#a600ff]/40 group-hover:w-full transition-all duration-300 ease-out" />
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-white/20 group-hover:text-white/60 transition-colors uppercase font-mono tracking-widest">ACCESS_FILE</span>
                            <span className="text-[10px] text-[#a600ff] font-black opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all font-mono">>></span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {stage === 2 && selectedProject && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mx-auto font-mono bg-black/80 border-2 border-white/10 p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative"
          >
            <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.5em] text-white/40">Sector_Access_Verified</span>
              </div>
              <span className="text-[10px] text-green-500/60 font-bold uppercase tracking-[0.3em]">Module_0x{selectedProject.id}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-16">
              <div className="w-full lg:w-1/3 space-y-8">
                <div className="aspect-square bg-green-500/5 border border-green-500/20 relative group overflow-hidden flex items-center justify-center cursor-target">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,0,0.03)_2px,rgba(0,255,0,0.03)_4px)]" />
                  <span className="text-[9px] text-green-500/20 uppercase tracking-[1em] rotate-90 font-black">Visual_Data_Locked</span>
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500/40" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500/40" />
                </div>

                <div className="space-y-3 opacity-60">
                  <div className="flex justify-between text-[9px] uppercase tracking-widest text-white/30 border-b border-white/5 pb-2">
                    <span>Checksum</span>
                    <span className="text-white/60">0x7F2B{selectedProject.id}</span>
                  </div>
                  <div className="flex justify-between text-[9px] uppercase tracking-widest text-white/30 border-b border-white/5 pb-2">
                    <span>Type</span>
                    <span className="text-white/60">{selectedProject.type}</span>
                  </div>
                  <div className="flex justify-between text-[9px] uppercase tracking-widest text-white/30 border-b border-white/5 pb-2">
                    <span>Released</span>
                    <span className="text-white/60">{selectedProject.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-12">
                <div className="space-y-4">
                  <div className="text-[10px] text-green-500 font-black tracking-[0.4em] uppercase">>>_File_Title</div>
                  <h3 className="text-4xl md:text-6xl text-white font-black tracking-tighter uppercase leading-none">{selectedProject.title}</h3>
                </div>

                <div className="space-y-10">
                  <div className="space-y-4">
                    <span className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-bold">Abstract_Dump</span>
                    <p className="text-white/70 text-sm md:text-base leading-relaxed font-mono border-l-2 border-green-500/20 pl-6">{selectedProject.desc}</p>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-bold">Hardware_Core</span>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.tech.split(',').map((t, i) => (
                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-xs text-green-500 font-bold uppercase tracking-wider">{t.trim()}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-12 flex flex-col sm:flex-row gap-6">
                  <button 
                    onClick={() => setStage(1)} 
                    className="px-12 py-4 border-2 border-white/10 text-xs font-black text-white uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all font-mono cursor-target flex-1 text-center"
                  >
                    Close_Session
                  </button>
                  <button className="px-12 py-4 bg-green-500 text-black text-xs font-black uppercase tracking-[0.4em] hover:bg-green-400 transition-all font-mono cursor-target flex-1 text-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    Execute_Binary
                  </button>
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
  const { progress } = useProgress();
  const [isReady, setIsReady] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setIsReady(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [progress]);

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
      <AnimatePresence>
        {!isReady && <ProjectLoader progress={progress} />}
      </AnimatePresence>

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
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isReady ? 1 : 0 }}
          transition={{ duration: 1.5 }}
          className="w-full h-screen relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.02)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="max-w-[1400px] w-full px-6 md:px-24 flex flex-col items-center">
              <div className="mb-6 flex items-center gap-4 opacity-40">
                <span className="font-geist text-[9px] md:text-[10px] text-white uppercase tracking-[0.5em] font-bold">
                  ARCHIVE // MODULE_002
                </span>
              </div>
              <h1 className="font-orbitron text-[45px] md:text-[85px] lg:text-[120px] font-extrabold text-white uppercase leading-none tracking-tighter text-center">
                <ScrollLetterRevealDelayed text="PROJECTS" duration={800} delay={200} />
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
        </motion.div>
      )}
    </div>
  );
};

export default Projects;