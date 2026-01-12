
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SLIDES, ICONS } from './constants';
import { SlideData } from './types';
import { ChevronLeft, ChevronRight, ArrowUpRight, Sparkles, Smile, Star, Heart, Cloud, Zap, Music, Edit3, Check, Camera, RefreshCcw } from 'lucide-react';

const STORAGE_KEY = 'presentation_slides_v1';

const App: React.FC = () => {
  // Initialize slides: Try to get from LocalStorage first, otherwise use SLIDES constant
  const [slides, setSlides] = useState<SlideData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load from storage", e);
    }
    return SLIDES;
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showIntro, setShowIntro] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  // Intro duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 6500); 
    return () => clearTimeout(timer);
  }, []);

  // Save to LocalStorage whenever slides change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
  }, [slides]);

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide, slides.length]);

  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showIntro && !isEditMode) {
        if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, showIntro, isEditMode]);

  // Update handler for slide content
  const handleSlideUpdate = (field: keyof SlideData, value: any) => {
    const newSlides = [...slides];
    newSlides[currentSlide] = {
      ...newSlides[currentSlide],
      [field]: value
    };
    setSlides(newSlides);
  };

  // Reset function to clear storage and go back to defaults
  const handleReset = () => {
    if (window.confirm("Kembalikan semua slide ke pengaturan awal (Preset)? Edit Anda akan hilang.")) {
      localStorage.removeItem(STORAGE_KEY);
      setSlides(SLIDES);
      window.location.reload();
    }
  };

  const slide = slides[currentSlide];

  // Slide Transitions
  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      },
    }),
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050505] text-white selection:bg-white selection:text-black">
      
      {/* Intro Animation Overlay */}
      <AnimatePresence>
        {showIntro && <IntroOverlay accentColor={slides[0].accentColor} />}
      </AnimatePresence>

      {/* Grain Overlay */}
      <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.07] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Marquee Background */}
      <div className="absolute top-10 left-0 right-0 -z-0 opacity-10 -rotate-3 select-none pointer-events-none">
        <Marquee text={`${slide.title} • ${slide.subtitle || 'PRESENTATION'} • KARYA HEZELL • `} />
      </div>
      <div className="absolute bottom-20 left-0 right-0 -z-0 opacity-10 rotate-2 select-none pointer-events-none">
        <Marquee direction="left" text={`SOPAN SANTUN • SIKAP • HORMAT • ETIKA • `} />
      </div>

      {/* Gradient Blob Background */}
      <motion.div 
        animate={{ 
          background: `radial-gradient(circle at 50% 50%, ${slide.accentColor}44 0%, transparent 60%)`
        }}
        className="absolute inset-0 transition-colors duration-700 pointer-events-none"
      />

      {/* Floating Stickers */}
      <FloatingStickers accentColor={slide.accentColor} />

      {/* Main Content */}
      <div className="relative w-full h-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col justify-center z-10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {!showIntro && (
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full flex items-center justify-center p-2 md:p-10 overflow-y-auto md:overflow-hidden no-scrollbar"
            >
              <SlideRenderer 
                slide={slide} 
                isEditMode={isEditMode} 
                onUpdate={handleSlideUpdate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Bar (The "Dock") - REDESIGNED */}
      {!showIntro && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[95vw]"
        >
          <div className="flex items-center gap-1 md:gap-2 p-1.5 md:p-2 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
            
            {/* Edit Toggle Button */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`group w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${isEditMode ? 'bg-yellow-400 text-black' : 'hover:bg-white/10 text-white/50 hover:text-white'}`}
              title={isEditMode ? "Selesai Edit" : "Edit Teks & Foto"}
            >
              {isEditMode ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <Edit3 className="w-4 h-4 md:w-5 md:h-5" />}
            </button>

             {/* Reset Button (Only visible in edit mode) */}
             {isEditMode && (
              <button
                onClick={handleReset}
                className="group w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:bg-red-500/20 text-white/50 hover:text-red-400"
                title="Reset ke Default"
              >
                <RefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
              </button>
             )}

            <div className="h-6 md:h-8 w-[1px] bg-white/10 mx-1" />

            {/* Prev Button - Ghost Style */}
            <button 
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="group w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all disabled:opacity-20 hover:bg-white/10 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            {/* Divider */}
            <div className="h-6 md:h-8 w-[1px] bg-white/10 mx-1 md:mx-2" />

            {/* Counter - Technical Style */}
            <div className="flex flex-col items-center justify-center min-w-[60px] md:min-w-[80px]">
              <span className="font-display font-black text-lg md:text-2xl leading-none tabular-nums">
                0{currentSlide + 1}
              </span>
              <span className="text-[8px] md:text-[9px] text-white/40 font-mono tracking-[0.2em] mt-0.5 md:mt-1">
                SLIDE
              </span>
            </div>

            {/* Divider */}
            <div className="h-6 md:h-8 w-[1px] bg-white/10 mx-1 md:mx-2" />

            {/* Next Button - High Contrast */}
            <button 
              onClick={handleNext}
              disabled={currentSlide === slides.length - 1}
              className="group w-12 h-12 md:w-14 md:h-14 rounded-full bg-white text-black flex items-center justify-center transition-all hover:scale-105 active:scale-90 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-white/20 disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Edit Mode Toast */}
      <AnimatePresence>
        {isEditMode && (
           <motion.div 
             initial={{ y: -50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: -50, opacity: 0 }}
             className="absolute top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-sm shadow-xl z-50 flex items-center gap-2 pointer-events-none"
           >
             <Edit3 className="w-4 h-4" />
             MODE EDIT: Klik teks atau ikon kamera. Edit tersimpan otomatis.
           </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Branding (Hidden on small mobile) */}
      <div className="absolute bottom-6 right-8 z-50 hidden lg:block">
        <div className="flex flex-col items-end">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="bg-white text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-1 rotate-3"
          >
            Dibuat oleh Hezell
          </motion.div>
          <div className="text-[10px] text-white/30 font-mono">EDISI GEN Z 2.0</div>
        </div>
      </div>
    </div>
  );
};

