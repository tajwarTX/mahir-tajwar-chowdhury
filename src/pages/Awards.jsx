import React from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useVelocity, useTransform } from 'framer-motion';
import ScrollLetterRevealDelayed from "../components/ScrollLetterRevealDelayed";

// Import Certificates
// Internationals
import IRO2020_Silver from "../assets/certificates/internationals/International Robot Olympiad 2020 - Silver Medal -- Robot In Movie (Junior Group).jpg";
import IRO2020_Tech from "../assets/certificates/internationals/International Robot Olympiad 2020 - Technical Medal -- Creative Category (Junior Group).jpg";
import IRO2021_Bronze from "../assets/certificates/internationals/International Robot Olympiad 2021 - Bronze Medal -- Robot In Movie (Challenge Group).jpg";
import IRO2021_Gold from "../assets/certificates/internationals/International Robot Olympiad 2021 - Gold Medal -- Creative Category (Challenge Group).jpg";
import IRO2022_Bronze from "../assets/certificates/internationals/International Robot Olympiad 2022 - Bronze Medal -- Robot In Movie (Challenge Group).jpg";
import IRO2022_Silver from "../assets/certificates/internationals/International Robot Olympiad 2022 - Silver Medal -- Creative Category (Challenge Group).jpg";
import IRO2022_Tech_FPV from "../assets/certificates/internationals/International Robot Olympiad 2022 - Technical Medal -- FPV Racing (Challenge Group).jpg";
import IRO2023_Bronze from "../assets/certificates/internationals/International Robot Olympiad 2023 - Bronze Medal -- Physical Computing (Senior Group).jpg";
import IRO2023_Silver from "../assets/certificates/internationals/International Robot Olympiad 2023 - Silver Medal -- AI Autonomous Driving (Senior Group).jpg";
import WRO2023_Intl from "../assets/certificates/internationals/World Robot Olympiad 2023 - International Final - 11th : 120 -- Future Engineers Category (Senior Group).jpg";
import WRO2025_Intl from "../assets/certificates/internationals/World Robot Olympiad 2025 - International Final - Bronze Medal  --  Robomission Category (Senior Group).jpg";

// Nationals
import BdRO2020_Bronze from "../assets/certificates/nationals/Bangladesh Robot Olympiad 2020 - Bronze Medal --Robot gathering (Junior Group).jpg";
import BdRO2021_Silver from "../assets/certificates/nationals/Bangladesh Robot Olympiad 2021 - Silver Medal -- Creative Category (Challenge Group).jpg";
import BdRO2022_Gold from "../assets/certificates/nationals/Bangladesh Robot Olympiad 2022 - Gold Medal -- Creative Category (Challenge Group).jpg";
import BdRO2023_Tech from "../assets/certificates/nationals/Bangladesh Robot Olympiad 2023 - Technical Award  -- Creative Category (Challenge Group).jpg";
import WRO2023_Nat from "../assets/certificates/nationals/World Robot Olympiad 2023 - National Round - Technical Medal -- Future Engineers Category (Senior Group).jpg";
import WRO2025_Nat from "../assets/certificates/nationals/World Robot Olympiad 2025 - National Round - Bronze Medal  --  Robomission Category (Senior Group).jpg";

