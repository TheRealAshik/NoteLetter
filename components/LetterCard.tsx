import React, { useRef, useMemo, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

// --- Types & Constants ---
interface LetterContent {
  greeting: string;
  paragraphs: string[];
  closing: string;
  signature: string;
  label: string;
}

const CONTENT: Record<'en' | 'bn', LetterContent> = {
  en: {
    label: "Memento",
    greeting: "Dear AP,",
    paragraphs: [
      "It's been one of the greatest days of my life. Thanks for so much love and hospitality.",
      "I’m still smiling thinking about everything we did today—you truly went above and beyond to make me feel welcome.",
      "I’m heading home with a full heart and some incredible memories. Let’s not wait so long to do this again!"
    ],
    closing: "With gratitude,",
    signature: "Ashik"
  },
  bn: {
    label: "স্মৃতি",
    greeting: "প্রিয় এপি,",
    paragraphs: [
      "দিনটি আমার জীবনের অন্যতম সেরা দিন ছিল। তোমার ভালোবাসা এবং আতিথেয়তার জন্য অসংখ্য ধন্যবাদ।",
      "আজ আমরা যা যা করেছি তা ভেবে আমি এখনও হাসছি—আমাকে স্বাগত জানাতে তুমি সত্যিই অনেক কিছু করেছ।",
      "আমি পূর্ণ হৃদয় এবং কিছু চমৎকার স্মৃতি নিয়ে বাড়ি ফিরছি। চলো শীঘ্রই আবার দেখা করি!",
    ],
    closing: "শুভকামনায়,",
    signature: "আশিক"
  }
};

// --- Sub-components ---

const WritingText = React.memo(({ text, className, delay = 0, lang, direction = 'up' }: { 
  text: string, 
  className?: string, 
  delay?: number, 
  lang: 'en' | 'bn',
  direction?: 'up' | 'down' 
}) => {
  const letters = useMemo(() => Array.from(text), [text]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.012,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: { 
      opacity: 0, 
      y: direction === 'up' ? 4 : -4, // Reduced movement
      filter: 'blur(2px)', // Reduced blur significantly from 8px
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.35,
        ease: [0.215, 0.61, 0.355, 1]
      },
    },
  };

  return (
    <motion.div
      key={text}
      className={`flex flex-wrap ${className} ${lang === 'bn' ? 'font-bangla leading-relaxed' : ''}`}
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ transform: 'translateZ(0)' }}
    >
      {letters.map((letter, index) => (
        <motion.span 
          key={index} 
          variants={child} 
          className="whitespace-pre inline-block"
          style={{ willChange: 'transform, opacity, filter' }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
});

const BlurParagraph = React.memo(({ text, delay = 0, lang }: { 
  text: string, 
  delay?: number, 
  lang: 'en' | 'bn' 
}) => (
  <div className={`text-lg md:text-xl leading-relaxed text-slate-800/90 ${lang === 'bn' ? 'font-bangla' : 'font-serif font-light'}`}>
    <WritingText text={text} delay={delay} lang={lang} direction="down" />
  </div>
));

const WaxSeal = ({ onClick, language }: { onClick: () => void, language: 'en' | 'bn' }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05, rotate: 10 }}
    whileTap={{ scale: 0.95 }}
    style={{ transform: "translateZ(100px)" }}
    className="absolute bottom-8 left-8 z-50 w-14 h-14 md:w-18 md:h-18 group"
  >
    <div className="relative w-full h-full flex items-center justify-center bg-[#b91c1c] rounded-full shadow-lg border border-red-900/20 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leather.png')]" />
      <AnimatePresence mode="wait">
        <motion.div
          key={language}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="text-white text-xl md:text-2xl font-serif font-bold select-none z-10"
        >
          {language === 'en' ? 'অ' : 'A'}
        </motion.div>
      </AnimatePresence>
    </div>
  </motion.button>
);

// --- Main Component ---

interface LetterCardProps {
  language: 'en' | 'bn';
  onToggleLanguage: () => void;
}

const LetterCard: React.FC<LetterCardProps> = ({ language, onToggleLanguage }) => {
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 80, damping: 25 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["5deg", "-5deg"]); // Reduced rotation for clarity
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-5deg", "5deg"]);
  
  const currentContent = CONTENT[language];

  useEffect(() => {
    const unsubscribeX = springX.on("change", (v) => {
      if (cardRef.current) cardRef.current.style.setProperty('--lx', `${(v + 0.5) * 100}%`);
    });
    const unsubscribeY = springY.on("change", (v) => {
      if (cardRef.current) cardRef.current.style.setProperty('--ly', `${(v + 0.5) * 100}%`);
    });
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [springX, springY]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 perspective-[2000px]">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative max-w-2xl w-full bg-[#fcfaf7] shadow-xl rounded-lg p-10 md:p-16 border border-white/60 cursor-default"
      >
        {/* Subtle Lighting layer */}
        <div 
          ref={cardRef}
          style={{ 
            background: `radial-gradient(circle at var(--lx, 50%) var(--ly, 50%), rgba(255,255,255,0.3) 0%, transparent 60%)`,
            pointerEvents: 'none',
            '--lx': '50%',
            '--ly': '50%'
          } as React.CSSProperties}
          className="absolute inset-0 z-20 rounded-lg opacity-30 mix-blend-soft-light will-change-[background]"
        />

        <WaxSeal onClick={onToggleLanguage} language={language} />

        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/creampaper.png')] rounded-lg z-30" />
        
        <div className="relative z-40 text-slate-800" style={{ transform: "translateZ(30px)" }}>
          <header className="mb-10">
             <motion.div 
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-indigo-900/40 mb-3"
             >
                <Sparkles size={14} />
                <span className={`text-[10px] uppercase tracking-[0.4em] font-sans font-bold ${language === 'bn' ? 'font-bangla tracking-[0.2em]' : ''}`}>
                  {currentContent.label}
                </span>
             </motion.div>
             
             <div className={`text-4xl md:text-5xl text-indigo-950 ${language === 'bn' ? 'font-bangla font-semibold' : 'font-script'}`}>
               <WritingText text={currentContent.greeting} delay={0.5} lang={language} />
             </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div 
              key={language} 
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {currentContent.paragraphs.map((text, idx) => (
                <BlurParagraph key={idx} text={text} delay={0.8 + idx * 0.2} lang={language} />
              ))}
            </motion.div>
          </AnimatePresence>

          <footer className="mt-16 flex flex-col items-end">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 }}
              className={`italic text-slate-500 mb-2 mr-6 text-sm ${language === 'bn' ? 'font-bangla' : 'font-serif font-light'}`}
            >
              {currentContent.closing}
            </motion.span>
            
            <div className={`text-4xl md:text-5xl text-indigo-950 pr-2 ${language === 'bn' ? 'font-bangla font-semibold' : 'font-script'}`}>
              <WritingText text={currentContent.signature} delay={2.4} lang={language} />
            </div>
          </footer>
        </div>

        <div 
          style={{ transform: "translateZ(40px)" }}
          className="absolute top-8 right-8 text-rose-500/5 pointer-events-none"
        >
           <motion.div
             animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
           >
             <Heart size={100} fill="currentColor" />
           </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LetterCard;