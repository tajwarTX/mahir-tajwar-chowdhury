/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, memo, lazy, Suspense, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import profileImg from "../assets/profile.jpg";
import avatarImg from "../assets/Face.png";

// Lazy-load the heavy 3D slider to keep initial About page JS lightweight
const ModelSlider = lazy(() => import('../components/3d/ModelSlider'));

// ─── System Clock Component (Isolates 1s re-renders) ───────────────────────
const SystemClock = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <>{time}</>;
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

// ─── Tech Badge Component ──────────────────────────────────────────────────
const TechBadge = ({ name, icon, color }) => {
  // Use Simple Icons for tech/engineering logos that Icons8 lacks
  const isSimpleIcon = [
    'kicad', 'mathworks', 'davinciresolve', 'ros', 'solidworks',
    'autodesk', 'dassaultsystemes', 'opencv', 'raspberrypi', 'gazebo', 'nvidia'
  ].includes(icon);
  const iconUrl = isSimpleIcon
    ? `https://cdn.simpleicons.org/${icon}/${color || 'white'}`
    : `https://img.icons8.com/color/48/${icon}.png`;

  return (
    <div className="cursor-target flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-[#a600ff] hover:border-[#a600ff] transition-all duration-300 group">
      {icon && (
        <img
          src={iconUrl}
          alt={name}
          className="w-4 h-4 group-hover:scale-110 group-hover:brightness-0 group-hover:invert transition-transform object-contain"
        />
      )}
      <span className="font-geist text-[10px] font-semibold text-white/70 group-hover:text-white uppercase tracking-widest">{name}</span>
    </div>
  );
};

const TechMarquee = ({ items, direction = "left", speed = 20 }) => (
  <div className="flex overflow-hidden select-none w-full group/marquee">
    <div className={`flex shrink-0 items-center gap-3 w-max py-1 animate-marquee-${direction} group-hover/marquee:[animation-play-state:paused]`} style={{ animationDuration: `${speed}s` }}>
      {/* Repeat 4 times for a perfect loop with -25% translation */}
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
  .animate-float-avatar { animation: float-avatar 6s ease-in-out infinite; }
`;

const ROW1 = [ // Robotics & Hardware
  ['ROS2', 'ros', '22314E'],
  ['Jetson Nano', 'nvidia', '76B900'],
  ['Raspberry Pi', null, 'C51A4A'],
  ['Arduino', 'arduino', '00979D'],
  ['SLAM', 'radar', '000000'],
  ['Gazebo', null, 'FF6B00'],
];

const ROW2 = [ // Engineering & CAD
  ['SolidWorks', null, 'CC1F35'],
  ['Fusion 360', 'autodesk', '0696D7'],
  ['MATLAB', null, '0076A8'],
  ['KiCad EDA', 'kicad', '314A8F'],
  ['Eagle EDA', 'autodesk', '0696D7'],
  ['Blender', 'blender-3d', 'F5792A'],
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
      'kicad', 'mathworks', 'davinciresolve', 'ros', 'solidworks',
      'autodesk', 'dassaultsystemes', 'opencv', 'raspberrypi', 'gazebo', 'nvidia'
    ].includes(icon);
    img.src = isSimpleIcon
      ? `https://cdn.simpleicons.org/${icon}/${color || 'white'}`
      : `https://img.icons8.com/color/48/${icon}.png`;
  });
  window.__aboutIconsPreloaded = true;
}

