import { useEffect, useState, useRef, useMemo } from "react";

// Detect performance tier
const getPerformanceTier = () => {
  if (typeof navigator === 'undefined') return 'high';
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 8;
  if (cores <= 2 || memory <= 2) return 'low';
  if (cores <= 4 || memory <= 4) return 'medium';
  return 'high';
};

const ScrollLetterRevealDelayed = ({ text, duration = 2000, delay = 800, className = "", style = {} }) => {
  const [visibleLetters, setVisibleLetters] = useState([]);
  const containerRef = useRef();
  const letters = text.split("");
  const timeoutRef = useRef(null);
  const performanceTier = useMemo(() => getPerformanceTier(), []);

  // On low-end devices, skip the animation and show text immediately
  useEffect(() => {
    if (performanceTier === 'low') {
      setVisibleLetters(Array(letters.length).fill(true));
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Delay before starting animation
          timeoutRef.current = setTimeout(() => {
            revealLettersRandomly();
          }, delay);
        } else {
          // If scrolled out, remove text immediately and clear timer
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
          setVisibleLetters(Array(letters.length).fill(false));
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, duration, delay, performanceTier]);

  const revealLettersRandomly = () => {
    const delays = letters.map(() => Math.random() * duration);
    const startTime = performance.now();
    const frameThrottle = performanceTier === 'low' ? 32 : 16; // 30fps vs 60fps

    const tick = (now) => {
      const elapsed = now - startTime;
      const updated = letters.map((_, i) =>
        elapsed >= delays[i]
      );
      setVisibleLetters(updated);

      if (updated.some((v) => !v)) {
        if (performanceTier === 'low') {
          setTimeout(() => requestAnimationFrame(tick), frameThrottle);
        } else {
          requestAnimationFrame(tick);
        }
      }
    };

    requestAnimationFrame(tick);
  };

  return (
  <span ref={containerRef} className={className} style={style}>
      {letters.map((letter, i) => (
        <span
          key={i}
          style={{
            opacity: visibleLetters[i] ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
};

export default ScrollLetterRevealDelayed;