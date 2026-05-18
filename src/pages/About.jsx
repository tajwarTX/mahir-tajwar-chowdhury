/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, memo, lazy, Suspense, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useInView } from 'framer-motion';
import profileImg from "../assets/photo/profile.jpg";
import cadetImg from "../assets/photo/Cadet Photo.jpg";
import avatarImg from "../assets/photo/Face.png";

// Import all images from pics folder
import pic1 from "../assets/gallery/Bangladesh Robot Olympiad 2020.jpg";
import pic2 from "../assets/gallery/Bangladesh Robot Olympiad 2021.JPG";
import pic3 from "../assets/gallery/Bangladesh Robot Olympiad 2022.JPG";
import pic4 from "../assets/gallery/FPV Drone Simulation IRO 2022.JPG";
import pic5 from "../assets/gallery/Flying FPV Drone.JPG";
import pic6 from "../assets/gallery/International Robot Olympiad 2021 (1).JPG";
import pic7 from "../assets/gallery/International Robot Olympiad 2021 (2).jpg";
import pic8 from "../assets/gallery/International Robot Olympiad 2021.JPG";
import pic9 from "../assets/gallery/International Robot Olympiad 2022.jpg";
import pic10 from "../assets/gallery/International Robot Olympiad 2023 (1).jpg";
import pic11 from "../assets/gallery/International Robot Olympiad 2023 (2).jpg";
import pic12 from "../assets/gallery/International Robot Olympiad 2023.JPG";
import pic13 from "../assets/gallery/World Robot Olympiad 2023 (1).JPG";
import pic14 from "../assets/gallery/World Robot Olympiad 2023 (2).JPG";
import pic15 from "../assets/gallery/World Robot Olympiad 2023.JPG";
import pic16 from "../assets/gallery/World Robot Olympiad 2025.jpg";

// Lazy-load the heavy 3D slider to keep initial About page JS lightweight
const ModelSlider = lazy(() => import('../components/ModelSlider'));

// ─── Achievement Counter Component ─────────────────────────────────────────
const AchievementItem = ({ value, suffix = "", label, sublabel }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
      }}
      onViewportEnter={() => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        let start = 0;
        const end = parseInt(value);
        if (start === end) return;
        let totalMiliseconds = 1500;
        let incrementTime = totalMiliseconds / end;
        let timer = setInterval(() => {
          start += 1;
          setCount(start);
          if (start === end) clearInterval(timer);
        }, incrementTime);
      }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center p-6"
    >
      <div className="flex items-baseline gap-1">
        <span className="font-orbitron text-5xl md:text-7xl font-black text-white tabular-nums tracking-tighter">
          {count < 10 ? `0${count}` : count}{suffix}
        </span>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <span className="font-orbitron text-[10px] md:text-xs text-[#a600ff] uppercase tracking-[0.3em] font-bold">
          {label}
        </span>
        <span className="font-geist text-[9px] md:text-[10px] text-white/40 uppercase tracking-widest mt-1">
          {sublabel}
        </span>
      </div>
    </motion.div>
  );
};

// ─── Lazy YouTube Component (Observer-based loading) ──────────────────────
const LazyYouTube = memo(({ src, title }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(166,0,255,0.05)] relative group">
      {isVisible ? (
        <iframe
          className="absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          src={src}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-white/5" />
      )}
    </div>
  );
});

const TechBadge = memo(({ name, icon, color }) => {
  // Use Simple Icons for tech/engineering logos that Icons8 lacks
  const isSimpleIcon = [
    'kicad', 'mathworks', 'davinciresolve', 'ros', 'solidworks', 'altium', 'altiumdesigner', 'stmicroelectronics', 'c',
    'autodesk', 'dassaultsystemes', 'opencv', 'raspberrypi', 'gazebo', 'nvidia'
  ].includes(icon);
  const iconUrl = isSimpleIcon
    ? `https://cdn.simpleicons.org/${icon}/${color || 'white'}`
    : `https://img.icons8.com/color/48/${icon}.png`;

  return (
    <div className="cursor-target flex items-center gap-2.5 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full hover:bg-[#a600ff] hover:border-[#a600ff] transition-all duration-300 group">
      {icon && (
        <img
          src={iconUrl}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-4 h-4 group-hover:scale-110 group-hover:brightness-0 group-hover:invert transition-transform object-contain"
        />
      )}
      <span className="font-geist text-[9px] font-semibold text-white/70 group-hover:text-white uppercase tracking-widest">{name}</span>
    </div>
  );
});