const About = () => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic Interaction Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 20 });
  const rotateX = useTransform(springY, [-50, 50], [10, -10]);
  const rotateY = useTransform(springX, [-50, 50], [-10, 10]);

  const handleMouseMove = (e) => {
    setIsHovered(true);
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 21; // magneticStrength: 21
    const y = (clientY - window.innerHeight / 2) / 21;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="w-full min-h-screen bg-black selection:bg-[#a600ff] selection:text-white pb-32">
      <style>{MARQUEE_STYLES}</style>

      {/* Background Decor — static fixed layer */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none z-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* ── New Intro Section (Perfectly Centered) ─────────────────────── */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden z-10 bg-transparent">

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
                SPECIALIZING IN AUTONOMOUS SYSTEMS.
              </p>
            </div>
          </div>
        </div>

        {/* Layer 2: Avatar (Magnetic + Floating) */}
        <div
          className="relative w-full max-w-[300px] md:max-w-[550px] flex items-center justify-center cursor-none z-20"
          style={{ scale: 0.9 }} // avatarScale: 0.9
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="relative w-full pointer-events-none flex items-center justify-center"
            animate={{ 
              y: [0, -20, 0], // floatAmplitude: 20
              rotate: [0, 5, -12, 0], // Wider range biased to the left
              scale: isHovered ? 1.15 : 1, // hoverScale: 1.15
              opacity: isHovered ? 0.7 : 1, // hoverOpacity: 0.7
              x: 128, // avatarX: 128
            }}
            transition={{ 
              y: { duration: 20, repeat: Infinity, ease: "easeInOut" }, // Slowed down to 20s
              rotate: { duration: 20, repeat: Infinity, ease: "easeInOut" },
              scale: { type: "spring", stiffness: 300, damping: 20 },
              opacity: { duration: 0.3 }
            }}
            style={{ translateY: -58 }} // avatarY: -58
          >
            <motion.div
              className="w-full"
              style={{ x: springX, y: springY, rotateX, rotateY }}
            >
              <img
                src={avatarImg}
                alt="Avatar"
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
                SPECIALIZING IN AUTONOMOUS SYSTEMS.
              </p>
            </div>
          </div>
        </div>

      </section>

      <section className="relative pt-24 px-[12.25%] z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-start justify-between gap-12 text-left"
        >
          <div className="max-w-3xl order-2 md:order-1">
            <h1 className="font-orbitron text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.9]">
              Mahir Tajwar <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a600ff] to-[#ff00e5]">Chowdhury</span>
            </h1>

            <div className="flex items-center justify-start gap-4 mb-10 opacity-60">
              <span className="font-geist text-xs tracking-[0.4em] text-white uppercase">Roboticist // Engineer // IRO Gold Medalist</span>
            </div>

            <div className="space-y-8 text-left border-t border-white/10 pt-10">
              <p className="font-geist text-white/90 text-xl leading-relaxed">
                I am a multidisciplinary roboticist and engineer. My work focuses on the intersection of hardware logic and autonomous systems.
              </p>

              <p className="font-geist text-white/60 text-base leading-loose uppercase tracking-wide">
                As an International Robot Olympiad (IRO) Gold Medalist, I am dedicated to perfecting autonomous interactions. My background from Mirzapur Cadet College has shaped my precision-driven approach to engineering.
              </p>
            </div>
          </div>

          {/* Circular Profile Image with Pulse Glow */}
          <div className="order-1 md:order-2 shrink-0 relative group">
            <div className="absolute inset-0 bg-[#a600ff]/20 rounded-full blur-2xl group-hover:bg-[#a600ff]/40 transition-colors duration-700" />
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-[#a600ff]/50 shadow-[0_0_50px_rgba(166,0,255,0.3)] group-hover:border-[#a600ff] transition-all duration-500">
              <img
                src={profileImg}
                alt="Mahir Tajwar Chowdhury"
                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="max-w-3xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 pt-10 border-t border-white/10">
            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/[0.06] transition-colors group">
              <h3 className="font-orbitron text-[#a600ff] text-xs font-bold uppercase mb-6 tracking-[0.3em] flex items-center gap-3">
                <span className="w-2 h-2 bg-[#a600ff] rounded-full animate-pulse" />
                Achievements
              </h3>
              <ul className="font-geist text-[10px] text-white/50 space-y-4 uppercase tracking-[0.2em] font-semibold">
                <li className="flex items-center gap-3 group-hover:text-white transition-colors"><span className="text-[#a600ff]">01</span> IRO Gold Medalist</li>
                <li className="flex items-center gap-3 group-hover:text-white transition-colors"><span className="text-[#a600ff]">02</span> National Robotics Champion</li>
                <li className="flex items-center gap-3 group-hover:text-white transition-colors"><span className="text-[#a600ff]">03</span> Mirzapur Cadet College Alumnus</li>
                <li className="flex items-center gap-3 group-hover:text-white transition-colors"><span className="text-[#a600ff]">04</span> STCSTC Framework Specialist</li>
              </ul>
            </div>

            <div className="bg-white/[0.03] border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/[0.06] transition-colors group">
              <h3 className="font-orbitron text-[#a600ff] text-xs font-bold uppercase mb-6 tracking-[0.3em] flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                System Info
              </h3>
              <ul className="font-geist text-[10px] text-white/50 space-y-4 uppercase tracking-[0.2em] font-semibold">
                <li className="flex items-center justify-between group-hover:text-white transition-colors"><span>Status</span> <span className="text-[#a600ff]">ACTIVE_NODE</span></li>
                <li className="flex items-center justify-between group-hover:text-white transition-colors"><span>Location</span> <span className="text-white">DHAKA, BD</span></li>
                <li className="flex items-center justify-between group-hover:text-white transition-colors"><span>Local Time</span> <span className="text-white font-mono"><SystemClock /></span></li>
                <li className="flex items-center justify-between group-hover:text-white transition-colors"><span>Spec</span> <span className="text-[#a600ff]">AUTONOMOUS_LOGIC</span></li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Tech Stack Marquee ──────────────────────────────────────────── */}
      <section className="relative mt-40 z-10">
        <div className="absolute -top-20 right-[12.25%] z-20">
          <h2 className="font-orbitron text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none text-right">
            Tech <span className="text-[#a600ff]">Stack</span>
          </h2>
        </div>

        <div style={{ position: 'relative', contain: 'layout style' }}>
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

      {/* ── Cadet Life ────────────────────────────────────────────────── */}
      <section className="relative mt-52 px-[12.25%] z-10">
        <div className="flex flex-col md:flex-row gap-16">
          <div className="w-full md:w-5/12">
            <h2 className="font-orbitron text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8">
              Cadet <span className="text-[#a600ff]">Life</span>
            </h2>
            <p className="font-geist text-white/80 text-lg leading-relaxed mb-10">
              My time at <span className="text-white font-semibold">Mirzapur Cadet College</span> profoundly shaped my discipline, leadership, and creative vision. Beyond rigorous academics, it provided a platform to lead student government, pioneer technical initiatives, and direct cinematography for the college.
            </p>

            <div className="space-y-10">
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
          </div>

          <div className="w-full md:w-7/12 flex flex-col gap-8">
            <LazyYouTube
              src="https://www.youtube.com/embed/M0EGckiSZTQ"
              title="Mirzapur Cadet College Cinematography"
            />
            <LazyYouTube
              src="https://www.youtube.com/embed/Ewg4r7PPipc"
              title="Mirzapur Cadet College Cinematography 2"
            />
          </div>
        </div>
      </section>

      {/* ── Model Slider ────────────────────────────────────────────────── */}
      <section className="relative mt-60 z-10">
        <div className="absolute -top-10 left-[12.25%] flex items-end">
          {/* Visual Layer (Behind Models) */}
          <div className="z-0 flex items-end pointer-events-none">
            <h2 className="font-orbitron text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none transition-colors">
              Kind of <span className="text-[#a600ff]">projects</span> <br />
              i worked on
            </h2>
            <div className="-ml-40 mb-[5px]">
              <span className="font-geist text-[13px] md:text-sm opacity-50 lowercase tracking-[0.2em] font-light underline underline-offset-4">
                learn more &rarr;
              </span>
            </div>
          </div>

          {/* Interaction Layer (Invisible on top of Models) */}
          <div className="absolute inset-0 z-[2000] pointer-events-none flex items-end">
            <div className="invisible font-orbitron text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Kind of projects <br />
              i worked on
            </div>
            <Link to="/projects" className="cursor-target inline-block -ml-40 mb-[5px] pointer-events-auto opacity-0">
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

      <footer className="mt-24 border-t border-white/10 pt-10 px-[12.25%] opacity-30 text-center">
      </footer>
    </div>
  );
};

export default About;