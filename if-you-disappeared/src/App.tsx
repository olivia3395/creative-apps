import React, { useState } from 'react';
import Landing from './components/Landing';
import StoryView from './components/StoryView';
import { generateStory, continueStory } from './services/gemini';
import { StoryChapter, UserInput } from './types';
import { AnimatePresence } from 'motion/react';
import { Language, translations } from './i18n';

export default function App() {
  const [chapters, setChapters] = useState<StoryChapter[]>([]);
  const [chatSession, setChatSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('zh');

  const handleGenerate = async (input: UserInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const { chapter, chatSession: session } = await generateStory(input, lang);
      setChapters([chapter]);
      setChatSession(session);
    } catch (err: any) {
      setError(err.message || (lang === 'zh' ? "生成故事失败，请重试。" : "Failed to generate your trip. Please try again."));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async (prompt: string) => {
    if (!chatSession) return;
    setIsLoading(true);
    setError(null);
    try {
      const nextChapter = await continueStory(chatSession, prompt, lang);
      setChapters(prev => [...prev, nextChapter]);
    } catch (err: any) {
      setError(err.message || (lang === 'zh' ? "继续故事失败，请重试。" : "Failed to continue the story. Please try again."));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Language Toggle */}
      <div className="fixed top-8 right-8 z-50">
        <button 
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="bg-cream/5 backdrop-blur-xl border border-cream/10 px-6 py-2 rounded-full text-[10px] font-medium tracking-[0.3em] uppercase text-cream/60 hover:bg-cream/10 hover:text-cream transition-all shadow-sm"
        >
          {lang === 'en' ? '中文' : 'EN'}
        </button>
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {chapters.length === 0 ? (
            <Landing 
              key="landing" 
              onGenerate={handleGenerate} 
              isLoading={isLoading} 
              lang={lang}
            />
          ) : (
            <StoryView 
              key="story" 
              chapters={chapters} 
              onContinue={handleContinue} 
              onRestart={() => setChapters([])}
              isLoading={isLoading} 
              lang={lang}
            />
          )}
        </AnimatePresence>

        {error && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-50 text-red-800 px-6 py-3 rounded-full shadow-lg border border-red-100 flex items-center gap-3">
            <span className="block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {error}
          </div>
        )}

        <footer className="py-12 flex flex-col items-center gap-4 opacity-30">
          <div className="w-12 h-[1px] bg-ink" />
          <p className="text-[9px] uppercase tracking-[0.4em] font-medium text-ink text-center px-6">
            © {new Date().getFullYear()} yuyao wang • yuyaow@bu.edu
          </p>
        </footer>
      </div>
    </div>
  );
}
