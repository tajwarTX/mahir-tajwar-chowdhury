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
    <div
      className={`flex flex-col items-center justify-center text-center text-white ${className}`}
      style={{ gap: '0 em' }} // consistent gap that scales with text
    >
      {/* Intro Text */}
      <ScrollLetterRevealDelayed
        text="HEY _ I AM _"
        duration={600}
        delay={300}
        className="block text-base sm:text-lg font-geist"
      />

      {/* First Name */}
      <button
        onClick={nextFirst}
        dir={firstNames[firstIndex].dir}
        className="cursor-target px-2 sm:px-4 w-fit"
        style={{ lineHeight: 1 }}
      >
        <div
          key={firstIndex}
          className="transition-transform duration-500 ease-in-out"
        >
          <ScrollLetterRevealDelayed
            text={firstNames[firstIndex].text}
            duration={600}
            delay={0}
            className={`block font-bold ${firstNames[firstIndex].font}`}
            style={{
              fontSize: 'clamp(2rem, 8vw, 4rem)', // scales between 2rem and 4rem depending on viewport width
            }}
          />
        </div>
      </button>

      {/* Last Name */}
      <div
        onClick={nextLast}
        dir={lastNames[lastIndex].dir}
        className="cursor-target px-2 sm:px-4 w-fit"
        style={{ lineHeight: 1.2 }}
      >
        <div
          key={lastIndex}
          className="transition-transform duration-500 ease-in-out"
        >
          <ScrollLetterRevealDelayed
            text={lastNames[lastIndex].text}
            duration={600}
            delay={0}
            className={`block font-bold ${lastNames[lastIndex].font} font-outline`}
            style={{
              fontSize: 'clamp(1.5rem, 6vw, 3rem)', // proportional scaling to first name
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default IntroBlock;