const TechMarquee = ({ items, direction = "left", speed = 20 }) => (
  <div className="flex overflow-visible select-none w-full group/marquee">
    <div className={`flex shrink-0 items-center gap-4 w-max py-1 animate-marquee-${direction} group-hover/marquee:[animation-play-state:paused] will-change-transform`} style={{ animationDuration: `${speed}s`, transform: 'translateZ(0)' }}>
      {[...items, ...items, ...items, ...items].map(([name, icon, color], idx) => (
        <TechBadge key={idx} name={name} icon={icon} color={color} />
      ))}
    </div>
  </div>
);

const MARQUEE_STYLES = `
  @keyframes marquee-left { from { transform: translateX(0); } to { transform: translateX(-25%); } }
  .animate-marquee-left { animation: marquee-left linear infinite; }
  .animate-marquee-right { animation: marquee-left linear infinite reverse; }
  @keyframes float-avatar {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(3deg); }
  }
  .animate-float-avatar { 
    animation: float-avatar 6s ease-in-out infinite;
    will-change: transform;
  }
`;

const ROW1 = [ // Robotics & Hardware
  ['Altium Designer', 'circuit', '0087CE'],
  ['Embedded C', 'c', '00599C'],
  ['STM32', 'stmicroelectronics', '03234E'],
  ['ROS2', 'ros', '22314E'],
  ['Arduino', 'arduino', '00979D'],
  ['Jetson Nano', 'nvidia', '76B900'],
];

const ROW2 = [ // Engineering & CAD
  ['KiCad EDA', 'kicad', '314A8F'],
  ['SolidWorks', null, 'CC1F35'],
  ['Fusion 360', 'autodesk', '0696D7'],
  ['MATLAB', null, '0076A8'],
  ['Power Electronics', 'flash-on', 'FFD700'],
  ['Oscilloscopes', 'physics', '000000'],
];

const ROW3 = [ // Web & Software
  ['React / Next', 'react-native', '61DAFB'],
  ['TypeScript', 'typescript', '3178C6'],
  ['JavaScript', 'javascript', 'F7DF1E'],
  ['Python', 'python', '3776AB'],
  ['HTML5', 'html-5', 'E34F26'],
  ['CSS3', 'css3', '1572B6'],
];

const ROW4 = [ // Creative & Media
  ['Photoshop', 'adobe-photoshop', '31A8FF'],
  ['Illustrator', 'adobe-illustrator', 'FF9A00'],
  ['After Effects', 'adobe-after-effects', 'CF96FD'],
  ['Premiere Pro', 'adobe-premiere-pro', 'EA77FF'],
  ['DaVinci', 'davinciresolve', '000000'],
  ['Krita', 'krita', '3BABFF'],
  ['Filmora-X', 'filmora', '000000'],
];

// Preload tech icons
if (typeof window !== 'undefined' && !window.__aboutIconsPreloaded) {
  [...ROW1, ...ROW2, ...ROW3, ...ROW4].forEach(([_, icon, color]) => {
    if (!icon) return;
    const img = new Image();
    const isSimpleIcon = [
      'kicad', 'mathworks', 'davinciresolve', 'ros', 'solidworks', 'altium', 'altiumdesigner', 'stmicroelectronics', 'c',
      'autodesk', 'dassaultsystemes', 'opencv', 'raspberrypi', 'gazebo', 'nvidia'
    ].includes(icon);
    img.src = isSimpleIcon
      ? `https://cdn.simpleicons.org/${icon}/${color || 'white'}`
      : `https://img.icons8.com/color/48/${icon}.png`;
  });
  window.__aboutIconsPreloaded = true;
}

