import { useEffect, useState, useRef } from "react";

const ScrollLetterRevealDelayed = ({ text, duration = 2000, delay = 800, className = "", style = {} }) => {
  const [visibleLetters, setVisibleLetters] = useState([]);
  const containerRef = useRef();
  const letters = text.split("");
  const timeoutRef = useRef(null);

  useEffect(() => {
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
      { threshold: 0.1 } // triggers when at least 10% visible
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, duration, delay]);

  const revealLettersRandomly = () => {
    const delays = letters.map(() => Math.random() * duration);
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const updated = letters.map((_, i) =>
        elapsed >= delays[i]
      );
      setVisibleLetters(updated);

      if (updated.some((v) => !v)) {
        requestAnimationFrame(tick);
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