// --- REUSABLE COMPONENTS ---

// 1. Drawn Heart Component (Pencil Animation)
const DrawnHeart: React.FC<{ delay?: number; className?: string }> = ({ delay = 0.5, className = "" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={`absolute z-30 pointer-events-none drop-shadow-xl ${className}`}
      style={{ overflow: 'visible' }}
    >
      <motion.path
        // A hand-drawn style heart path
        d="M100,170 C40,140 10,90 10,55 C10,30 35,10 65,10 C85,10 95,20 100,30 C105,20 115,10 135,10 C165,10 190,30 190,55 C190,90 160,140 100,170 Z"
        fill="transparent"
        stroke="#f43f5e" // Rose color
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0, scale: 0.9 }}
        animate={{ pathLength: 1, opacity: 1, scale: 1 }}
        transition={{ 
          duration: 2.5, 
          ease: "easeInOut", 
          delay: delay,
          scale: { duration: 0.5, delay: delay }
        }}
        style={{ filter: "drop-shadow(0px 0px 8px rgba(244, 63, 94, 0.5))" }}
      />
      {/* Little accent marks */}
      <motion.path
        d="M180,40 L195,25"
        stroke="#f43f5e"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: delay + 2.5 }}
      />
      <motion.path
        d="M185,55 L200,50"
        stroke="#f43f5e"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: delay + 2.6 }}
      />
    </svg>
  );
};

// 2. Staggered Text Component (Line by Line animation)
interface StaggeredTextProps {
  content: string;
  isEditMode: boolean;
  className?: string;
  onChange: (val: string) => void;
  delayStart?: number;
}

