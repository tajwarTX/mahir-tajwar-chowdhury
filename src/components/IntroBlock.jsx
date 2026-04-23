import { useState, useEffect } from "react";
import ScrollLetterRevealDelayed from "./ScrollLetterRevealDelayed";

const IntroBlock = ({ className = "" }) => {
  const [geoData, setGeoData] = useState({
    city: "FETCHING...",
    country: "LOCATING...",
    lat: null,
    lon: null,
    timezone: "UTC",
    ip: "CONNECTING..."
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
  const [localTime, setLocalTime] = useState("");
  const [gmtOffset, setGmtOffset] = useState("GMT");

  useEffect(() => {

    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
      });
      setLocalTime(formatted);

      const rawOffset = -now.getTimezoneOffset(); 
      const absH = Math.floor(Math.abs(rawOffset) / 60);
      const absM = Math.abs(rawOffset) % 60;
      const sign = rawOffset >= 0 ? "+" : "-";
      const formattedGMT = `GMT${sign}${String(absH).padStart(2, "0")}:${String(absM).padStart(2, "0")}`;
      setGmtOffset(formattedGMT);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const applyGeo = (city, country, lat, lon, ip) => {
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      const validCoords = !isNaN(latNum) && !isNaN(lonNum);
      setGeoData({
        city: city || "UNKNOWN",
        country: country || "UNKNOWN",
        lat: validCoords ? latNum.toFixed(2) : null,
        lon: validCoords ? lonNum.toFixed(2) : null,
        timezone: "LOCAL_TIME",
        ip: ip || "N/A",
      });
      return validCoords; 
    };

    fetch("https://ipinfo.io/json", { method: "GET" })
      .then(r => r.json())
      .then(d => {
        const [lat, lon] = (d.loc || "").split(",");
        const ok = applyGeo(d.city, d.country, lat, lon, d.ip);
        if (!ok) throw new Error("no coords");
      })
      .catch(() =>

        fetch("https://freeipapi.com/api/json", { method: "GET" })
          .then(r => r.json())
          .then(d => {
            const ok = applyGeo(d.cityName, d.countryName, d.latitude, d.longitude, d.ipAddress);
            if (!ok) throw new Error("no coords");
          })
          .catch(() =>

            fetch("https://ipapi.co/json/", { method: "GET" })
              .then(r => r.json())
              .then(d => applyGeo(d.city, d.country_name, d.latitude, d.longitude, d.ip))
              .catch(() => {

                fetch("https://api.ipify.org?format=json", { method: "GET" })
                  .then(r => r.json())
                  .then(d => {
                    setGeoData(prev => ({
                      ...prev,
                      city: "LOCATION",
                      country: "BLOCKED",
                      lat: null,
                      lon: null,
                      timezone: "LOCAL_TIME",
                      ip: d.ip,
                    }));
                  })
                  .catch(() => {

                    setGeoData(prev => ({
                      ...prev,
                      city: "LOCATION",
                      country: "BLOCKED",
                      lat: null,
                      lon: null,
                      timezone: "LOCAL_TIME",
                      ip: "N/A",
                    }));
                  });
              })
          )
      );
  }, []);

  const nextFirst = () =>
    setFirstIndex((prev) => (prev + 1) % firstNames.length);

  const nextLast = () =>
    setLastIndex((prev) => (prev + 1) % lastNames.length);

  return (
    <div className={`flex flex-col items-center justify-center text-center text-white ${className}`}>

      <div className="flex items-center gap-4 mb-8 opacity-40">
         <span className="font-geist text-[8px] md:text-[9px] uppercase tracking-[0.4em] whitespace-nowrap">
           {localTime || "SYNCING..."} {gmtOffset}
         </span>
         <div className="w-[1px] h-3 bg-white/30" />
         <span className="font-geist text-[8px] md:text-[9px] uppercase tracking-[0.4em] whitespace-nowrap">
           {geoData.lat === null ? "SYNCING..." : `${Math.abs(geoData.lat)}° ${geoData.lat >= 0 ? 'N' : 'S'}`} 
         </span>
         <div className="w-[1px] h-3 bg-white/30" />
         <span className="font-geist text-[8px] md:text-[9px] uppercase tracking-[0.4em] whitespace-nowrap">
           {geoData.lon === null ? "SYNCING..." : `${Math.abs(geoData.lon)}° ${geoData.lon >= 0 ? 'E' : 'W'}`} 
         </span>
      </div>

      <ScrollLetterRevealDelayed
        text="HEY _ I AM _"
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

      <div className="mt-10 flex flex-col items-center gap-2 opacity-50">
         <span className="font-geist text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-bold">
           {geoData.city} 
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