import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserInput } from '../types';
import { Language, translations } from '../i18n';

const MOODS = []; // Removed, using translations
const TONES = []; // Removed, using translations
const TRAVEL_WITH = []; // Removed, using translations

const CITY_ASSETS: Record<string, { photo?: string; postmark?: string }> = {};

interface LandingProps {
  key?: React.Key;
  onGenerate: (input: UserInput) => void;
  isLoading: boolean;
  lang: Language;
}

export default function Landing({ onGenerate, isLoading, lang }: LandingProps) {
  const [moodText, setMoodText] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [selectedTravelWith, setSelectedTravelWith] = useState("");

  const t = translations[lang] as any;

  const handleGenerate = () => {
    let finalMood = moodText.trim();
    if (!finalMood && selectedMood) {
      finalMood = selectedMood;
    }
    if (!finalMood) return;

    onGenerate({
      mood: finalMood,
      destination: selectedPlace,
      tone: selectedTone,
      travelWith: selectedTravelWith
    });
  };

  const regionDestinations = [
    { 
      id: 'usa', 
      label: t.regions.usa, 
      items: ['ny', 'sf', 'chicago', 'miami', 'seattle', 'vegas', 'newOrleans', 'yellowstone', 'grandCanyon', 'yosemite'] 
    },
    { 
      id: 'china', 
      label: t.regions.china, 
      items: ['beijing', 'jinan', 'xinjiang', 'tibet', 'yunnan', 'hk', 'chengdu', 'xian', 'hangzhou', 'suzhou', 'chongqing', 'dunhuang'] 
    },
    { 
      id: 'europe', 
      label: t.regions.europe, 
      items: ['france', 'italy', 'spain', 'iceland', 'greece', 'switzerland', 'berlin', 'amsterdam', 'prague', 'vienna', 'copenhagen'] 
    },
    { 
      id: 'southAmerica', 
      label: t.regions.southAmerica, 
      items: ['brazil', 'argentina', 'peru', 'chile', 'colombia'] 
    },
    { 
      id: 'others', 
      label: t.regions.others, 
      items: ['tokyo', 'kyoto', 'paris', 'london', 'rome', 'sydney', 'melbourne', 'cairo', 'dubai', 'singapore', 'bangkok'] 
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative max-w-6xl mx-auto px-6 py-24 min-h-screen flex flex-col items-center overflow-hidden"
    >
      {/* Background misty effect */}
      <div className="absolute inset-0 misty-gradient -z-10" />
      
      <header className="text-center mb-20 space-y-12">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-ink/40 font-medium"
        >
          {t.topText}
        </motion.p>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className={`text-5xl md:text-7xl font-serif leading-tight tracking-tight text-ink shimmer-text ${lang === 'en' ? 'font-fancy' : 'italic'}`}>
            {t.title}
          </h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-lg md:text-xl text-ink/60 font-serif italic max-w-2xl mx-auto"
        >
          {t.subtitle}
        </motion.p>
      </header>

      <div className="w-full space-y-32">
        {/* Ornamental Divider */}
        <div className="flex justify-center">
          <div className="w-24 h-8 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='30' viewBox='0 0 100 30'%3E%3Cpath d='M0,15 Q25,0 50,15 T100,15' fill='none' stroke='%23c5a059' stroke-width='1'/%3E%3Ccircle cx='50' cy='15' r='3' fill='%23c5a059'/%3E%3C/svg%3E")`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }} />
        </div>

        {/* Mood Input Section - Main Postcard Design */}
        <section className="max-w-4xl mx-auto w-full">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="ornamental-frame p-1 md:p-2 bg-white soft-halo"
          >
            {/* Corner Decorations */}
            <div className="corner-decoration corner-tl" />
            <div className="corner-decoration corner-tr" />
            <div className="corner-decoration corner-bl" />
            <div className="corner-decoration corner-br" />

            <div className="border border-gold/10 p-8 md:p-12 flex flex-col gap-12 min-h-[300px] relative">
              {/* The Message */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-bold">Message</span>
                  <div className="wax-seal" title="Seal your trip" />
                </div>
                <textarea
                  value={moodText}
                  onChange={(e) => setMoodText(e.target.value)}
                  placeholder={t.moodPlaceholder}
                  className="w-full bg-transparent flex-1 text-2xl md:text-3xl font-serif italic text-ink/80 focus:outline-none resize-none placeholder:text-ink/10 placeholder:italic leading-relaxed handwritten"
                />
                <div className="mt-8 flex items-center justify-between text-ink/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-[1px] bg-current" />
                    <span className="text-[10px] uppercase tracking-widest italic">Sincerely, You</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-[8px] uppercase tracking-tighter opacity-50 font-mono">
                      {new Date().toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="postcard-stamp border-gold/30 text-gold/40 w-12 h-16">
                      <span className="text-[6px] mb-0.5">POSTAGE</span>
                      <span className="text-sm font-bold">{lang.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Diary Style Selection Grid - 3 Columns */}
        <section className="w-full max-w-7xl mx-auto px-4">
          <div className="relative bg-[#fdfaf3] shadow-2xl rounded-sm border border-gold/10 overflow-hidden cloud-edge min-h-[500px]">
            {/* Notebook Binding Rings */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-around py-12 z-20 pointer-events-none border-r border-gold/5">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-8 h-2 bg-gradient-to-b from-ink/20 via-ink/40 to-ink/20 rounded-full -translate-x-4 shadow-[2px_2px_4px_rgba(0,0,0,0.1)]" />
                  <div className="w-2 h-2 rounded-full bg-gold/10 -translate-x-2" />
                </div>
              ))}
            </div>

            {/* Journal Header Decoration */}
            <div className="h-8 bg-ink/5 w-full border-b border-gold/5 flex items-center pl-16 pr-4 justify-between">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-gold/20" />
                <div className="w-2 h-2 rounded-full bg-gold/20" />
                <div className="w-2 h-2 rounded-full bg-gold/20" />
              </div>
              <span className="text-[8px] uppercase tracking-[0.3em] text-ink/30 font-mono italic">Travel Journal // No. 2026</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gold/10 pl-12">
              <div className="p-8 md:p-12 relative">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2.5rem' }} />
                <DiarySelector title={t.mood} options={t.moodOptions} selected={selectedMood} onSelect={setSelectedMood} />
              </div>
              <div className="p-8 md:p-12 bg-[#fcf8ef] relative">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2.5rem' }} />
                <DiarySelector title={t.tone} options={t.toneOptions} selected={selectedTone} onSelect={setSelectedTone} />
              </div>
              <div className="p-8 md:p-12 relative">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2.5rem' }} />
                <DiarySelector title={t.travelWith} options={t.travelWithOptions} selected={selectedTravelWith} onSelect={setSelectedTravelWith} />
              </div>
            </div>

            {/* Journal Footer Decoration */}
            <div className="p-4 bg-ink/5 border-t border-gold/5 flex justify-between items-center pl-16">
              <span className="text-[7px] uppercase tracking-[0.4em] text-ink/20 font-mono">Personal Narrative Log // Vol. 01</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-gold/10" />)}
              </div>
            </div>
          </div>
        </section>

        {/* Destination Section - Postcard Style */}
        <section className="space-y-16">
          <div className="flex items-center gap-8 text-ink/10">
            <div className="h-[0.5px] flex-1 bg-current" />
            <h2 className="text-[9px] uppercase tracking-[0.5em] font-bold opacity-50">{t.placeVibe}</h2>
            <div className="h-[0.5px] flex-1 bg-current" />
          </div>
          
          <div className="space-y-20">
            {regionDestinations.map(region => (
              <div key={region.id} className="space-y-10">
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-ink/20 text-center">{region.label}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {region.items.map(cityKey => {
                    const cityName = t.destinations[cityKey] || cityKey;
                    const cityDesc = t.cityDetails[cityKey] || t.cityDetails.default;
                    const isSelected = selectedPlace === cityName;
                    
                    return (
                      <motion.div
                        key={cityKey}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedPlace(isSelected ? "" : cityName)}
                        className={`cinematic-card vintage-plaque p-8 cursor-pointer relative group ${
                          isSelected ? 'active ring-2 ring-gold/40 rotate-1 scale-105 z-10' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                            <h4 className="text-lg font-serif italic text-ink">{cityName}</h4>
                            <p className="text-[9px] uppercase tracking-widest text-gold/60">{region.label}</p>
                          </div>
                          <div className="postcard-stamp bg-transparent border-gold/40 text-gold/60">
                            <span className="text-[6px] mb-0.5 opacity-50">STAMP</span>
                            <span className="text-[10px] font-bold">{cityKey.substring(0, 2).toUpperCase()}</span>
                          </div>
                        </div>
                        
                        <div className="h-[1px] w-full bg-gold/20 my-4" />
                        
                        <p className="text-xs font-serif italic text-ink/60 leading-relaxed handwritten">
                          {cityDesc}
                        </p>
                        
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-gold' : 'bg-gold/20'}`} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Generate Button */}
        <div className="pt-16 flex flex-col items-center gap-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isLoading || (!moodText.trim() && !selectedMood)}
            className="relative group px-24 py-10 bg-ink text-cream vintage-plaque text-xl font-serif italic tracking-[0.2em] overflow-hidden transition-all hover:shadow-[0_30px_60px_-15px_rgba(197,160,89,0.3)] disabled:opacity-20 disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-gold/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out" />
            <span className="relative z-10 flex items-center gap-4">
              {isLoading ? t.generating : t.generate}
              {!isLoading && <span className="text-gold">→</span>}
            </span>
          </motion.button>
          <div className="flex items-center gap-4 opacity-20">
            <div className="w-8 h-[1px] bg-ink" />
            <p className="text-[9px] uppercase tracking-[0.4em] font-medium">
              {lang === 'zh' ? "编织属于你的微缩剧场" : "Weaving your micro theater"}
            </p>
            <div className="w-8 h-[1px] bg-ink" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DiarySelector({ title, options, selected, onSelect }: { title: string, options: string[], selected: string, onSelect: (val: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h3 className="text-xl md:text-2xl font-serif italic text-ink/70 whitespace-nowrap">{title}</h3>
        <div className="flex-1 h-[1px] bg-gold/20" />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-3">
        {options.map((opt) => {
          const isSelected = selected === opt;
          return (
            <button
              key={opt}
              onClick={() => onSelect(isSelected ? "" : opt)}
              className={`group relative px-6 py-2 transition-all duration-500 text-sm md:text-base font-serif italic tracking-wide ${
                isSelected 
                  ? 'text-ink scale-110' 
                  : 'text-ink/40 hover:text-ink/60'
              }`}
            >
              <span className="relative z-10">{opt}</span>
              {isSelected ? (
                <motion.div 
                  layoutId={`diary-active-bg-${title}`}
                  className="absolute inset-0 bg-gold/10 -z-0"
                  style={{ 
                    borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                    border: '1px solid rgba(197, 160, 89, 0.2)'
                  }}
                />
              ) : (
                <div className="absolute bottom-1 left-4 right-4 h-[1px] bg-gold/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
