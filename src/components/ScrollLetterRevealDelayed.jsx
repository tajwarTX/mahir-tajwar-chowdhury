import { useEffect, useRef } from "react";

const ScrollLetterRevealDelayed = ({ text, duration = 2000, delay = 800, className = "", style = {} }) => {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  const timeoutRef = useRef(null);
  const reqRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutRef.current = setTimeout(() => {
            revealLettersRandomly();
          }, delay);
        } else {
          clearTimeout(timeoutRef.current);
          if (reqRef.current) cancelAnimationFrame(reqRef.current);
          lettersRef.current.forEach(span => {
            if (span) span.style.opacity = "0";
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutRef.current);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, duration, delay]);

  const revealLettersRandomly = () => {
    const delays = Array.from({ length: text.length }).map(() => Math.random() * duration);
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      let allDone = true;
      
      lettersRef.current.forEach((span, i) => {
        if (!span) return;
        if (elapsed >= delays[i]) {
          span.style.opacity = "1";
        } else {
          allDone = false;
        }
      });

      if (!allDone) {
        reqRef.current = requestAnimationFrame(tick);
      }
    };

    reqRef.current = requestAnimationFrame(tick);
  };

  const letters = text.split("");

  return (
    <span ref={containerRef} className={className} style={style}>
      {letters.map((letter, i) => (
        <span
          key={i}
          ref={(el) => (lettersRef.current[i] = el)}
          style={{
            opacity: 0,
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