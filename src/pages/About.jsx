/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, memo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import profileImg from "../assets/profile.jpg";

// Lazy-load the heavy 3D slider — only mount when user scrolls to it
const ModelSlider = lazy(() => import("../components/3d/ModelSlider"));

// ─── Tech items: [label, simpleicons slug, hex color] ────────────────────────
const ROW1 = [
  ['C',             'c',               '5C6BC0'],
  ['C++',           'cplusplus',       '00599C'],
  ['Python',        'python',          '3776AB'],
  ['Arduino',       'arduino',         '00979D'],
  ['ESP-32',        'espressif',       'E7352C'],
  ['Raspberry Pi',  'raspberrypi',     'A22846'],
  ['Jetson Nano',   'nvidia',          '76B900'],
  ['PlatformIO',    'platformio',      'FF7F00'],
  ['MQTT',          'eclipsemosquitto','2C3E50'],
  ['KiCad',         'kicad',           '314CB0'],
  ['MATLAB',        'mathworks',       '0076A8'],
  ['ROS',           'ros',             '22314E'],
  ['Blender',       'blender',         'E87D0D'],
  ['Fusion 360',    'autodesk',        '0696D7'],
  ['SolidWorks',    'dassaultsystemes','005386'],
];

const ROW2 = [
  ['HTML5',         'html5',             'E34F26'],
  ['CSS3',          'css3',              '1572B6'],
  ['JavaScript',    'javascript',        'F7DF1E'],
  ['React',         'react',             '61DAFB'],
  ['Next.js',       'nextdotjs',         'FFFFFF'],
  ['TypeScript',    'typescript',        '3178C6'],
  ['Illustrator',   'adobeillustrator',  'FF9A00'],
  ['Photoshop',     'adobephotoshop',    '31A8FF'],
  ['After Effects', 'adobeaftereffects', 'CF96FD'],
  ['Premiere Pro',  'adobepremierepro',  'EA77FF'],
  ['DaVinci',       'davinciresolve',    'FF3F00'],
  ['Krita',         'krita',             '3BABFF'],
  ['Filmora',       'wondershare',       'EF3947'],
  ['Eagle EDA',     'autodesk',          '0696D7'],
];

// ─── Preload all tech icons eagerly ──────────────────────────────────────────
const ALL_ICONS = [...ROW1, ...ROW2];
if (typeof window !== 'undefined') {
  ALL_ICONS.forEach(([, slug, color]) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.type = 'image/svg+xml';
    link.href = `https://cdn.simpleicons.org/${slug}/${color}`;
    document.head.appendChild(link);
  });
}

// Memoized pill component — prevents re-render of every pill on parent state change
const TechPill = memo(({ label, slug, color }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '0.65rem',
    flexShrink: 0, padding: '0.6rem 1.4rem',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.03)',
    willChange: 'transform', // GPU-promote for smooth marquee
  }}>
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color}`}
      alt={label}
      width={20} height={20}
      loading="eager"
      decoding="async"
      style={{ flexShrink: 0, display: 'block' }}
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
    />
    <span style={{
      fontFamily: 'monospace', fontSize: '11px',
      color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap',
      letterSpacing: '0.12em', textTransform: 'uppercase',
    }}>{label}</span>
  </div>
));

// Memoized marquee — the doubled array + pills are only computed once per items change
const TechMarquee = memo(({ items, direction = 'left', speed = 4 }) => {
  const doubled = useMemo(() => [...items, ...items], [items]);
  const duration = items.length * speed;
  return (
    <div style={{ overflow: 'hidden', width: '100%', position: 'relative' }}>
      <div style={{
        display: 'flex',
        gap: '2rem',
        width: 'max-content',
        animation: `marquee-${direction} ${duration}s linear infinite`,
        willChange: 'transform', // GPU-composited transform only
      }}>
        {doubled.map(([label, slug, color], i) => (
          <TechPill key={`${slug}-${i}`} label={label} slug={slug} color={color} />
        ))}
      </div>
    </div>
  );
});

// ─── Marquee keyframes injected once ─────────────────────────────────────────
const MARQUEE_STYLES = `
  @keyframes marquee-left {
    from { transform: translate3d(0, 0, 0); }
    to   { transform: translate3d(-50%, 0, 0); }
  }
  @keyframes marquee-right {
    from { transform: translate3d(-50%, 0, 0); }
    to   { transform: translate3d(0, 0, 0); }
  }