// Others
import MCC_Robotics from "../assets/certificates/others/Cadet Achiebement Award of outstanding permormance - MCC Robotics Club Exhibition.jpg";
import MECA_Painting from "../assets/certificates/others/Cadet Achiebement Award of outstanding permormance - MECA Painting Exhibition.jpg";
import BIF_2022 from "../assets/certificates/others/Certificate of Appreciation - Bangladesh Innovation Forum – 2022.jpg";
import ICT_Div_2022 from "../assets/certificates/others/Certificate of Appreciation - Information and Communication Technology Division (ICT Div) – 2022.jpg";
import NMST_2024 from "../assets/certificates/others/Certificate of Appreciation - National Museum of Science and Technology – 2024.jpg";
import Creativity_2022 from "../assets/certificates/others/Champion Creativity Exhibition - 2022.jpg";
import DUNMUN_2019 from "../assets/certificates/others/Dhaka University Model United Nations 2019 (DUNMUN) – Delegate of Chile.jpg";
import Chitra_Mukul_1 from "../assets/certificates/others/Diploma in Preliminary \"Chitra Mukul\" 2011 – Grade A+.jpg";
import Chitra_Mukul_2 from "../assets/certificates/others/Diploma in Preliminary 1st Year 1st Semester \"Chitra Mukul\" 2011 – Grade A+.jpg";
import Chitra_Mukul_3 from "../assets/certificates/others/Diploma in Preliminary Final Semester \"Chitra Mukul\" 2011 – Grade A.jpg";
import School_Of_Robotics_2022 from "../assets/certificates/others/Inter Cadet College Workshop on Robotics \"SCHOOL OF ROBOTICS\" - 2022.jpg";
import ML_Python_2022 from "../assets/certificates/others/Machine Learning using Python (CADD CENTRE) – 2022.jpg";

