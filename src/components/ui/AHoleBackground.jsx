import React, { useEffect, useRef } from 'react';

const AHoleBackground = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let discs = [];
    let lines = [];
    let particles = [];
    let linesCanvas = null;
    let linesCtx = null;
    let clip = {};
    let rect = {};
    let render = {};
    let particleArea = {};

    // Easing function - simple easeInExpo
    const easeInExpo = (t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1));

    const setSize = () => {
      rect = container.getBoundingClientRect();
      
      render = {
        width: rect.width,
        height: rect.height,
        dpi: window.devicePixelRatio || 1
      };

      canvas.width = render.width * render.dpi;
      canvas.height = render.height * render.dpi;
      canvas.style.width = `${render.width}px`;
      canvas.style.height = `${render.height}px`;
    };

    const tweenValue = (start, end, p, ease = false) => {
      const delta = end - start;
      const easeFn = ease === 'inExpo' ? easeInExpo : (t) => t;
      return start + delta * easeFn(p);
    };

    const tweenDisc = (disc) => {
      const startDisc = {
        x: rect.width * 0.5,
        y: rect.height * 0.45,
        w: rect.width * 0.75,
        h: rect.height * 0.7
      };

      const endDisc = {
        x: rect.width * 0.5,
        y: rect.height * 0.95,
        w: 0,
        h: 0
      };

      disc.x = tweenValue(startDisc.x, endDisc.x, disc.p);
      disc.y = tweenValue(startDisc.y, endDisc.y, disc.p, 'inExpo');
      disc.w = tweenValue(startDisc.w, endDisc.w, disc.p);
      disc.h = tweenValue(startDisc.h, endDisc.h, disc.p);

      return disc;
    };

    const setDiscs = () => {
      const { width, height } = rect;
      discs = [];

      const startDisc = {
        x: width * 0.5,
        y: height * 0.45,
        w: width * 0.75,
        h: height * 0.7
      };

      const totalDiscs = 100;
      let prevBottom = height;

      for (let i = 0; i < totalDiscs; i++) {
        const p = i / totalDiscs;
        const disc = { p };
        tweenDisc(disc);

        const bottom = disc.y + disc.h;

        if (bottom <= prevBottom) {
          clip = {
            disc: { ...disc },
            i
          };
        }

        prevBottom = bottom;
        discs.push(disc);
      }

      // Create clip path
      clip.path = new Path2D();
      clip.path.ellipse(
        clip.disc.x,
        clip.disc.y,
        clip.disc.w,
        clip.disc.h,
        0,
        0,
        Math.PI * 2
      );
      clip.path.rect(
        clip.disc.x - clip.disc.w,
        0,
        clip.disc.w * 2,
        clip.disc.y
      );
    };

    const setLines = () => {
      const { width, height } = rect;
      lines = [];

      const totalLines = 100;
      const linesAngle = (Math.PI * 2) / totalLines;

      for (let i = 0; i < totalLines; i++) {
        lines.push([]);
      }

      discs.forEach((disc) => {
        for (let i = 0; i < totalLines; i++) {
          const angle = i * linesAngle;
          const p = {
            x: disc.x + Math.cos(angle) * disc.w,
            y: disc.y + Math.sin(angle) * disc.h
          };
          lines[i].push(p);
        }
      });

      // Create lines canvas
      if (typeof OffscreenCanvas !== 'undefined') {
        linesCanvas = new OffscreenCanvas(width, height);
      } else {
        // Fallback for browsers that don't support OffscreenCanvas
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = width;
        fallbackCanvas.height = height;
        linesCanvas = fallbackCanvas;
      }
      
      linesCtx = linesCanvas.getContext('2d');

      lines.forEach((line) => {
        linesCtx.save();
        let lineIsIn = false;
        
        line.forEach((p1, j) => {
          if (j === 0) return;
          
          const p0 = line[j - 1];
          
          if (!lineIsIn && linesCtx.isPointInPath && linesCtx.isPointInPath(clip.path, p1.x, p1.y)) {
            lineIsIn = true;
          } else if (lineIsIn) {
            linesCtx.clip(clip.path);
          }

          linesCtx.beginPath();
          linesCtx.moveTo(p0.x, p0.y);
          linesCtx.lineTo(p1.x, p1.y);
          linesCtx.strokeStyle = '#444';
          linesCtx.lineWidth = 2;
          linesCtx.stroke();
          linesCtx.closePath();
        });
        
        linesCtx.restore();
      });
    };

    const initParticle = (start = false) => {
      const sx = particleArea.sx + particleArea.sw * Math.random();
      const ex = particleArea.ex + particleArea.ew * Math.random();
      const dx = ex - sx;
      const y = start ? particleArea.h * Math.random() : particleArea.h;
      const r = 0.5 + Math.random() * 4;
      const vy = 0.5 + Math.random();

      return {
        x: sx,
        sx,
        dx,
        y,
        vy,
        p: 0,
        r,
        c: `rgba(255, 255, 255, ${Math.random()})`
      };
    };

    const setParticles = () => {
      const { width, height } = rect;
      particles = [];

      particleArea = {
        sw: clip.disc.w * 0.5,
        ew: clip.disc.w * 2,
        h: height * 0.85
      };
      particleArea.sx = (width - particleArea.sw) / 2;
      particleArea.ex = (width - particleArea.ew) / 2;

      const totalParticles = 100;

      for (let i = 0; i < totalParticles; i++) {
        const particle = initParticle(true);
        particles.push(particle);
      }
    };

    const drawDiscs = () => {
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 2;

      // Outer disc
      const outerDisc = {
        x: rect.width * 0.5,
        y: rect.height * 0.45,
        w: rect.width * 0.75,
        h: rect.height * 0.7
      };

      ctx.beginPath();
      ctx.ellipse(outerDisc.x, outerDisc.y, outerDisc.w, outerDisc.h, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();

      // Inner discs
      discs.forEach((disc, i) => {
        if (i % 5 !== 0) return;

        if (disc.w < clip.disc.w - 5) {
          ctx.save();
          ctx.clip(clip.path);
        }

        ctx.beginPath();
        ctx.ellipse(disc.x, disc.y, disc.w, disc.h, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();

        if (disc.w < clip.disc.w - 5) {
          ctx.restore();
        }
      });
    };

    const drawLines = () => {
      if (linesCanvas) {
        ctx.drawImage(linesCanvas, 0, 0);
      }
    };

    const drawParticles = () => {
      ctx.save();
      ctx.clip(clip.path);

      particles.forEach((particle) => {
        ctx.fillStyle = particle.c;
        ctx.beginPath();
        ctx.rect(particle.x, particle.y, particle.r, particle.r);
        ctx.closePath();
        ctx.fill();
      });

      ctx.restore();
    };

    const moveDiscs = () => {
      discs.forEach((disc) => {
        disc.p = (disc.p + 0.0005) % 1; // 心跳般的慢节奏
        tweenDisc(disc);
      });
    };

    const moveParticles = () => {
      particles.forEach((particle) => {
        particle.p = 1 - particle.y / particleArea.h;
        particle.x = particle.sx + particle.dx * particle.p;
        particle.y -= particle.vy * 0.3; // 缓慢的粒子移动，配合心跳节奏

        if (particle.y < 0) {
          const newParticle = initParticle();
          particle.y = newParticle.y;
        }
      });
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.scale(render.dpi, render.dpi);

      moveDiscs();
      moveParticles();

      drawDiscs();
      drawLines();
      drawParticles();

      ctx.restore();

      animationRef.current = requestAnimationFrame(tick);
    };

    const init = () => {
      setSize();
      setDiscs();
      setLines();
      setParticles();
      tick();
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    init();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        background: '#141414'
      }}
    >
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* Aura effect */}
      <div 
        className="absolute pointer-events-none"
        style={{
          top: '-71.5%',
          left: '50%',
          width: '30%',
          height: '140%',
          background: `linear-gradient(
            20deg,
            #00f8f1,
            #ffbd1e20 16.5%,
            #fe848f 33%,
            #fe848f20 49.5%,
            #00f8f1 66%,
            #00f8f160 85.5%,
            #ffbd1e 100%
          ) 0 100% / 100% 200%`,
          borderRadius: '0 0 100% 100%',
          filter: 'blur(50px)',
          mixBlendMode: 'plus-lighter',
          opacity: 0.75,
          transform: 'translate3d(-50%, 0, 0)',
          animation: 'aura-glow 8s infinite ease-in-out', // 更慢的心跳节奏光晕
          zIndex: 3
        }}
      />

      {/* Before pseudo element effect */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          width: '150%',
          height: '140%',
          background: 'radial-gradient(ellipse at 50% 55%, transparent 10%, black 50%)',
          transform: 'translate3d(-50%, -50%, 0)',
          zIndex: 2
        }}
      />

      {/* After pseudo element effect */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(ellipse at 50% 75%, #a900ff 20%, transparent 75%)',
          mixBlendMode: 'overlay',
          transform: 'translate3d(-50%, -50%, 0)',
          zIndex: 5
        }}
      />

      {/* Overlay effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            transparent,
            transparent 1px,
            white 1px,
            white 2px
          )`,
          mixBlendMode: 'overlay',
          opacity: 0.5,
          zIndex: 10
        }}
      />

      <style jsx>{`
        @keyframes aura-glow {
          0% {
            background-position: 0 100%;
          }
          100% {
            background-position: 0 300%;
          }
        }
      `}</style>
    </div>
  );
};

export default AHoleBackground;