 import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

const TargetCursor = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true
}) => {
  const cursorRef = useRef(null);
  const cornersRef = useRef(null);
  const spinTl = useRef(null);
  const dotRef = useRef(null);

  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef(null);
  const tickerFnRef = useRef(null);
  const activeStrengthRef = useRef(0);

  const isMobile = useMemo(() => {
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12
    }),
    []
  );

  const moveCursor = useCallback((x, y) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.1,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll('.target-cursor-corner');

    let activeTarget = null;
    let currentLeaveHandler = null;
    let resumeTimeout = null;

    const cleanupTarget = target => {
      if (currentLeaveHandler && target) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    const createSpinTimeline = () => {
      // Rotation removed per user request
    };

    createSpinTimeline();

    const leaveHandler = () => {
      gsap.ticker.remove(tickerFnRef.current);
      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      gsap.set(activeStrengthRef, { current: 0, overwrite: true });

      const targetToCleanup = activeTarget;
      activeTarget = null;

      if (cornersRef.current) {
        const corners = Array.from(cornersRef.current);
        gsap.killTweensOf(corners);
        const { cornerSize } = constants;
        const positions = [
          { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
          { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
          { x: cornerSize * 0.5, y: cornerSize * 0.5 },
          { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
        ];
        const tl = gsap.timeline();
        corners.forEach((corner, index) => {
          tl.to(corner, { x: positions[index].x, y: positions[index].y, duration: 0.3, ease: 'power3.out' }, 0);
        });
      }

      resumeTimeout = setTimeout(() => {
        resumeTimeout = null;
      }, 50);

      if (targetToCleanup) {
        cleanupTarget(targetToCleanup);
      }
    };

    const tickerFn = () => {
      if (!cursorRef.current || !cornersRef.current || !activeTarget) {
        return;
      }

      if (!activeTarget.isConnected || activeTarget.offsetParent === null) {
        leaveHandler();
        return;
      }

      const rect = activeTarget.getBoundingClientRect();
      const style = window.getComputedStyle(activeTarget);
      let rotation = 0; let scaleX = 1; let scaleY = 1;
      if (style.transform && style.transform !== 'none') {
        const matrix = style.transform.match(/^matrix\((.+)\)$/);
        if (matrix) {
          const values = matrix[1].split(',').map(parseFloat);
          rotation = Math.atan2(values[1], values[0]);
          scaleX = Math.sqrt(values[0]*values[0] + values[1]*values[1]);
          scaleY = Math.sqrt(values[2]*values[2] + values[3]*values[3]);
        }
      }

      const { borderWidth, cornerSize } = constants;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const hw = (activeTarget.offsetWidth * scaleX) / 2;
      const hh = (activeTarget.offsetHeight * scaleY) / 2;

      const local_corners = [
        { x: -hw - borderWidth, y: -hh - borderWidth },
        { x: hw + borderWidth - cornerSize, y: -hh - borderWidth },
        { x: hw + borderWidth - cornerSize, y: hh + borderWidth - cornerSize },
        { x: -hw - borderWidth, y: hh + borderWidth - cornerSize }
      ];

      const cosRot = Math.cos(rotation);
      const sinRot = Math.sin(rotation);

      targetCornerPositionsRef.current = local_corners.map(c => ({
        x: cx + c.x * cosRot - c.y * sinRot,
        y: cy + c.x * sinRot + c.y * cosRot
      }));

      const strength = activeStrengthRef.current;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(cursorRef.current, 'x');
      const cursorY = gsap.getProperty(cursorRef.current, 'y');
      const corners = Array.from(cornersRef.current);
      const cosInv = Math.cos(-rotation);
      const sinInv = Math.sin(-rotation);

      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x');
        const currentY = gsap.getProperty(corner, 'y');
        
        const dx_screen = targetCornerPositionsRef.current[i].x - cursorX;
        const dy_screen = targetCornerPositionsRef.current[i].y - cursorY;
        
        const targetX = dx_screen * cosInv - dy_screen * sinInv;
        const targetY = dx_screen * sinInv + dy_screen * cosInv;
        
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;
        
        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;
        
        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration: duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto'
        });
      });
    };
    tickerFnRef.current = tickerFn;

    const moveHandler = e => moveCursor(e.clientX, e.clientY);
    window.addEventListener('pointermove', moveHandler);

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const mouseX = gsap.getProperty(cursorRef.current, 'x');
      const mouseY = gsap.getProperty(cursorRef.current, 'y');
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);
      if (!isStillOverTarget) {
        leaveHandler();
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    const mouseDownHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };

    const mouseUpHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    const enterHandler = e => {
      const directTarget = e.target;
      const allTargets = [];
      let current = directTarget;
      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          allTargets.push(current);
        }
        current = current.parentElement;
      }
      const target = allTargets[0] || null;
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;

      if (activeTarget) {
        leaveHandler();
      }

      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach(corner => gsap.killTweensOf(corner));
      gsap.killTweensOf(cursorRef.current, 'rotation');

      const style = window.getComputedStyle(target);
      let rotation = 0; let scaleX = 1; let scaleY = 1;
      if (style.transform && style.transform !== 'none') {
        const matrix = style.transform.match(/^matrix\((.+)\)$/);
        if (matrix) {
          const values = matrix[1].split(',').map(parseFloat);
          rotation = Math.atan2(values[1], values[0]);
          scaleX = Math.sqrt(values[0]*values[0] + values[1]*values[1]);
          scaleY = Math.sqrt(values[2]*values[2] + values[3]*values[3]);
        }
      }
      const rotationDeg = rotation * (180 / Math.PI);
      gsap.set(cursorRef.current, { rotation: rotationDeg, overwrite: 'auto' });

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const hw = (target.offsetWidth * scaleX) / 2;
      const hh = (target.offsetHeight * scaleY) / 2;
      const local_corners = [
        { x: -hw - borderWidth, y: -hh - borderWidth },
        { x: hw + borderWidth - cornerSize, y: -hh - borderWidth },
        { x: hw + borderWidth - cornerSize, y: hh + borderWidth - cornerSize },
        { x: -hw - borderWidth, y: hh + borderWidth - cornerSize }
      ];
      const cosRot = Math.cos(rotation);
      const sinRot = Math.sin(rotation);
      
      targetCornerPositionsRef.current = local_corners.map(c => ({
        x: cx + c.x * cosRot - c.y * sinRot,
        y: cy + c.x * sinRot + c.y * cosRot
      }));

      const cursorX = gsap.getProperty(cursorRef.current, 'x');
      const cursorY = gsap.getProperty(cursorRef.current, 'y');
      const cosInv = Math.cos(-rotation);
      const sinInv = Math.sin(-rotation);

      isActiveRef.current = true;
      gsap.ticker.add(tickerFnRef.current);

      gsap.to(activeStrengthRef, { current: 1, duration: hoverDuration, ease: 'power2.out' });

      corners.forEach((corner, i) => {
        const dx_screen = targetCornerPositionsRef.current[i].x - cursorX;
        const dy_screen = targetCornerPositionsRef.current[i].y - cursorY;
        
        gsap.to(corner, {
          x: dx_screen * cosInv - dy_screen * sinInv,
          y: dx_screen * sinInv + dy_screen * cosInv,
          duration: 0.08,
          ease: 'power2.out'
        });
      });

      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);

      const clickHandler = () => setTimeout(tickerFn, 100);
      target.addEventListener('click', clickHandler, { once: true });
    };

    window.addEventListener('mouseover', enterHandler, { passive: true });

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
      }
      window.removeEventListener('pointermove', moveHandler);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      if (activeTarget) {
        cleanupTarget(activeTarget);
      }
      if (spinTl.current) spinTl.current.kill();
      document.body.style.cursor = originalCursor;
      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current = 0;
    };
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, isMobile, hoverDuration, parallaxOn]);

  useEffect(() => {
    // Spin removed
  }, [spinDuration, isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-0 h-0 pointer-events-none z-[9999]"
      style={{ willChange: 'transform' }}
    >
      <div
        ref={dotRef}
        className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: 'transform' }}
      />
      <div
        className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-white -translate-x-[150%] -translate-y-[150%] border-r-0 border-b-0"
        style={{ willChange: 'transform' }}
      />
      <div
        className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-white translate-x-1/2 -translate-y-[150%] border-l-0 border-b-0"
        style={{ willChange: 'transform' }}
      />
      <div
        className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-white translate-x-1/2 translate-y-1/2 border-l-0 border-t-0"
        style={{ willChange: 'transform' }}
      />
      <div
        className="target-cursor-corner absolute top-1/2 left-1/2 w-3 h-3 border-[3px] border-white -translate-x-[150%] translate-y-1/2 border-r-0 border-t-0"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};

export default TargetCursor;