const RAW_GALLERY_DATA = [
  { src: pic1, title: "Bangladesh Robot Olympiad 2020" },
  { src: pic2, title: "Bangladesh Robot Olympiad 2021" },
  { src: pic3, title: "Bangladesh Robot Olympiad 2022" },
  { src: pic4, title: "FPV Drone Simulation IRO 2022" },
  { src: pic5, title: "First Person View Drone" },
  { src: pic6, title: "International Robot Olympiad 2021" },
  { src: pic7, title: "International Robot Olympiad 2021" },
  { src: pic8, title: "International Robot Olympiad 2021" },
  { src: pic9, title: "International Robot Olympiad 2022" },
  { src: pic10, title: "International Robot Olympiad 2023" },
  { src: pic11, title: "International Robot Olympiad 2023" },
  { src: pic12, title: "International Robot Olympiad 2023" },
  { src: pic13, title: "World Robot Olympiad 2023" },
  { src: pic14, title: "World Robot Olympiad 2023" },
  { src: pic15, title: "World Robot Olympiad 2023" },
  { src: pic16, title: "World Robot Olympiad 2025" },
];

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// We will shuffle this inside the component to prevent HMR re-shuffles
const GALLERY_DATA = RAW_GALLERY_DATA;

const EngineeringGallery = memo(({ galleryData }) => {
  const [counter, setCounter] = useState(0);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);

  useEffect(() => {
    if (isNavHovered || isPhotoHovered) return;
    const timer = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, [isNavHovered, isPhotoHovered]);

  const activeGalleryIdx = counter % galleryData.length;

  return (
    <div className="w-full relative group rounded-none">
      <div
        onMouseEnter={() => setIsPhotoHovered(true)}
        onMouseLeave={() => setIsPhotoHovered(false)}
        className="w-full h-[500px] relative rounded-none overflow-hidden bg-black z-10"
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        {galleryData.map((item, idx) => (
          <img
            key={idx}
            src={item.src}
            alt={`Mahir Tajwar Chowdhury - ${item.title}`}
            style={{
              opacity: activeGalleryIdx === idx ? 1 : 0,
              transform: activeGalleryIdx === idx ? 'scale(1.05)' : 'scale(1)',
              transition: 'opacity 0.8s ease-in-out, transform 4s linear',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            loading="lazy"
            decoding="async"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 from-10% via-transparent via-50% to-transparent pointer-events-none" />
      </div>


      {/* Navigation Buttons (Outside) */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-12 md:-left-24 -right-12 md:-right-24 flex items-center justify-between pointer-events-none z-[40]">
        <button
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => setIsNavHovered(false)}
          onClick={(e) => { e.stopPropagation(); setCounter(prev => prev - 1); }}
          className="group/nav-l w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-lg transition-all cursor-target pointer-events-auto relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-[#a600ff] translate-x-full group-hover/nav-l:translate-x-0 transition-transform duration-300 ease-out z-0" />
          <span className="relative z-10">←</span>
        </button>
        <button
          onMouseEnter={() => setIsNavHovered(true)}
          onMouseLeave={() => setIsNavHovered(false)}
          onClick={(e) => { e.stopPropagation(); setCounter(prev => prev + 1); }}
          className="group/nav-r w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center text-white text-lg transition-all cursor-target pointer-events-auto relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-[#a600ff] -translate-x-full group-hover/nav-r:translate-x-0 transition-transform duration-300 ease-out z-0" />
          <span className="relative z-10">→</span>
        </button>
      </div>

      <div className="absolute bottom-8 left-8 right-12 max-w-[50%] pointer-events-none z-[30]">
        <h3 className={`font-orbitron text-2xl md:text-4xl font-black uppercase tracking-tighter flex flex-col -space-y-[5px] md:-space-y-[10px] transition-colors duration-500 ${isNavHovered ? 'text-[#a600ff]' : 'text-white'}`}>
          {galleryData[activeGalleryIdx].title.split(' ').map((word, index) => (
            <motion.div
              key={`${counter}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
            >
              {word}
            </motion.div>
          ))}
        </h3>
      </div>
    </div>
  );
});

const About = () => {
  const [galleryData] = useState(() => shuffleArray(RAW_GALLERY_DATA));

  // Preload all gallery images on mount
  useEffect(() => {
    galleryData.forEach((img) => {
      const image = new Image();
      image.src = img.src;
    });
  }, [galleryData]);

  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!document.getElementById('marquee-styles')) {
      const style = document.createElement('style');
      style.id = 'marquee-styles';
      style.innerHTML = MARQUEE_STYLES;
      document.head.appendChild(style);
    }
  }, []);

  // Magnetic Interaction Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 20 });
  const rotateX = useTransform(springY, [-50, 50], [10, -10]);
  const rotateY = useTransform(springX, [-50, 50], [-10, 10]);

  const rafRef = useRef(null);

  const handleMouseMove = (e) => {
    setIsHovered(true);
    const { clientX, clientY } = e;
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      const x = (clientX - window.innerWidth / 2) / 21; // magneticStrength: 21
      const y = (clientY - window.innerHeight / 2) / 21;
      mouseX.set(x);
      mouseY.set(y);
      rafRef.current = null;
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    mouseX.set(0);
    mouseY.set(0);
  };

  const isHeroInView = useInView(containerRef, { margin: "-10% 0px -10% 0px" });
  const sliderRef = useRef(null);

  return (
    <div ref={containerRef} className="w-full overflow-x-hidden bg-black selection:bg-[#a600ff] selection:text-white pb-12">
      {/* Background Decor — static fixed layer */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none z-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* ── New Intro Section (Perfectly Centered) ─────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden z-10 bg-transparent">

        {/* Layer 1: Background Solid Text (Center) - Matches Projects hero exactly */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="max-w-[1400px] w-full px-6 md:px-24 flex flex-col items-center">
            <div className="mb-6 flex items-center gap-4 opacity-40">
              <span className="font-geist text-[9px] md:text-[10px] text-white uppercase tracking-[0.5em] font-bold">
                BIOGRAPHY // MODULE_001
              </span>
            </div>

            <h1 className="font-orbitron text-[45px] md:text-[85px] lg:text-[120px] font-extrabold text-white uppercase leading-none tracking-tighter text-center">
              ABOUT ME
            </h1>

            <div className="mt-8 flex flex-col items-center gap-6">
              <div className="h-[1px] w-24 bg-[#ff6b00]" />
              <p className="font-geist text-white/70 text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-medium leading-relaxed max-w-lg text-center">
                MULTIDISCIPLINARY ROBOTICIST, ENGINEER, AND CINEMATOGRAPHER,
                SPECIALIZING IN EMBEDDED SYSTEMS & HARDWARE LOGIC.
              </p>
            </div>
          </div>
        </div>

        {/* Layer 2: Avatar (Magnetic + Floating) */}
        <div
          className="relative w-full max-w-[300px] md:max-w-[550px] flex items-center justify-center cursor-none z-20"
          style={{ scale: 0.9, transform: 'translateZ(0)' }} // avatarScale: 0.9
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="relative w-full pointer-events-none flex items-center justify-center"
            animate={isHeroInView ? {
              y: [0, -20, 0], // floatAmplitude: 20
              rotate: [0, 5, -12, 0], // Wider range biased to the left
              scale: isHovered ? 1.15 : 1, // hoverScale: 1.15
              opacity: isHovered ? 0.7 : 1, // hoverOpacity: 0.7
              x: 128, // avatarX: 128
            } : {}}
            transition={{
              y: { duration: 20, repeat: Infinity, ease: "easeInOut" }, // Slowed down to 20s
              rotate: { duration: 20, repeat: Infinity, ease: "easeInOut" },
              scale: { type: "spring", stiffness: 300, damping: 20 },
              opacity: { duration: 0.3 }
            }}
            style={{ translateY: -58 }} // avatarY: -58
          >
            <motion.div
              className="w-full will-change-transform"
              style={{ x: springX, y: springY, rotateX, rotateY, transform: 'translateZ(0)' }}
            >
              <img
                src={avatarImg}
                alt="Avatar"
                loading="lazy"
                decoding="async"
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Layer 3: Foreground Outline Text - Synced with Layer 1 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-30">
          <div className="max-w-[1400px] w-full px-6 md:px-24 flex flex-col items-center">
            <div className="mb-6 flex items-center gap-4 invisible">
              <span className="font-geist text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-bold">
                BIOGRAPHY // MODULE_001
              </span>
            </div>

            <h1 className="font-orbitron text-[45px] md:text-[85px] lg:text-[120px] font-extrabold text-transparent uppercase leading-none tracking-tighter text-center"
              style={{ WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.4)' }}>
              ABOUT ME
            </h1>

            <div className="mt-8 flex flex-col items-center gap-6 invisible">
              <div className="h-[1px] w-24 bg-[#ff6b00]" />
              <p className="font-geist text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-medium leading-relaxed max-w-lg text-center">
                MULTIDISCIPLINARY ROBOTICIST, ENGINEER, AND CINEMATOGRAPHER,
                SPECIALIZING IN EMBEDDED SYSTEMS & HARDWARE LOGIC.
              </p>
            </div>
          </div>
        </div>

      </section>

      <section className="relative min-h-[60vh] flex items-center overflow-hidden px-[12.25%] z-10 pt-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center justify-between gap-12 w-full"
        >
          {/* Left: Bio Text */}
          <div className="w-full md:w-5/12 flex flex-col gap-6">
            <div className="flex items-center gap-4 opacity-40">
              <span className="font-geist text-[9px] md:text-[10px] text-white uppercase tracking-[0.5em] font-bold">
                BIOGRAPHY // MODULE_001
              </span>
            </div>

            <h2 className="font-orbitron text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9]">
              <span className="inline">Mahir </span>
              <span className="inline text-transparent bg-clip-text bg-gradient-to-r from-[#a600ff] to-[#ff00e5]">Tajwar</span>
            </h2>

            <div className="flex items-center gap-4 opacity-60">
              <span className="font-geist text-xs tracking-[0.4em] text-white uppercase">Roboticist // Engineer // IRO Gold Medalist</span>
            </div>

            <div className="space-y-5 border-t border-white/10 pt-8">
              <div className="font-geist text-white/90 text-base leading-relaxed">
                <span className="block">I am a multidisciplinary roboticist and engineer. My work focuses on the intersection of hardware logic and autonomous systems.</span>
              </div>
              <div className="font-geist text-white/50 text-sm leading-loose uppercase tracking-wide">
                <span className="block">As an International Robot Olympiad (IRO) Gold Medalist, I am dedicated to perfecting autonomous interactions. My background from Mirzapur Cadet College has shaped my precision-driven approach to engineering.</span>
              </div>
              <div className="font-geist text-white/30 text-sm leading-loose uppercase tracking-wide">
                <span className="block">With a relentless focus on the future, I aim to continue developing robotic solutions that are not only technologically superior but also redefine how we interact with autonomous machines in our daily lives.</span>
              </div>
            </div>
          </div>

          {/* Right Side: Photo with Interactions */}
          <div className="w-full md:w-5/12 relative group cursor-target max-w-md ml-auto">
            <div className="relative aspect-[3/4] overflow-hidden">
              <div className="absolute top-2 left-4 z-20">
                <h2 className="font-orbitron text-4xl md:text-6xl font-black text-[#a600ff] group-hover:text-white leading-[0.6] tracking-tighter uppercase transition-colors duration-500 flex flex-col -space-y-[5px] md:-space-y-[10px]">
                  <span>A</span>
                  <span>PURE</span>
                  <span>ROBOCIST.</span>
                </h2>
              </div>

              <img
                src={profileImg}
                alt="Mahir Tajwar Chowdhury"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Model Slider ────────────────────────────────────────────────── */}
      <section className="relative mt-40 z-10">
        <div className="absolute -top-10 left-[12.25%] flex items-end">
          {/* Visual Layer (Behind Models) */}
          <div className="z-0 flex items-end pointer-events-none">
            <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none transition-colors">
              Kind of <span className="text-[#a600ff]">projects</span> <br />
              i worked on
            </h2>
            <div className="-ml-28 mb-[5px]">
              <span className="font-geist text-[13px] md:text-sm opacity-50 lowercase tracking-[0.2em] font-light underline underline-offset-4">
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
        <Suspense fallback={<div style={{ height: '600px' }} />}>
          <ModelSlider />
        </Suspense>
      </section>

      {/* ── Achievement Ticker Section ──────────────────────────────────── */}
      <section className="relative mt-40 z-10">
        <div className="max-w-7xl mx-auto px-[12.25%] grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <AchievementItem
            value="5"
            label="Intl Gold Medals"
            sublabel="World-Class Recognition"
          />
          <AchievementItem
            value="15"
            label="Circuits / PCB"
            sublabel="High-Density Design"
          />
          <AchievementItem
            value="20"
            suffix="+"
            label="Eng. Projects"
            sublabel="Professional Execution"
          />
        </div>
      </section>

      {/* ── Tech Stack Marquee ──────────────────────────────────────────── */}
      <section className="relative mt-40 pb-[100px] z-10">
        <div className="absolute -top-20 right-[12.25%] z-20">
          <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none text-right">
            Tech <span className="text-[#a600ff]">Stack</span>
          </h2>
        </div>

        <div style={{ position: 'relative', contain: 'layout style paint' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(to right, #000, transparent)', zIndex: 10, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(to left, #000, transparent)', zIndex: 10, pointerEvents: 'none' }} />

          <div className="flex flex-col gap-2 py-2">
            <TechMarquee items={ROW1} direction="left" speed={25} />
            <TechMarquee items={ROW2} direction="right" speed={30} />
            <TechMarquee items={ROW3} direction="left" speed={22} />
            <TechMarquee items={ROW4} direction="right" speed={28} />
          </div>
        </div>
      </section>

      {/* ── Engineering Gallery Section ─────────────────────────── */}
      <section className="relative mt-40 flex items-center overflow-hidden z-10">
        <div className="w-full max-w-7xl mx-auto px-[12.25%]">
          <EngineeringGallery galleryData={galleryData} />
        </div>
      </section>

      {/* ── Cadet Life ────────────────────────────────────────────────── */}
      <section className="relative mt-60 px-[12.25%] z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center justify-between gap-12 w-full mb-16"
        >
          {/* Left Side: Photo with Interactions (Mirroring Biography) */}
          <div className="w-full md:w-5/12 relative group cursor-target max-w-md">
            <div className="relative aspect-[3/4] overflow-hidden">
              <div className="absolute top-2 left-4 z-20">
                <h2 className="font-orbitron text-4xl md:text-6xl font-black text-[#a600ff] group-hover:text-white leading-[0.6] tracking-tighter uppercase transition-colors duration-500 flex flex-col -space-y-[5px] md:-space-y-[10px]">
                  <span>CADET</span>
                  <span>NO</span>
                  <span>3056.</span>
                </h2>
              </div>

              <img
                src={cadetImg}
                alt="Cadet Mahir Tajwar"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
              />
            </div>
          </div>

          {/* Right: Cadet Text Content */}
          <div className="w-full md:w-5/12 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                Cadet <span className="text-[#a600ff]">Life</span>
              </h2>

              <div className="space-y-5 border-t border-white/10 pt-8">
                <div className="font-geist text-white/90 text-base leading-relaxed">
                  <span className="block">My time at Mirzapur Cadet College profoundly shaped my discipline, leadership, and creative vision.</span>
                </div>
                <div className="font-geist text-white/50 text-sm leading-loose uppercase tracking-wide">
                  <span className="block">Beyond rigorous academics, it provided a platform to lead student government, pioneer technical initiatives, and direct cinematography for the college.</span>
                </div>
                <div className="font-geist text-white/30 text-sm leading-loose uppercase tracking-wide">
                  <span className="block">The precision and leadership skills I developed within these walls are the bedrock of my approach to robotics and engineering today.</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Roles & Achievements Grid (Full Width) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-8">
          <div className="border-l-2 border-[#a600ff]/50 pl-6 hover:border-[#a600ff] transition-colors">
            <h3 className="font-orbitron text-lg font-bold text-white uppercase tracking-wide">Student Government</h3>
            <p className="font-geist text-[#a600ff] text-xs tracking-[0.2em] mt-1 mb-3 uppercase">Mirzapur Cadet College • 2024–2025</p>
            <p className="font-geist text-white/60 text-sm leading-relaxed uppercase tracking-wider">House Cultural Prefect <br /> Junior House Prefect</p>
          </div>

          <div className="border-l-2 border-[#a600ff]/50 pl-6 hover:border-[#a600ff] transition-colors">
            <h3 className="font-orbitron text-lg font-bold text-white uppercase tracking-wide">MCC Robotics & Programming</h3>
            <p className="font-geist text-[#a600ff] text-xs tracking-[0.2em] mt-1 mb-3 uppercase">Club • 2022–2025</p>
            <p className="font-geist text-white/60 text-sm leading-relaxed uppercase tracking-wider">President <br /> Founding Member</p>
          </div>
        </div>

        {/* Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-12 pb-0">
          <LazyYouTube
            src="https://www.youtube.com/embed/M0EGckiSZTQ"
            title="Mirzapur Cadet College Cinematography"
          />
          <LazyYouTube
            src="https://www.youtube.com/embed/Ewg4r7PPipc"
            title="Mirzapur Cadet College Cinematography 2"
          />
        </div>
      </section>

      <footer className="mt-4 border-t border-white/10 pt-4 px-[12.25%] opacity-30 text-center">
      </footer>
    </div>
  );
};

export default About;