const awardsData = [
  // --- INTERNATIONALS ---
  {
    year: "2025",
    title: "BRONZE MEDAL - ROBOMISSION CATEGORY",
    org: "WORLD ROBOT OLYMPIAD (INTERNATIONAL FINAL)",
    description: "WORLD ROBOT OLYMPIAD - SENIOR GROUP",
    image: WRO2025_Intl,
    type: "INTERNATIONAL"
  },
  {
    year: "2023",
    title: "11TH / 120 - FUTURE ENGINEERS",
    org: "WORLD ROBOT OLYMPIAD (INTERNATIONAL FINAL)",
    description: "WORLD ROBOT OLYMPIAD - SENIOR GROUP",
    image: WRO2023_Intl,
    type: "INTERNATIONAL"
  },
  {
    year: "2023",
    title: "SILVER MEDAL - AI AUTONOMOUS DRIVING",
    org: "INTERNATIONAL ROBOT OLYMPIAD",
    description: "INTERNATIONAL ROBOT OLYMPIAD - SENIOR GROUP",
    image: IRO2023_Silver,
    type: "INTERNATIONAL"
  },
  {
    year: "2023",
    title: "BRONZE MEDAL - PHYSICAL COMPUTING",
    org: "INTERNATIONAL ROBOT OLYMPIAD",
    description: "INTERNATIONAL ROBOT OLYMPIAD - SENIOR GROUP",
    image: IRO2023_Bronze,
    type: "INTERNATIONAL"
  },
  {
    year: "2022",
    title: "TECHNICAL MEDAL - FPV RACING",
    org: "INTERNATIONAL ROBOT OLYMPIAD",
    description: "INTERNATIONAL ROBOT OLYMPIAD - CHALLENGE GROUP",
    image: IRO2022_Tech_FPV,
    type: "INTERNATIONAL"
  },
  {
    year: "2022",
    title: "SILVER MEDAL - CREATIVE CATEGORY",
    org: "INTERNATIONAL ROBOT OLYMPIAD",
    description: "INTERNATIONAL ROBOT OLYMPIAD - CHALLENGE GROUP",
    image: IRO2022_Silver,
    type: "INTERNATIONAL"
  },
  {
    year: "2022",
    title: "BRONZE MEDAL - ROBOT IN MOVIE",
    org: "INTERNATIONAL ROBOT OLYMPIAD",
    description: "INTERNATIONAL ROBOT OLYMPIAD - CHALLENGE GROUP",
    image: IRO2022_Bronze,
    type: "INTERNATIONAL"
  },
  {
    year: "2021",
    title: "GOLD MEDAL - CREATIVE CATEGORY",
    org: "INTERNATIONAL ROBOT OLYMPIAD",
    description: "INTERNATIONAL ROBOT OLYMPIAD - CHALLENGE GROUP",
    image: IRO2021_Gold,
    type: "INTERNATIONAL"
  },
  {
    year: "2021",
    title: "BRONZE MEDAL - ROBOT IN MOVIE",
    org: "INTERNATIONAL ROBOT OLYMPIAD",
    description: "INTERNATIONAL ROBOT OLYMPIAD - CHALLENGE GROUP",
    image: IRO2021_Bronze,
    type: "INTERNATIONAL"
  },
  {
    year: "2020",
    title: "TECHNICAL MEDAL - CREATIVE CATEGORY",
    org: "INTERNATIONAL ROBOT OLYMPIAD",
    description: "INTERNATIONAL ROBOT OLYMPIAD - JUNIOR GROUP",
    image: IRO2020_Tech,
    type: "INTERNATIONAL"
  },
  {
    year: "2020",
    title: "SILVER MEDAL - ROBOT IN MOVIE",
    org: "INTERNATIONAL ROBOT OLYMPIAD",
    description: "INTERNATIONAL ROBOT OLYMPIAD - JUNIOR GROUP",
    image: IRO2020_Silver,
    type: "INTERNATIONAL"
  },

  // --- NATIONALS ---
  {
    year: "2025",
    title: "BRONZE MEDAL - ROBOMISSION CATEGORY",
    org: "WORLD ROBOT OLYMPIAD (NATIONAL ROUND)",
    description: "WORLD ROBOT OLYMPIAD NATIONALS - SENIOR GROUP",
    image: WRO2025_Nat,
    type: "NATIONAL"
  },
  {
    year: "2023",
    title: "TECHNICAL MEDAL - FUTURE ENGINEERS",
    org: "WORLD ROBOT OLYMPIAD (NATIONAL ROUND)",
    description: "WORLD ROBOT OLYMPIAD NATIONALS - SENIOR GROUP",
    image: WRO2023_Nat,
    type: "NATIONAL"
  },
  {
    year: "2023",
    title: "TECHNICAL AWARD - CREATIVE CATEGORY",
    org: "BANGLADESH ROBOT OLYMPIAD",
    description: "BANGLADESH ROBOT OLYMPIAD - CHALLENGE GROUP",
    image: BdRO2023_Tech,
    type: "NATIONAL"
  },
  {
    year: "2022",
    title: "GOLD MEDAL - CREATIVE CATEGORY",
    org: "BANGLADESH ROBOT OLYMPIAD",
    description: "BANGLADESH ROBOT OLYMPIAD - CHALLENGE GROUP",
    image: BdRO2022_Gold,
    type: "NATIONAL"
  },
  {
    year: "2021",
    title: "SILVER MEDAL - CREATIVE CATEGORY",
    org: "BANGLADESH ROBOT OLYMPIAD",
    description: "BANGLADESH ROBOT OLYMPIAD - CHALLENGE GROUP",
    image: BdRO2021_Silver,
    type: "NATIONAL"
  },
  {
    year: "2020",
    title: "BRONZE MEDAL - ROBOT GATHERING",
    org: "BANGLADESH ROBOT OLYMPIAD",
    description: "BANGLADESH ROBOT OLYMPIAD - JUNIOR GROUP",
    image: BdRO2020_Bronze,
    type: "NATIONAL"
  },
  // --- OTHERS & WORKSHOPS ---
  {
    year: "2024",
    title: "CERTIFICATE OF APPRECIATION",
    org: "NATIONAL MUSEUM OF SCIENCE AND TECHNOLOGY",
    description: "RECOGNITION FOR CONTRIBUTIONS TO SCIENCE AND TECHNOLOGY SECTOR",
    image: NMST_2024,
    type: "MISC"
  },
  {
    year: "2022",
    title: "MACHINE LEARNING USING PYTHON",
    org: "CADD CENTRE",
    description: "COURSE - CERTIFICATE OF COMPLETION",
    image: ML_Python_2022,
    type: "MISC"
  },
  {
    year: "2022",
    title: "SCHOOL OF ROBOTICS",
    org: "CADET COLLEGES BANGLADESH \nBANGLADESH ROBOT OLYMPIAD",
    description: "COURSE - INTER CADET COLLEGE ROBOTICS WORKSHOP",
    image: School_Of_Robotics_2022,
    type: "MISC"
  },
  {
    year: "2022",
    title: "CERTIFICATE OF APPRECIATION",
    org: "BANGLADESH INNOVATION FORUM",
    description: "APPRECIATION FOR VOLUNTARY CONTRIBUTIONS AND INNOVATIONS",
    image: BIF_2022,
    type: "MISC"
  },
  {
    year: "2022",
    title: "CERTIFICATE OF APPRECIATION",
    org: "ICT DIVISION (The Government of Bangladesh)",
    description: "RECOGNITION FROM THE INFORMATION AND COMMUNICATION TECHNOLOGY DIVISION Bangladesh",
    image: ICT_Div_2022,
    type: "MISC"
  },
  {
    year: "2022",
    title: "CHAMPION - CREATIVITY EXHIBITION",
    org: "MIRZAPUR CADET COLLEGE",
    description: "MCC CREATIVITY EXHIBITION COMPETITION",
    image: Creativity_2022,
    type: "MISC"
  },
  {
    year: "2019",
    title: "DELEGATE OF CHILE",
    org: "DUNMUN (DHAKA UNIVERSITY)",
    description: "WORLD TRADE ORGANIZATION - DHAKA UNIVERSITY MODEL UNITED NATIONS",
    image: DUNMUN_2019,
    type: "MISC"
  },
  {
    year: "2022",
    title: "CADET ACHIEVEMENT AWARD",
    org: "MIRZAPUR CADET COLLEGE",
    description: "OUTSTANDING PERFORMANCE - MCC ROBOTICS CLUB EXHIBITION",
    image: MCC_Robotics,
    type: "MISC"
  },
  {
    year: "2022",
    title: "CADET ACHIEVEMENT AWARD",
    org: "MIRZAPUR CADET COLLEGE",
    description: "OUTSTANDING PERFORMANCE - MECA PAINTING EXHIBITION",
    image: MECA_Painting,
    type: "MISC"
  },
  {
    year: "2011",
    title: "GRADE A FINAL SEMESTER",
    org: "BMA CHILDREN’S CLUB",
    description: "Diploma in Preliminary \"CHITRA MUKUL\"",
    image: Chitra_Mukul_3,
    type: "MISC"
  },
  {
    year: "2011",
    title: "GRADE A+ 1ST YEAR 2ND SEMESTER",
    org: "BMA CHILDREN’S CLUB",
    description: "Diploma in Preliminary \"CHITRA MUKUL\"",
    image: Chitra_Mukul_1,
    type: "MISC"
  },
  {
    year: "2011",
    title: "GRADE A+ 1ST YEAR 1ST SEMESTER",
    org: "BMA CHILDREN’S CLUB",
    description: "Diploma in Preliminary \"CHITRA MUKUL\"",
    image: Chitra_Mukul_2,
    type: "MISC"
  }
];