const StaggeredText: React.FC<StaggeredTextProps> = ({ content, isEditMode, className = "", onChange, delayStart = 0.5 }) => {
  if (isEditMode) {
    return (
      <EditableElement 
        tagName="p" 
        content={content} 
        isEditMode={true} 
        className={`${className} block w-full`}
        onChange={onChange}
      />
    );
  }

  // Split content by sentences for "line by line" feel
  // Using a regex to split by period/exclamation/question mark but keep the delimiter
  const sentences = content.match(/[^.!?]+[.!?]+|\s*$/g)?.filter(s => s.trim().length > 0) || [content];

  return (
    <div className={className}>
      {sentences.map((sentence, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, filter: 'blur(5px)', y: 5 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: delayStart + (index * 0.8), // Staggered delay
            ease: "easeOut" 
          }}
          className="inline-block mr-1"
        >
          {sentence}
        </motion.span>
      ))}
    </div>
  );
};

// 3. Editable Element Wrapper
interface EditableElementProps {
  tagName?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  content: string | number;
  isEditMode: boolean;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
}

const EditableElement: React.FC<EditableElementProps> = ({ 
  tagName = 'div', 
  content, 
  isEditMode, 
  className = '', 
  style,
  onChange 
}) => {
  const Tag = tagName as React.ElementType;
  const contentRef = useRef(content);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newText = e.currentTarget.innerText;
    if (onChange && contentRef.current !== newText) {
      onChange(newText);
      contentRef.current = newText;
    }
  };
  
  return (
    <Tag
      contentEditable={isEditMode}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      className={`${className} ${isEditMode ? 'outline-dashed outline-1 outline-yellow-400/50 rounded-lg min-w-[20px] cursor-text bg-white/5 px-1 hover:bg-white/10 transition-colors' : ''}`}
      style={style}
    >
      {content}
    </Tag>
  );
};

// 4. Line Reveal Text Animation
const LineRevealText: React.FC<{ children: React.ReactNode; accentColor: string; className?: string; delay?: number }> = ({ children, accentColor, className = "", delay = 0 }) => {
  return (
    <div className={`flex gap-3 md:gap-6 items-stretch ${className}`}>
      {/* The Line */}
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: delay }}
        className="w-1 md:w-1.5 rounded-full flex-shrink-0 origin-top"
        style={{ backgroundColor: accentColor }}
      />
      {/* The Text */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: delay + 0.4 }}
        className="py-1 md:py-2 flex-1"
      >
        {children}
      </motion.div>
    </div>
  );
};

const ImageReveal: React.FC<{ src: string; alt?: string; className?: string; delay?: number }> = ({ src, alt, className = "", delay = 0 }) => {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ clipPath: 'inset(100% 0 0 0)' }} // Reveals from bottom to top
      animate={{ clipPath: 'inset(0% 0 0 0)' }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: delay }}
    >
      <motion.img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: delay }}
      />
    </motion.div>
  );
};


// --- INTRO OVERLAY ---
const IntroOverlay: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
      exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      <motion.div 
        className="absolute inset-0 opacity-20"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      >
        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-50" />
      </motion.div>

      {/* Sequence 1: Loading Vibes */}
      <motion.div
        className="absolute text-center px-4"
        initial={{ opacity: 1, display: 'block' }}
        animate={{ opacity: 0, display: 'none' }}
        transition={{ delay: 2.0, duration: 0.1 }}
      >
        <motion.div 
          className="text-5xl md:text-9xl font-display font-black text-transparent stroke-white"
          style={{ WebkitTextStroke: '1px white' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: 3 }}
        >
          MEMUAT...
        </motion.div>
        <div className="font-mono text-sm md:text-xl tracking-[0.3em] md:tracking-[0.5em] mt-4 text-white/70">MEMUAT PRESET</div>
      </motion.div>

      {/* Sequence 2: Creator Name */}
      <motion.div
        className="absolute flex flex-col md:flex-row items-center gap-2 md:gap-4"
        initial={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
        animate={{ 
            opacity: [0, 1, 1, 0], 
            scale: [1.5, 1, 1, 0.9], 
            filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(5px)'] 
        }}
        transition={{ delay: 2.1, duration: 2.4, times: [0, 0.1, 0.9, 1] }}
      >
        <span className="text-3xl md:text-6xl font-black bg-white text-black px-4 py-2 md:px-6 md:py-3 transform -rotate-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] md:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]">HEZELL</span>
        <span className="text-xl md:text-4xl font-mono text-white font-bold">KARYA</span>
      </motion.div>

      {/* Sequence 3: Title Reveal */}
      <motion.div
        className="absolute text-center px-4"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 4.8, type: "spring", stiffness: 200 }}
      >
        <motion.div
          animate={{ x: [-5, 5, -5, 0], color: ['#fff', accentColor, '#fff'] }}
          transition={{ duration: 0.2, repeat: 5 }}
          className="text-5xl md:text-9xl font-display font-black uppercase tracking-tighter"
        >
          PEDIH
        </motion.div>
      </motion.div>

      {/* Progress Bar at bottom */}
      <motion.div 
        className="absolute bottom-0 left-0 h-2 bg-white"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 6.0, ease: "easeInOut" }}
        style={{ backgroundColor: accentColor }}
      />
    </motion.div>
  );
};

