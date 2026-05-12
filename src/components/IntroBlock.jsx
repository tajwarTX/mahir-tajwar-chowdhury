import { useState } from "react";
import ScrollLetterRevealDelayed from "./ScrollLetterRevealDelayed";

const IntroBlock = ({ className = "" }) => {
  const firstNames = [
    { text: "MAHIR TAJWAR", font: "font-orbitron", dir: "ltr" },
    { text: "মাহির তাজওয়ার", font: "font-bangla", dir: "ltr" },
    { text: "马希尔·塔杰瓦尔", font: "font-japanese", dir: "ltr" },
    { text: "ماهير تاجوار", font: "font-arabic", dir: "rtl" },
    { text: "माहिर ताजवार", font: "font-hindi", dir: "ltr" },
    { text: "マヒル・タジュワル", font: "font-japanese", dir: "ltr" }
  ];

  const lastNames = [
    { text: "CHOWDHURY", font: "font-orbitron", dir: "ltr" },
    { text: "চৌধুরী", font: "font-bangla", dir: "ltr" },
    { text: "乔杜里", font: "font-japanese", dir: "ltr" },
    { text: "تشودري", font: "font-arabic", dir: "rtl" },
    { text: "चौधरी", font: "font-hindi", dir: "ltr" },
    { text: "チョウドゥリー", font: "font-japanese", dir: "ltr" }
  ];

  const [firstIndex, setFirstIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);

  const nextFirst = () =>
    setFirstIndex((prev) => (prev + 1) % firstNames.length);

  const nextLast = () =>
    setLastIndex((prev) => (prev + 1) % lastNames.length);

  return (
    <div className={`flex flex-col items-center justify-center text-center text-white ${className}`}>

      <ScrollLetterRevealDelayed
        text="HI _ I AM _"
        duration={600}
        delay={300}
        className="block text-[10px] md:text-xs font-geist uppercase tracking-[0.3em] font-medium mb-1 text-white"
      />

      <div className="relative group flex items-center">
        <button
          onClick={nextFirst}
          dir={firstNames[firstIndex].dir}
          className="cursor-target px-2 sm:px-4 w-fit active:scale-95 transition-transform"
          style={{ lineHeight: 1 }}
        >
          <div key={firstIndex} className="transition-transform duration-500 ease-in-out">
            <ScrollLetterRevealDelayed
              text={firstNames[firstIndex].text}
              duration={600}
              delay={0}
              className={`block font-bold ${firstNames[firstIndex].font}`}
              style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}
            />
          </div>
        </button>

        <div className="absolute left-full ml-4 hidden md:block pointer-events-none">
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-[1px] w-8 bg-[#a600ff]" />
            <span className="font-geist text-[8.5px] uppercase tracking-[0.3em] text-[#a600ff] font-bold whitespace-nowrap">
              TAP_TO_SWITCH_LANG
            </span>
          </div>
        </div>
      </div>

      <div
        onClick={nextLast}
        dir={lastNames[lastIndex].dir}
        className="cursor-target px-2 sm:px-4 w-fit active:scale-95 transition-transform"
        style={{ lineHeight: 1.25 }}
      >
        <div key={lastIndex} className="transition-transform duration-500 ease-in-out">
          <ScrollLetterRevealDelayed
            text={lastNames[lastIndex].text}
            duration={600}
            delay={0}
            className={`block font-bold ${lastNames[lastIndex].font} text-[#a600ff]`}
            style={{ fontSize: 'clamp(1.5rem, 6vw, 3rem)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default IntroBlock;