const StatItem = ({ label, value, color, isActive, onClick }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => {
        let start = 0;
        const end = value;
        if (start === end) {
          setCount(end);
          return;
        }
        let totalMiliseconds = 1500;
        let incrementTime = totalMiliseconds / (end || 1);
        let timer = setInterval(() => {
          start += 1;
          setCount(start);
          if (start >= end) clearInterval(timer);
        }, incrementTime);
      }}
      viewport={{ once: true }}
      onClick={onClick}
      className={`flex flex-col items-center md:items-end group cursor-pointer cursor-target transition-all duration-300 ${isActive ? 'scale-110 opacity-100' : 'opacity-40 hover:opacity-100'}`}
    >
      <span
        className="font-orbitron text-2xl md:text-4xl font-black tabular-nums tracking-tighter transition-all duration-500"
        style={{ color: value > 0 ? color : 'rgba(255,255,255,0.1)' }}
      >
        {count < 10 ? `0${count}` : count}
      </span>
      <div className="mt-2 flex flex-col items-center md:items-end">
        <span className="font-orbitron text-[10px] md:text-xs text-[#e1ff51] uppercase tracking-[0.3em] font-bold">
          {label}
        </span>
        <span className="font-geist text-[9px] md:text-[10px] text-white/20 uppercase tracking-widest mt-1">
          {isActive ? 'Filtering' : 'Achievement'}
        </span>
      </div>
    </motion.div>
  );
};

