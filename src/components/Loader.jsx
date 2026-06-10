
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import loader2Gif from "../assets/miscellaneous/loading2.gif";
import { useProgress } from "@react-three/drei";

// Exact duration of loading2.gif measured from frame data: 91 frames = 3640ms
const GIF_DURATION_MS = 3640;
// Fade starts this many ms BEFORE the loop point so it finishes exactly at the end of loop 1
const FADE_DURATION_MS = 800;

const Loader = ({ onFinish, isInitial }) => {
  const [progress, setProgress] = useState(0);
  // For initial load: track fade-out phase separately so the GIF never gets
  // interrupted mid-play. The component stays fully visible until the GIF
  // finishes, then fades out over 800ms.
  const [fadingOut, setFadingOut] = useState(false);
  const { active } = useProgress();
  const activeRef = useRef(active);
  activeRef.current = active;

  // Stable blob URL for the GIF — generated once per mount so the GIF
  // always starts from frame 1 (no browser cache mid-sequence).
  const [gifSrc, setGifSrc] = useState(null);

  useEffect(() => {
    if (!isInitial) return;

    // Fetch the GIF and turn it into a fresh object URL so the browser
    // always plays from the very first frame with no cache interference.
    let objectUrl = null;
    fetch(loader2Gif)
      .then(r => r.blob())
      .then(blob => {
        objectUrl = URL.createObjectURL(blob);
        setGifSrc(objectUrl);
      })
      .catch(() => {
        // Fallback: use the import directly
        setGifSrc(loader2Gif);
      });

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [isInitial]);

  useEffect(() => {
    if (isInitial) {
      // Wait for the GIF to fully play (exact measured duration),
      // then start the fade-out, then call onFinish after fade completes.
      const playTimer = setTimeout(() => {
        setFadingOut(true);
        // onFinish fires once the fade completes — exactly at the GIF loop boundary
        setTimeout(onFinish, FADE_DURATION_MS);
      }, GIF_DURATION_MS - FADE_DURATION_MS);

      return () => clearTimeout(playTimer);
    }

    // ── Non-initial (route-change) loader ──────────────────────────────────
    const isProjectsRoute = typeof window !== 'undefined' && window.location.pathname === '/projects';
    const minDuration = isProjectsRoute ? 1200 : 1200;

    const startTime = Date.now();
    let interval;
    let finishTimer;

    const checkFinish = () => {
      const elapsed = Date.now() - startTime;
      if (activeRef.current) { finishTimer = setTimeout(checkFinish, 100); return; }
      if (elapsed < minDuration) { finishTimer = setTimeout(checkFinish, 100); return; }
      setProgress(100);
      finishTimer = setTimeout(onFinish, 100);
    };

    interval = setInterval(() => {
      setProgress(prev => {
        if (activeRef.current) return prev < 99 ? prev + 1 : 99;
        return prev < 100 ? prev + 1 : 100;
      });
    }, minDuration / 100);

    checkFinish();
    return () => { clearTimeout(finishTimer); clearInterval(interval); };
  }, [onFinish, isInitial]);

  if (isInitial) {
    return (
      <motion.div
        animate={{ opacity: fadingOut ? 0 : 1 }}
        transition={{ duration: FADE_DURATION_MS / 1000, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] bg-black cursor-none"
        style={{ pointerEvents: fadingOut ? 'none' : 'auto' }}
      >
        {gifSrc && (
          <img
            src={gifSrc}
            alt="Loading..."
            className="w-full h-full object-cover"
            // Prevent any browser-level looping — the timeout handles timing
            style={{ imageRendering: 'auto' }}
          />
        )}
      </motion.div>
    );
  }

  // ── Route-change loader (progress bar) ──────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 flex items-center justify-center bg-black z-[9999] cursor-none"
    >
      <div className="flex flex-col items-center justify-center w-full h-full relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#e1ff51]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-baseline"
          >
            <span className="font-orbitron text-[48px] md:text-[64px] font-black text-white leading-none tracking-tighter select-none">
              {progress.toString().padStart(2, '0')}
            </span>
            <span className="font-geist text-[14px] md:text-[16px] text-[#e1ff51] font-bold ml-1 uppercase tracking-widest">
              %
            </span>
          </motion.div>

          <motion.div
            animate={{ opacity: [0, 0.4, 0, 0.2, 0], x: [0, -3, 3, -1, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 0.8 }}
            className="absolute inset-0 flex items-baseline justify-center pointer-events-none select-none mix-blend-screen"
          >
            <span className="font-orbitron text-[48px] md:text-[64px] font-black text-[#e1ff51]/30 leading-none tracking-tighter">
              {progress.toString().padStart(2, '0')}
            </span>
          </motion.div>

          <div className="mt-4 w-32 h-[1px] bg-white/5 relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-[#e1ff51] shadow-[0_0_10px_#e1ff51]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Loader;