const Marquee: React.FC<{ text: string, direction?: 'left' | 'right' }> = ({ text, direction = 'right' }) => {
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div 
        className="text-[4rem] md:text-[8rem] lg:text-[14rem] font-display font-black leading-none text-white opacity-20"
        animate={{ x: direction === 'left' ? [0, -1000] : [-1000, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {text.repeat(10)}
      </motion.div>
    </div>
  )
}

const FloatingStickers: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const icons = [Star, Smile, Sparkles, Heart, Cloud, Zap, Music];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(25)].map((_, i) => {
        const Icon = icons[i % icons.length];
        const randomScale = 0.5 + Math.random();
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        
        return (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            top: `${randomY}%`, 
            left: `${randomX}%`,
            rotate: Math.random() * 360,
            scale: 0 
          }}
          animate={{ 
            y: [0, -30 - Math.random() * 20, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, 10 + Math.random() * 20, -10],
            scale: [0, randomScale, randomScale * 0.9, randomScale]
          }}
          transition={{ 
            y: { duration: 4 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 5 + Math.random() * 5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 6 + Math.random() * 4, repeat: Infinity },
            scale: { duration: 0.8, delay: i * 0.1 }
          }}
        >
          <div style={{ opacity: Math.random() * 0.5 + 0.3 }}>
             {i % 4 === 0 ? (
                <Icon fill={accentColor} stroke="none" className="w-8 h-8 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
             ) : (
                <Icon className={`w-6 h-6 md:w-12 md:h-12 ${i % 2 === 0 ? 'text-white' : ''}`} style={{ color: i % 2 !== 0 ? accentColor : undefined }} strokeWidth={1.5} />
             )}
          </div>
        </motion.div>
      )})}
    </div>
  )
}

interface SlideRendererProps {
  slide: SlideData;
  isEditMode: boolean;
  onUpdate: (field: keyof SlideData, value: any) => void;
}