const AwardItem = React.memo(({ award, idx, onHover, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => onHover(award)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(award)}
      transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.19, 1, 0.22, 1] }}
      className="bg-transparent p-8 md:p-12 group hover:bg-[#e1ff51]/[0.08] border-b border-white/5 transition-all duration-500 relative overflow-hidden last:border-none cursor-pointer"
    >
      {/* Hover Effect Line */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[2px] bg-[#e1ff51] w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_200px] items-start gap-8 md:gap-16">
        
        {/* Year */}
        <div className="font-orbitron text-2xl md:text-3xl font-bold text-white/20 group-hover:text-[#e1ff51] transition-colors duration-500">
          {award.year}
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <h3 className="font-orbitron text-xl md:text-2xl font-bold text-white mb-3 tracking-tight group-hover:translate-x-2 transition-transform duration-500">
            {award.title}
          </h3>
          <p className="font-geist text-white/50 text-[10px] md:text-xs uppercase tracking-widest leading-relaxed max-w-2xl">
            {award.description}
          </p>
        </div>

        {/* Organization */}
        <div className="md:text-right flex md:flex-col justify-between md:justify-start items-center md:items-end">
           <span className="font-geist text-[9px] md:text-[10px] text-[#e1ff51] font-bold uppercase tracking-[0.4em] mb-2">
             ISSUED BY
           </span>
           <span className="font-geist text-[10px] md:text-[11px] text-white/70 uppercase tracking-widest text-right whitespace-pre-wrap">
             {award.org}
           </span>
        </div>

      </div>
    </motion.div>
  );
});

