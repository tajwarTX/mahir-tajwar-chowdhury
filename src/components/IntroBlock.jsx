import { useState, useEffect } from "react";
import ScrollLetterRevealDelayed from "./ScrollLetterRevealDelayed";

const IntroBlock = ({ className = "" }) => {
  const [geoData, setGeoData] = useState({
    city: "FETCHING...",
    country: "LOCATING...",
    lat: "0.00",
    lon: "0.00",
    timezone: "UTC"
  });

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

  useEffect(() => {
    // 1. Get accurate Timezone & GMT Offset directly from the browser (Zero-permission)
    const tzString = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offsetMinutes = new Date().getTimezoneOffset();
    const offsetHours = -offsetMinutes / 60;
    const gmtPrefix = offsetHours >= 0 ? "+" : "";
    const formattedGMT = `GMT${gmtPrefix}${offsetHours.toString().padStart(1, '0')}:00`;

    // 2. Fetch Geolocation via IP (Zero-permission)
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        setGeoData({
          city: data.city || "UNKNOWN",
          country: data.country_name || "UNKNOWN",
          lat: data.latitude?.toFixed(2) || "SECURE",
          lon: data.longitude?.toFixed(2) || "SECURE",
          timezone: formattedGMT
        });
      })
      .catch(() => {
        // High-end fallback if the API is blocked on a local or corporate network
        setGeoData(prev => ({
          ...prev,
          city: "SECURE",
          country: "ENCRYPTED",
          timezone: formattedGMT // Time info is still accurate as it's browser-native
        }));
      });
  }, []);

  const nextFirst = () =>
    setFirstIndex((prev) => (prev + 1) % firstNames.length);

  const nextLast = () =>
    setLastIndex((prev) => (prev + 1) % lastNames.length);

  return (
    <div className={`flex flex-col items-center justify-center text-center text-white ${className}`}>
      
      {/* Top Metadata Row */}
      <div className="flex items-center gap-4 mb-8 opacity-40">
         <span className="font-geist text-[8px] md:text-[9px] uppercase tracking-[0.4em] whitespace-nowrap">
           {geoData.timezone} // UTC_OFFSET
         </span>
         <div className="w-[1px] h-3 bg-white/30" />
         <span className="font-geist text-[8px] md:text-[9px] uppercase tracking-[0.4em] whitespace-nowrap">
           {isNaN(geoData.lat) ? geoData.lat : `${geoData.lat}° N`} // {isNaN(geoData.lon) ? geoData.lon : `${geoData.lon}° E`}
         </span>
      </div>

      {/* Intro Text */}
      <ScrollLetterRevealDelayed
        text="HEY _ I AM _"
        duration={600}
        delay={300}
        className="block text-[10px] md:text-xs font-geist uppercase tracking-[0.3em] font-medium mb-1 text-white"
      />

      {/* First Name with Sync Indicator */}
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

        {/* Sync Feature Indicator */}
        <div className="absolute left-full ml-4 hidden md:block pointer-events-none">
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-[1px] w-8 bg-[#a600ff]" />
            <span className="font-geist text-[8.5px] uppercase tracking-[0.3em] text-[#a600ff] font-bold whitespace-nowrap">
              TAP_TO_SWITCH_LANG
            </span>
          </div>
        </div>
      </div>

      {/* Last Name */}
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

      {/* Bottom Metadata Row */}
      <div className="mt-10 flex flex-col items-center gap-2 opacity-50">
         <span className="font-geist text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-bold">
           {geoData.city} // {geoData.country}
         </span>
         <div className="h-[1px] w-12 bg-[#a600ff]" />
         <p className="font-geist text-[8px] uppercase tracking-[0.3em] max-w-[240px] leading-relaxed">
            REAL-TIME GEOLOCATION SYNCHRONIZED WITH THE GLOBAL NETWORK FRAMEWORK.
         </p>
      </div>
    </div>
  );
};

export default IntroBlock;