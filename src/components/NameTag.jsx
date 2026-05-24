import React, { useState } from 'react';
import ScrollLetterRevealDelayed from './ScrollLetterRevealDelayed';
import shohidFontUrl from '../assets/Fonts/Li Shohid Tahmid Tamin ANSI V2 Italic.ttf';

const firstNames = [
  { text: 'Mahir Tajwar', font: 'rock-salt-regular', dir: 'ltr', customClasses: 'text-[32px] md:text-[44px] -rotate-2 -mt-[6px] md:-mt-2 font-bold' },
  { text: 'gvwni ZvRIqvi', font: 'font-shohid', dir: 'ltr', customClasses: 'text-[42px] md:text-[58px] -rotate-2 -mt-5 font-normal' },
  { text: '马希尔·塔杰瓦尔', font: 'font-zcool', dir: 'ltr', customClasses: 'text-[36px] md:text-[48px] -rotate-2 -mt-5 font-bold' },
  { text: 'ماهير تاجوار', font: 'font-lemonada', dir: 'rtl', customClasses: 'text-[36px] md:text-[48px] -rotate-2 -mt-5 font-medium' },
  { text: 'माहिर ताजवार', font: 'font-kalam', dir: 'ltr', customClasses: 'text-[32px] md:text-[55px] -rotate-2 mt-0 font-bold' },
  { text: 'マヒル・タジュワル', font: 'font-rocknroll', dir: 'ltr', customClasses: 'text-[28px] md:text-[43px] -rotate-2 -mt-5 font-bold' }
];

const lastNames = [
  { text: 'Chowdhury', font: 'rock-salt-regular', dir: 'ltr', customClasses: 'text-[32px] md:text-[44px] -rotate-2 mt-1 md:mt-2 font-bold' },
  { text: '†PŠayix', font: 'font-shohid', dir: 'ltr', customClasses: 'text-[42px] md:text-[58px] -rotate-2 mt-0 font-normal' },
  { text: '乔杜里', font: 'font-zcool', dir: 'ltr', customClasses: 'text-[36px] md:text-[48px] -rotate-2 -mt-1 font-bold' },
  { text: 'تشودري', font: 'font-lemonada', dir: 'rtl', customClasses: 'text-[36px] md:text-[48px] -rotate-2 mt-0 font-medium' },
  { text: 'चौधरी', font: 'font-kalam', dir: 'ltr', customClasses: 'text-[32px] md:text-[55px] -rotate-2 mt-0 font-bold' },
  { text: 'チョウドゥリー', font: 'font-rocknroll', dir: 'ltr', customClasses: 'text-[28px] md:text-[43px] -rotate-2 mt-0 font-bold' }
];