export const Awards = () => {
  const [hoveredAward, setHoveredAward] = React.useState(null);
  const [selectedAward, setSelectedAward] = React.useState(null);
  const [activeFilter, setActiveFilter] = React.useState('all');
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const xVelocity = useVelocity(mouseX);
  const rotateX = useTransform(xVelocity, [-3000, 3000], [-25, 25]);
  const springRotate = useSpring(rotateX, { damping: 20, stiffness: 150 });

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const stats = React.useMemo(() => {
    return awardsData.reduce((acc, award) => {
      const title = award.title.toUpperCase();
      if (title.includes("GOLD")) acc.gold++;
      else if (title.includes("SILVER")) acc.silver++;
      else if (title.includes("BRONZE")) acc.bronze++;
      else if (title.includes("TECHNICAL") || title.includes("TECH")) acc.technical++;
      else acc.misc++;
      return acc;
    }, { gold: 0, silver: 0, bronze: 0, technical: 0, misc: 0 });
  }, []);

  const filteredAwards = React.useMemo(() => {
    if (activeFilter === 'all') return awardsData;
    
    return awardsData.filter(award => {
      const title = award.title.toLowerCase();
      
      if (activeFilter === 'misc') {
        return !title.includes('gold') && 
               !title.includes('silver') && 
               !title.includes('bronze') && 
               !title.includes('technical') && 
               !title.includes('tech');
      }
      
      if (activeFilter === 'technical') {
        return title.includes('technical') || title.includes('tech');
      }
      
      return title.includes(activeFilter);
    });
  }, [activeFilter]);

  const toggleFilter = (filterName) => {
    setActiveFilter(prev => prev === filterName ? 'all' : filterName);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="w-full min-h-screen bg-transparent px-6 md:px-24 py-32 md:py-48 overflow-hidden selection:bg-[#e1ff51] selection:text-white relative"
    >
      
      {/* Fullscreen Certificate Modal */}
      <AnimatePresence>
        {selectedAward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAward(null)}
            className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative flex flex-col items-center justify-center gap-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative group">
                <img 
                  src={selectedAward.image} 
                  alt={selectedAward.title}
                  className="max-w-full max-h-[85vh] object-contain shadow-[0_0_100px_rgba(166,0,255,0.2)] border border-white/10 rounded-sm"
                />
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating Image Reveal */}
      <AnimatePresence>
        {hoveredAward && !selectedAward && (
          <motion.div
            key={hoveredAward.image}
            style={{
              position: 'fixed',
              left: cursorX,
              top: cursorY,
              x: 40, 
              y: 40, 
              rotate: springRotate,
              pointerEvents: 'none',
              zIndex: 100,
            }}
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 20 }}
            transition={{ type: 'spring', damping: 15, stiffness: 400, mass: 0.5 }}
          >
            <div className="relative p-1 bg-black/40 border border-white/20 rounded-lg overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
              <img 
                src={hoveredAward.image} 
                alt="Certificate Preview" 
                className="w-[200px] h-auto object-contain rounded-md"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(166,0,255,0.1)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-[20]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12 px-8 md:px-12">
          <div className="flex flex-col">
            <h1 className="font-orbitron text-[38px] md:text-[75px] lg:text-[100px] font-extrabold text-white uppercase leading-[0.9] lg:leading-[0.8] tracking-tighter">
              <ScrollLetterRevealDelayed text="HONORS &" duration={200} delay={0} />
              <br />
              <span className="text-[#e1ff51]">
                <ScrollLetterRevealDelayed text="AWARDS" duration={200} delay={100} />
              </span>
            </h1>
            
            <div className="mt-12 max-w-xl">
               <p className="font-geist text-white/40 text-xs md:text-sm uppercase tracking-[0.3em] font-medium leading-relaxed">
                 A COLLECTION OF RECOGNITIONS, ACHIEVEMENTS, AND MILESTONES THROUGHOUT MY ACADEMIC AND PROFESSIONAL ENGINEERING JOURNEY.
               </p>
            </div>
          </div>

          {/* Stats Counter */}
          <div className="flex flex-col items-center md:items-end w-full md:w-auto border-t md:border-t-0 pt-12 md:pt-0">
            <span className="font-geist text-[10px] md:text-[11px] text-[#e1ff51] font-bold uppercase tracking-[0.4em] mb-2 md:translate-y-1">FILTER BY</span>
            <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-end gap-6 md:gap-8 md:translate-y-3">
               <StatItem label="Gold" value={stats.gold} color="#FFD700" isActive={activeFilter === 'gold'} onClick={() => toggleFilter('gold')} />
               <StatItem label="Silver" value={stats.silver} color="#E5E7EB" isActive={activeFilter === 'silver'} onClick={() => toggleFilter('silver')} />
               <StatItem label="Bronze" value={stats.bronze} color="#CD7F32" isActive={activeFilter === 'bronze'} onClick={() => toggleFilter('bronze')} />
               <StatItem label="Technical" value={stats.technical} color="#e1ff51" isActive={activeFilter === 'technical'} onClick={() => toggleFilter('technical')} />
               <StatItem label="Misc" value={stats.misc} color="#ffffff" isActive={activeFilter === 'misc'} onClick={() => toggleFilter('misc')} />
            </div>
          </div>
        </div>

        {/* Awards List Section */}
        <div className="flex flex-col min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredAwards.map((award, idx) => (
              <AwardItem 
                key={`${award.title}-${award.year}-${idx}`} 
                award={award}
                idx={idx}
                onHover={setHoveredAward}
                onClick={setSelectedAward}
              />
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default Awards;
