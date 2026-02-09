import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ParticleProps } from '../types.ts';

const Background: React.FC = () => {
  const [particles, setParticles] = useState<ParticleProps[]>([]);

  useEffect(() => {
    const particleCount = 20;
    const newParticles: ParticleProps[] = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * -20,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#faf9f6]">
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translate(40px, -120px); opacity: 0; }
        }
        .particle {
          will-change: transform, opacity;
          animation: float var(--dur) infinite linear;
          animation-delay: var(--delay);
        }
      `}</style>
      
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-100/20 via-sky-50/10 to-indigo-100/20" />
      
      <motion.div 
        initial={{ opacity: 0.2 }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-200/10 rounded-full blur-[60px] pointer-events-none" 
      />

      {particles.map((p) => (
        <div
          key={p.id}
          className="particle absolute rounded-full bg-white/40 mix-blend-overlay pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            filter: `blur(${p.size / 3}px)`, // Reduced particle blur
            '--dur': `${p.duration}s`,
            '--delay': `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
      
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
    </div>
  );
};

export default React.memo(Background);