export default function NameTag({ name = '' }) {
  const [firstIndex, setFirstIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);

  const nextFirst = (e) => {
    e.stopPropagation();
    setFirstIndex((prev) => (prev + 1) % firstNames.length);
  };

  const nextLast = (e) => {
    e.stopPropagation();
    setLastIndex((prev) => (prev + 1) % lastNames.length);
  };

  const handleCardClick = () => {
    setFirstIndex((prev) => (prev + 1) % firstNames.length);
    setLastIndex((prev) => (prev + 1) % lastNames.length);
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Atma:wght@400;500;600;700&family=Kalam:wght@400;700&family=Lemonada:wght@400;700&family=Rock+Salt&family=RocknRoll+One&family=ZCOOL+KuaiLe&display=swap');
          
          @font-face {
            font-family: 'LiShohidTahmid';
            src: url('${shohidFontUrl}') format('truetype');
            font-display: swap;
          }

          .rock-salt-regular {
            font-family: "Rock Salt", cursive;
            font-weight: 400;
            font-style: normal;
            -webkit-text-stroke: 1.2px currentColor;
          }
          .font-shohid {
            font-family: 'LiShohidTahmid', sans-serif;
          }
          .font-zcool {
            font-family: "ZCOOL KuaiLe", sans-serif;
            font-weight: 400;
            font-style: normal;
          }
          .font-kalam {
            font-family: 'Kalam', cursive;
          }
          .font-rocknroll {
            font-family: 'RocknRoll One', sans-serif;
          }
          .font-lemonada {
            font-family: 'Lemonada', cursive;
            -webkit-text-stroke: 1.5px currentColor;
          }

          /* Peeling Curled Sticker Effect */
          .curled-sticker::before, .curled-sticker::after {
            content: "";
            position: absolute;
            z-index: -1;
            bottom: 15px;
            left: 10px;
            width: 45%;
            height: 20%;
            box-shadow: 0 18px 15px rgba(0,0,0,0.35);
            transform: rotate(-4deg);
            transition: all 0.4s ease-out;
          }
          .curled-sticker::after {
            transform: rotate(4deg);
            right: 10px;
            left: auto;
          }
          .curled-sticker:hover::before {
            transform: rotate(-6deg);
            box-shadow: 0 22px 18px rgba(0,0,0,0.4);
            bottom: 18px;
          }
          .curled-sticker:hover::after {
            transform: rotate(6deg);
            box-shadow: 0 22px 18px rgba(0,0,0,0.4);
            bottom: 18px;
          }

          /* Fabric Wrinkles & Folds Overlay */
          .fabric-texture::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 50;
            pointer-events: none;
            /* Creases and fabric shadows - Removed the leftmost 15% fold, kept the other two */
            background: 
              linear-gradient(108deg, transparent 48%, rgba(0,0,0,0.12) 50%, rgba(255,255,255,0.2) 52%, transparent 54%),
              linear-gradient(125deg, transparent 75%, rgba(0,0,0,0.18) 77%, transparent 79%),
              linear-gradient(60deg, rgba(0,0,0,0.06) 0%, transparent 30%, rgba(255,255,255,0.15) 70%, rgba(0,0,0,0.1) 100%),
              /* Crumpled / Twisted Surface texture */
              url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='crumple'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015' numOctaves='5' result='noise'/%3E%3CfeDiffuseLighting in='noise' lighting-color='%23ffffff' surfaceScale='3.5'%3E%3CfeDistantLight azimuth='45' elevation='55'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23crumple)' opacity='0.65'/%3E%3C/svg%3E");
            mix-blend-mode: multiply;
          }
        `}
      </style>

      {/* SVG definition for organic edge displacement (fabric warping) */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <filter id="fabric-warp" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.015" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="mt-6 flex justify-center z-10">
        {/* Relative wrapper so arrow anchors to the card, rotated hastily like a slapped sticker */}
        <div 
          className="curled-sticker cursor-target transition-transform duration-500 ease-out hover:scale-[1.01] hover:rotate-[-2deg]"
          style={{ position: 'relative', display: 'inline-block', transform: 'rotate(-3deg)' }}
        >
          <div
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
            className="fabric-texture w-[320px] md:w-[420px] bg-white relative cursor-pointer overflow-hidden"
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.2)',
              filter: 'url(#fabric-warp)'
            }}
            aria-label="Name tag — tap to switch language"
          >
            {/* The red top header, now cleanly cropped by the white border */}
            <div className="bg-red-600 text-white text-center py-4 px-8 relative z-10">
              <div style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', letterSpacing: '1px', fontSize: '36px', lineHeight: 0.9, fontWeight: 600 }}>HELLO</div>
              <div style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontSize: '20px', marginTop: 2, lineHeight: 1, fontWeight: 400 }}>my name is</div>
            </div>
            {/* Bottom red strip */}
            <div className="absolute bottom-0 left-0 w-full bg-red-600 z-10" style={{ height: 26 }} />
            
            <div className="px-2 md:px-4 h-[115px] md:h-[142px] flex flex-col items-center justify-center relative z-20 pointer-events-none">
              <div 
                dir={firstNames[firstIndex].dir}
                className={`text-black text-center tracking-tight w-full opacity-90 transform ${firstNames[firstIndex].customClasses} ${firstNames[firstIndex].font}`} 
                style={{ lineHeight: 1.1 }}
              >
                <div key={`first-${firstIndex}`}>
                  <ScrollLetterRevealDelayed text={firstNames[firstIndex].text} duration={600} delay={0} />
                </div>
              </div>

              <div 
                dir={lastNames[lastIndex].dir}
                className={`text-black text-center tracking-tight w-full opacity-90 transform ${lastNames[lastIndex].customClasses} ${lastNames[lastIndex].font}`} 
                style={{ lineHeight: 1.1 }}
              >
                <div key={`last-${lastIndex}`}>
                  <ScrollLetterRevealDelayed text={lastNames[lastIndex].text} duration={600} delay={0} />
                </div>
              </div>
            </div>
          </div>

          {/* Half-circle dashed arrow: starts at bottom red section, curves down and points left under the card */}
          <svg
            style={{
              position: 'absolute',
              bottom: '-30px',     /* Positions the bottom of the SVG 30px below the card */
              right: '-60px',      /* Shifts SVG to overlap the right edge */
              overflow: 'visible',
              pointerEvents: 'none',
              opacity: 0.6,        /* Makes it feel like it's written on the mat */
            }}
            width="120"
            height="100"
            viewBox="0 0 120 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Half-circle arc with a small straight line extension, starting lower down on the side */}
            <path
              d="M 60 15 A 45 45 0 0 1 60 105 L 35 105"
              stroke="white"
              strokeWidth="2.2"
              strokeDasharray="6 5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Arrowhead pointing Left at (35, 105) */}
            <path
              d="M 35 105 L 45 97 M 35 105 L 45 113"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Text prompt next to arrowhead */}
            <text
              x="25"
              y="109"
              fill="white"
              fontSize="14"
              fontFamily="Helvetica Neue, Arial, sans-serif"
              fontWeight="500"
              letterSpacing="0.5"
              textAnchor="end"
            >
              tap to switch languages
            </text>
          </svg>
        </div>
      </div>

    </>
  );
}