const SlideRenderer: React.FC<SlideRendererProps> = ({ slide, isEditMode, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        // Limit image size to approx 2MB to prevent LocalStorage quota exceeded errors
        if (file.size > 2 * 1024 * 1024) {
          alert("Ukuran file terlalu besar! Mohon gunakan gambar di bawah 2MB agar bisa disimpan.");
          return;
        }
        const base64 = await fileToBase64(file);
        onUpdate('imageUrl', base64);
      } catch (error) {
        console.error("Error converting file to base64", error);
      }
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Helper to split title for split/colored views
  const splitTitle = (text: string) => {
    const parts = text.split(" ");
    return {
      first: parts[0] || "",
      rest: parts.slice(1).join(" ") || ""
    };
  };

  switch (slide.type) {
    case 'hero':
      const heroTitleParts = splitTitle(slide.title);
      return (
        <div className="relative text-center w-full z-10 flex flex-col items-center max-w-[90vw]">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="inline-block px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-6 md:mb-8"
          >
            <span className="text-xs md:text-sm font-mono tracking-widest text-white/80">
              ✨ <EditableElement 
                  tagName="span" 
                  content={slide.subtitle || ''} 
                  isEditMode={isEditMode}
                  onChange={(val) => onUpdate('subtitle', val)}
                 />
            </span>
          </motion.div>
          
          <div className="text-5xl md:text-7xl lg:text-9xl font-display font-black tracking-tighter leading-[0.9] mb-8 uppercase drop-shadow-2xl">
             <span className="block text-transparent stroke-white" style={{ WebkitTextStroke: '1px white' }}>
                <EditableElement 
                  tagName="span" 
                  content={heroTitleParts.first} 
                  isEditMode={isEditMode} 
                  onChange={(val) => onUpdate('title', `${val} ${heroTitleParts.rest}`)}
                />
             </span>
             <span style={{ color: slide.accentColor }}>
                <EditableElement 
                  tagName="span" 
                  content={heroTitleParts.rest} 
                  isEditMode={isEditMode}
                  onChange={(val) => onUpdate('title', `${heroTitleParts.first} ${val}`)}
                />
             </span>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-2xl mx-auto mb-8 md:mb-10">
            {slide.tags?.map((tag, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className="px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-white text-black font-bold text-xs md:text-base uppercase tracking-wider cursor-default border-2 border-transparent"
                style={{ backgroundColor: i % 2 === 0 ? slide.accentColor : 'white' }}
              >
                <EditableElement 
                  tagName="span" 
                  content={tag} 
                  isEditMode={isEditMode} 
                  onChange={(val) => {
                    const newTags = [...(slide.tags || [])];
                    newTags[i] = val;
                    onUpdate('tags', newTags);
                  }}
                />
              </motion.span>
            ))}
          </div>

          <div className="max-w-xl mx-auto w-full px-4">
             <LineRevealText accentColor={slide.accentColor} delay={0.5}>
               <StaggeredText
                 content={slide.content} 
                 isEditMode={isEditMode} 
                 className="text-base md:text-xl text-white/80 font-medium leading-relaxed text-left"
                 onChange={(val) => onUpdate('content', val)}
                 delayStart={0.6}
               />
             </LineRevealText>
          </div>
        </div>
      );

    case 'split':
      const splitTitleParts = splitTitle(slide.title);
      // STRATEGIC LAYOUT VARIETY:
      // Even ID slides: Image Right, Text Left
      // Odd ID slides: Image Left, Text Right
      // Note: We use modulo 4 to get a 1-2-1-2 rhythm if IDs are sequential
      const isImageRight = slide.id % 4 === 0; // Just an example logic for variety
      const rotationClass = slide.id % 3 === 0 ? '-rotate-2' : slide.id % 3 === 1 ? 'rotate-1' : 'rotate-3';

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full items-center h-full md:h-auto overflow-y-auto md:overflow-visible">
          {/* Text Side */}
          <div className={`pb-20 md:pb-0 ${isImageRight ? 'order-1 md:order-1' : 'order-2 md:order-2'}`}>
             <motion.div 
               initial={{ opacity: 0, x: isImageRight ? -50 : 50 }} 
               animate={{ opacity: 1, x: 0 }} 
               transition={{ duration: 0.8 }}
             >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[2px] w-8 md:w-12" style={{ backgroundColor: slide.accentColor }} />
                  <h3 className="font-mono text-xs md:text-sm text-white/50">
                    <EditableElement 
                      tagName="span" 
                      content={slide.subtitle || ''} 
                      isEditMode={isEditMode}
                      onChange={(val) => onUpdate('subtitle', val)} 
                    />
                  </h3>
                </div>
                
                <div className="text-4xl md:text-5xl lg:text-7xl font-display font-bold leading-none mb-6 md:mb-8 uppercase">
                  <EditableElement 
                    tagName="span" 
                    content={splitTitleParts.first} 
                    isEditMode={isEditMode}
                    onChange={(val) => onUpdate('title', `${val} ${splitTitleParts.rest}`)}
                  /> 
                  <br/>
                  <span style={{ color: slide.accentColor }}>
                    <EditableElement 
                      tagName="span" 
                      content={splitTitleParts.rest} 
                      isEditMode={isEditMode}
                      onChange={(val) => onUpdate('title', `${splitTitleParts.first} ${val}`)}
                    />
                  </span>
                </div>
                
                <LineRevealText accentColor={slide.accentColor} delay={0.3}>
                   <StaggeredText
                      content={slide.content} 
                      isEditMode={isEditMode} 
                      className="text-sm md:text-lg text-white/80 leading-relaxed"
                      onChange={(val) => onUpdate('content', val)}
                      delayStart={0.8}
                   />
                </LineRevealText>
             </motion.div>
          </div>
          
          {/* Image Side */}
          <div className={`relative h-[250px] md:h-[400px] lg:h-[500px] w-full mt-4 md:mt-0 ${isImageRight ? 'order-2 md:order-2' : 'order-1 md:order-1'}`}>
            <div className={`w-full h-full p-2 border border-white/20 rounded-[1.5rem] md:rounded-[2.5rem] relative transition-transform duration-500 ${rotationClass} hover:rotate-0`}>
               <ImageReveal 
                  src={slide.imageUrl!} 
                  className="w-full h-full rounded-[1rem] md:rounded-[2rem]"
                  delay={0.2}
               />
               
               <DrawnHeart className="w-20 h-20 md:w-32 md:h-32 -top-8 -right-8" delay={1.5} />

               <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-black border border-white/20 px-4 py-2 md:px-6 md:py-3 rounded-full z-20">
                  <span className="font-display font-bold text-sm md:text-xl uppercase">HORMAT 🔑</span>
               </div>

               {/* Upload Button Overlay */}
               {isEditMode && (
                 <>
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     className="hidden" 
                     accept="image/*" 
                     onChange={handleFileChange} 
                   />
                   <button 
                     onClick={triggerUpload}
                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 bg-yellow-400 text-black rounded-full shadow-xl hover:scale-110 transition-transform"
                     title="Ganti Foto"
                   >
                     <Camera className="w-6 h-6" />
                   </button>
                 </>
               )}
            </div>
          </div>
        </div>
      );

    case 'image':
      // Varied rotation for image slide too
      const imgRotation = slide.id % 2 === 0 ? '-rotate-2' : 'rotate-2';
      
      return (
        <div className="w-full h-full flex flex-col md:flex-row items-center gap-8 md:gap-12 overflow-y-auto md:overflow-visible">
           <div className="w-full md:w-1/2 relative h-[250px] md:h-[400px] lg:h-[500px] flex-shrink-0 mt-4 md:mt-0 group perspective-1000">
              <div className={`relative w-full h-full z-10 transition-transform duration-500 ${imgRotation} group-hover:rotate-0`}>
                 <ImageReveal 
                    src={slide.imageUrl!} 
                    className="w-full h-full rounded-[2rem] md:rounded-[3rem] border-2 md:border-4 border-white object-cover"
                    delay={0.1}
                 />
                 <DrawnHeart className="w-24 h-24 md:w-40 md:h-40 -top-6 -left-6 rotate-[-15deg]" delay={1.2} />

                 {/* Upload Button Overlay */}
                 {isEditMode && (
                   <>
                     <input 
                       type="file" 
                       ref={fileInputRef} 
                       className="hidden" 
                       accept="image/*" 
                       onChange={handleFileChange} 
                     />
                     <button 
                       onClick={triggerUpload}
                       className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 bg-yellow-400 text-black rounded-full shadow-xl hover:scale-110 transition-transform"
                       title="Ganti Foto"
                     >
                       <Camera className="w-6 h-6" />
                     </button>
                   </>
                 )}
              </div>
              <div className={`absolute inset-0 border-2 md:border-4 border-dashed border-white/30 rounded-[2rem] md:rounded-[3rem] scale-105 z-0 ${slide.id % 2 === 0 ? 'rotate-2' : '-rotate-2'}`} />
           </div>
           
           <div className="w-full md:w-1/2 pl-0 md:pl-10 pb-24 md:pb-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block px-3 py-1 md:px-4 md:py-1 rounded-full border border-white text-[10px] md:text-xs font-bold mb-4 md:mb-6 uppercase" 
                style={{ color: slide.accentColor, borderColor: slide.accentColor }}
              >
                 <EditableElement 
                   tagName="span" 
                   content={slide.subtitle || ''} 
                   isEditMode={isEditMode}
                   onChange={(val) => onUpdate('subtitle', val)}
                 />
              </motion.div>
              
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.2, duration: 0.6 }}
                 className="text-4xl md:text-5xl lg:text-7xl font-display font-black leading-[0.9] mb-6 md:mb-8"
              >
                <EditableElement 
                  tagName="h2" 
                  content={slide.title} 
                  isEditMode={isEditMode}
                  onChange={(val) => onUpdate('title', val)}
                />
              </motion.div>

              <LineRevealText accentColor={slide.accentColor} delay={0.4}>
                <StaggeredText
                   content={slide.content} 
                   isEditMode={isEditMode} 
                   className="text-sm md:text-xl text-white/70 leading-relaxed"
                   onChange={(val) => onUpdate('content', val)}
                   delayStart={0.6}
                />
              </LineRevealText>
           </div>
        </div>
      );

    case 'quote':
      return (
        <div className="relative w-full flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-full blur-3xl opacity-20" />
          <div className="relative text-center max-w-4xl z-10 flex flex-col items-center">
            <ICONS.MessageSquare className="w-10 h-10 md:w-16 md:h-16 mx-auto mb-6 md:mb-8 text-white/20" />
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="text-3xl md:text-5xl lg:text-7xl font-display font-bold leading-tight mb-8 md:mb-12"
            >
              "<EditableElement 
                 tagName="span" 
                 content={slide.title} 
                 isEditMode={isEditMode}
                 onChange={(val) => onUpdate('title', val)}
               />"
            </motion.div>

            <LineRevealText accentColor="#fff" delay={0.6}>
               <div className="text-lg md:text-2xl font-bold uppercase tracking-widest text-white/90 block w-full">
                 <EditableElement 
                   tagName="span" 
                   content={slide.content} 
                   isEditMode={isEditMode}
                   onChange={(val) => onUpdate('content', val)}
                 />
               </div>
            </LineRevealText>
          </div>
        </div>
      );

    case 'footer':
      return (
        <div className="w-full flex flex-col items-center justify-center text-center p-4">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6 md:mb-8"
          >
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-lime-400 to-cyan-400 blur-xl absolute" />
            <ICONS.Smile className="w-16 h-16 md:w-24 md:h-24 relative z-10 text-white" />
          </motion.div>
          
          <div className="text-5xl md:text-7xl lg:text-9xl font-display font-black uppercase tracking-tighter leading-none mb-6 md:mb-8">
            <EditableElement 
              tagName="h2" 
              content={slide.title} 
              isEditMode={isEditMode}
              onChange={(val) => onUpdate('title', val)}
            />
          </div>
          
          <div className="max-w-xl text-sm md:text-xl text-white/60 mb-8">
            <EditableElement 
              tagName="p" 
              content={slide.subtitle || ''} 
              isEditMode={isEditMode}
              onChange={(val) => onUpdate('subtitle', val)}
            />
          </div>

          <div className="max-w-xl mx-auto mb-10 md:mb-12 flex justify-center w-full">
             <LineRevealText accentColor={slide.accentColor} delay={0.3}>
                <StaggeredText
                   content={slide.content} 
                   isEditMode={isEditMode} 
                   className="text-base md:text-lg text-white text-left pl-2 md:pl-4"
                   onChange={(val) => onUpdate('content', val)}
                   delayStart={0.6}
                />
             </LineRevealText>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-8 py-3 md:px-10 md:py-5 bg-white text-black font-black text-lg md:text-xl uppercase tracking-widest rounded-full flex items-center gap-3 group"
          >
            Ulangi 
            <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        </div>
      );

    default:
      return null;
  }
};

export default App;
