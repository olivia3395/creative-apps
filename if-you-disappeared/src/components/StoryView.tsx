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
    <div className="relative min-h-screen w-full bg-midnight text-cream">
      {/* Background Overlay */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/95 to-midnight" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-shimmer/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mist-blue/10 blur-[120px] rounded-full" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <div className="flex justify-center mb-24">
          <button 
            onClick={onRestart}
            className="text-mist-blue/30 hover:text-gold-shimmer transition-all text-[10px] uppercase tracking-[0.5em] font-bold"
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
            <div className="flex flex-col items-center justify-center space-y-6 text-mist-blue/40 py-12">
              <div className="w-10 h-10 border border-gold-shimmer/20 border-t-gold-shimmer rounded-full animate-spin" />
              <p className="font-serif italic text-xl tracking-wide">{lang === 'zh' ? "正在编织下一章..." : "Weaving the next scene..."}</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-[2rem] p-10 md:p-16 border-cream/5 shadow-2xl"
            >
              <h3 className="text-2xl font-serif mb-10 text-center italic text-cream/90">{t.continueTitle}</h3>
              
              <div className="flex flex-wrap gap-3 justify-center mb-12">
                {chapters[chapters.length - 1].suggestedFollowUps?.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => onContinue(suggestion)}
                    className="px-6 py-3 rounded-full bg-cream/5 text-mist-blue/80 text-xs tracking-widest hover:bg-gold-shimmer/10 hover:text-gold-shimmer transition-all border border-cream/5"
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
                  className="w-full bg-cream/5 border border-cream/10 rounded-full py-5 pl-8 pr-16 text-cream focus:outline-none focus:border-gold-shimmer/40 focus:ring-0 transition-all placeholder:text-cream/10"
                />
                <button
                  onClick={() => {
                    if (customPrompt.trim()) {
                      onContinue(customPrompt);
                      setCustomPrompt("");
                    }
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gold-shimmer/20 text-gold-shimmer rounded-full hover:bg-gold-shimmer hover:text-midnight transition-all"
                >
                  <ArrowRight size={20} />
                </button>
                <div className="absolute -inset-2 -z-10 bg-gold-shimmer/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
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
        <h1 className="text-glow text-5xl md:text-7xl font-serif leading-tight text-cream">
          {chapter.title}
        </h1>
        <p className="text-2xl md:text-3xl font-serif italic text-mist-blue/70 leading-relaxed">
          "{chapter.openingLine}"
        </p>
      </div>

      <div className="space-y-20 max-w-2xl mx-auto relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-cream/10 before:to-transparent">
        {chapter.scenes?.map((scene, i) => (
          <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-cream/10 bg-midnight text-gold-shimmer shadow-2xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <div className="w-1.5 h-1.5 bg-gold-shimmer rounded-full animate-pulse" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-4rem)] p-8 rounded-[2rem] bg-cream/5 backdrop-blur-xl border border-cream/5 shadow-xl hover:border-cream/10 transition-all">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-gold-shimmer uppercase">{scene.time}</span>
                <span className="text-xs font-medium text-mist-blue/40 uppercase tracking-widest">{scene.location}</span>
              </div>
              <p className="text-xl leading-relaxed text-cream/90 font-serif">
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
          <div className="glass-panel rounded-[2.5rem] p-12 shadow-2xl flex flex-col justify-center border-gold-shimmer/10">
            <div className="flex items-center gap-4 mb-8 text-gold-shimmer/60">
              <PenTool size={22} />
              <h3 className="font-serif italic text-2xl tracking-wide">{t.youWroteDown}</h3>
            </div>
            <p className="font-serif text-3xl leading-relaxed text-cream italic text-glow">
              "{chapter.youWroteDown}"
            </p>
          </div>
        )}
      </div>

      <div className="text-center max-w-3xl mx-auto pt-16">
        <p className="text-3xl font-serif italic text-mist-blue/80 leading-relaxed">
          {chapter.endingLine}
        </p>
      </div>
    </motion.div>
  );
}

function ListCard({ title, icon, items }: { title: string, icon: React.ReactNode, items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="glass-panel rounded-[2.5rem] p-12 shadow-2xl border-cream/5">
      <div className="flex items-center gap-4 mb-10 text-gold-shimmer/80">
        {icon}
        <h3 className="font-serif italic text-2xl tracking-wide">{title}</h3>
      </div>
      <ul className="space-y-6">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-4 text-cream/70">
            <span className="block w-1.5 h-1.5 mt-2.5 rounded-full bg-gold-shimmer/30 shrink-0" />
            <span className="text-lg leading-relaxed font-serif">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
