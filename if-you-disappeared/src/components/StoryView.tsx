import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StoryChapter } from '../types';
import { Camera, Coffee, PenTool, Eye, ArrowRight } from 'lucide-react';
import { Language, translations } from '../i18n';

interface StoryViewProps {
  key?: React.Key;
  chapters: StoryChapter[];
  onContinue: (prompt: string) => void;
  onRestart: () => void;
  isLoading: boolean;
  lang: Language;
}

export default function StoryView({ chapters, onContinue, onRestart, isLoading, lang }: StoryViewProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const t = translations[lang] as any;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chapters]);

  return (
    <div className="relative min-h-screen w-full bg-cream text-black">
      {/* Background Overlay */}
      <div className="fixed inset-0 z-0 misty-gradient" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <div className="flex justify-center mb-24">
          <button 
            onClick={onRestart}
            className="text-black/30 hover:text-gold transition-all text-[10px] uppercase tracking-[0.5em] font-bold"
          >
            {t.startNew}
          </button>
        </div>

        <div className="space-y-40">
          {chapters.map((chapter, index) => (
            <ChapterView key={index} chapter={chapter} index={index} lang={lang} />
          ))}
        </div>

        <div ref={endRef} className="pt-32 pb-40">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-6 text-black/40 py-12">
              <div className="w-10 h-10 border border-gold/20 border-t-gold rounded-full animate-spin" />
              <p className="font-serif italic text-xl tracking-wide">{lang === 'zh' ? "正在编织下一章..." : "Weaving the next scene..."}</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="ornamental-frame p-10 md:p-16 soft-halo"
            >
              {/* Corner Decorations */}
              <div className="corner-decoration corner-tl" />
              <div className="corner-decoration corner-tr" />
              <div className="corner-decoration corner-bl" />
              <div className="corner-decoration corner-br" />

              <h3 className="text-2xl font-serif mb-10 text-center italic text-black/90">{t.continueTitle}</h3>
              
              <div className="flex flex-wrap gap-3 justify-center mb-12">
                {chapters[chapters.length - 1].suggestedFollowUps?.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => onContinue(suggestion)}
                    className="px-6 py-3 rounded-full bg-gold/5 text-black/80 text-xs tracking-widest hover:bg-gold/10 hover:text-black transition-all border border-gold/10"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="relative max-w-xl mx-auto group">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customPrompt.trim()) {
                      onContinue(customPrompt);
                      setCustomPrompt("");
                    }
                  }}
                  placeholder={t.continuePlaceholder}
                  className="w-full bg-gold/5 border border-gold/10 rounded-full py-5 pl-8 pr-16 text-black focus:outline-none focus:border-gold/40 focus:ring-0 transition-all placeholder:text-black/20"
                />
                <button
                  onClick={() => {
                    if (customPrompt.trim()) {
                      onContinue(customPrompt);
                      setCustomPrompt("");
                    }
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gold/10 text-gold rounded-full hover:bg-gold hover:text-cream transition-all"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChapterView({ chapter, index, lang }: { key?: React.Key, chapter: StoryChapter, index: number, lang: Language }) {
  const t = translations[lang] as any;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="space-y-24"
    >
      <div className="text-center space-y-8 max-w-3xl mx-auto">
        <h1 className="shimmer-text text-5xl md:text-7xl font-serif leading-tight">
          {chapter.title}
        </h1>
        <p className="text-2xl md:text-3xl font-serif italic text-black/70 leading-relaxed">
          "{chapter.openingLine}"
        </p>
      </div>

      <div className="space-y-20 max-w-2xl mx-auto relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-gold/20 before:to-transparent">
        {chapter.scenes?.map((scene, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gold/20 bg-cream text-gold shadow-2xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-4rem)] p-8 vintage-plaque bg-white border border-gold/10 shadow-xl hover:border-gold/30 transition-all">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-gold uppercase">{scene.time}</span>
                <span className="text-xs font-medium text-black/40 uppercase tracking-widest">{scene.location}</span>
              </div>
              <p className="text-xl leading-relaxed text-black/90 font-serif italic">
                {scene.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <ListCard title={lang === 'zh' ? "你看见了" : "You saw"} icon={<Eye size={22} />} items={chapter.youSaw} />
        <ListCard title={t.youAte} icon={<Coffee size={22} />} items={chapter.youAte} />
        <ListCard title={t.youPhotographed} icon={<Camera size={22} />} items={chapter.youPhotographed} />
        
        {chapter.youWroteDown && (
          <div className="ornamental-frame p-12 shadow-2xl flex flex-col justify-center">
            {/* Corner Decorations */}
            <div className="corner-decoration corner-tl" />
            <div className="corner-decoration corner-tr" />
            <div className="corner-decoration corner-bl" />
            <div className="corner-decoration corner-br" />
            
            <div className="flex items-center gap-4 mb-8 text-gold/60">
              <PenTool size={22} />
              <h3 className="font-serif italic text-2xl tracking-wide">{t.youWroteDown}</h3>
            </div>
            <p className="font-serif text-3xl leading-relaxed text-black italic handwritten">
              "{chapter.youWroteDown}"
            </p>
          </div>
        )}
      </div>

      <div className="text-center max-w-3xl mx-auto pt-16">
        <p className="text-3xl font-serif italic text-black/80 leading-relaxed">
          {chapter.endingLine}
        </p>
      </div>
    </motion.div>
  );
}

function ListCard({ title, icon, items }: { title: string, icon: React.ReactNode, items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="vintage-plaque bg-white p-12 shadow-2xl border border-gold/10">
      <div className="flex items-center gap-4 mb-10 text-gold/80">
        {icon}
        <h3 className="font-serif italic text-2xl tracking-wide">{title}</h3>
      </div>
      <ul className="space-y-6">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-4 text-black/70">
            <span className="block w-1.5 h-1.5 mt-2.5 rounded-full bg-gold/30 shrink-0" />
            <span className="text-lg leading-relaxed font-serif italic">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