`;

const About = () => {
  const [systemTime, setSystemTime] = useState("");
  
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-black selection:bg-[#a600ff] selection:text-white pb-32">

      <style>{MARQUEE_STYLES}</style>

      {/* Background Decor — GPU-promoted fixed layer */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none z-0" style={{ willChange: 'transform' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <section className="relative pt-40 px-6 md:px-24 max-w-[1200px] mx-auto z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* Circular Profile Image — eager load, sized for LCP */}
          <div className="mb-12">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-[#a600ff] shadow-[0_0_30px_rgba(166,0,255,0.2)]">
              <img 
                src={profileImg} 
                alt="Mahir Tajwar Chowdhury" 
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="font-orbitron text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">
              Mahir Tajwar <span className="text-[#a600ff]">Chowdhury</span>
            </h1>

            <div className="flex items-center justify-center gap-4 mb-10 opacity-60">
              <span className="font-geist text-xs tracking-[0.4em] text-white uppercase">Roboticist // Engineer // IRO Gold Medalist</span>
            </div>

            <div className="space-y-8 text-left border-t border-white/10 pt-10">
              <p className="font-geist text-white/90 text-xl leading-relaxed">
                I am a multidisciplinary roboticist and engineer. My work focuses on the intersection of hardware logic and autonomous systems.
              </p>
              
              <p className="font-geist text-white/60 text-base leading-loose uppercase tracking-wide">
                As an International Robot Olympiad (IRO) Gold Medalist, I am dedicated to perfecting autonomous interactions. My background from Mirzapur Cadet College has shaped my precision-driven approach to engineering.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16 pt-10 border-t border-white/10">
                <div>
                  <h3 className="font-orbitron text-[#a600ff] text-sm font-bold uppercase mb-4 tracking-widest">Achievements</h3>
                  <ul className="font-geist text-xs text-white/50 space-y-2 uppercase tracking-wider">
                    <li>• IRO Gold Medalist</li>
                    <li>• National Robotics Champion</li>
                    <li>• Mirzapur Cadet College Alumnus</li>
                    <li>• STCSTC Framework Specialist</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-orbitron text-[#a600ff] text-sm font-bold uppercase mb-4 tracking-widest">System Info</h3>
                  <ul className="font-geist text-xs text-white/50 space-y-2 uppercase tracking-wider">
                    <li>• Status: Active</li>
                    <li>• Location: Dhaka, BD</li>
                    <li>• Local Time: {systemTime}</li>
                    <li>• Specialization: Autonomous Logic</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack Marquee ──────────────────────────────────────────── */}
      <section className="relative mt-40 z-10">
        <div className="absolute -top-20 right-[12.25%] z-20">
          <h2 className="font-orbitron text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none text-right">
            Tech <span className="text-[#a600ff]">Stack</span>
          </h2>
        </div>

        {/* Rows with edge gradient fades */}
        <div style={{ position: 'relative', contain: 'layout style' }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'120px', background:'linear-gradient(to right, #000, transparent)', zIndex:10, pointerEvents:'none' }} />
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'120px', background:'linear-gradient(to left, #000, transparent)', zIndex:10, pointerEvents:'none' }} />

          <div style={{ display:'flex', flexDirection:'column', gap:'1rem', padding:'0.5rem 0' }}>
            <TechMarquee items={ROW1} direction="left"  speed={3.5} />
            <TechMarquee items={ROW2} direction="right" speed={3.5} />
          </div>
        </div>
      </section>

      {/* ── Cadet Life ────────────────────────────────────────────────── */}
      <section className="relative mt-52 px-6 md:px-24 max-w-[1200px] mx-auto z-10">
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
                <p className="font-geist text-white/60 text-sm leading-relaxed uppercase tracking-wider">House Cultural Prefect <br/> Junior House Prefect</p>
              </div>

              <div className="border-l-2 border-[#a600ff]/50 pl-6 hover:border-[#a600ff] transition-colors">
                <h3 className="font-orbitron text-lg font-bold text-white uppercase tracking-wide">MCC Robotics & Programming</h3>
                <p className="font-geist text-[#a600ff] text-xs tracking-[0.2em] mt-1 mb-3 uppercase">Club • 2022–2025</p>
                <p className="font-geist text-white/60 text-sm leading-relaxed uppercase tracking-wider">President <br/> Founding Member</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-7/12 flex flex-col gap-8">
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(166,0,255,0.05)] relative group">
              <iframe 
                className="absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                src="https://www.youtube.com/embed/M0EGckiSZTQ" 
                title="Mirzapur Cadet College Cinematography" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(166,0,255,0.05)] relative group">
              <iframe 
                className="absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                src="https://www.youtube.com/embed/Ewg4r7PPipc" 
                title="Mirzapur Cadet College Cinematography 2" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>
          </div>
        </div>
      </section>

      {/* ── Model Slider ────────────────────────────────────────────────── */}
      <section className="relative mt-60 z-10">
        <div className="absolute -top-10 left-[12.25%] z-20">
          <Link to="/projects" className="group block">
            <h2 className="font-orbitron text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none transition-colors">
              Kind of <span className="text-[#a600ff]">projects</span> <br/>
              i worked on
              <span className="font-geist text-[13px] md:text-sm ml-4 md:ml-8 opacity-40 group-hover:opacity-100 transition-opacity lowercase tracking-[0.2em] font-light underline underline-offset-4">
                learn more &rarr;
              </span>
            </h2>
          </Link>
        </div>
        <Suspense fallback={<div style={{ height: '600px' }} />}>
          <ModelSlider />
        </Suspense>
      </section>

      <footer className="mt-24 border-t border-white/10 pt-10 px-6 md:px-24 max-w-[1200px] mx-auto opacity-30 text-center">
      </footer>
    </div>
  );
};

export default About;