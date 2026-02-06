'use client';

import { useState, useEffect, useRef } from 'react';
import { Brand, Step, ErrorCard } from '@/lib/types';
import { hexToRgb, replaceBrandName } from '@/lib/utils';

interface GuideClientProps {
  brand: Brand;
  brandSlug: string;
  steps: Step[];
  languages: string[];
  languageNames: { [key: string]: string };
  defaultLanguage: string;
  initialLang: string;
}

export default function GuideClient({
  brand,
  brandSlug,
  steps,
  languages,
  languageNames,
  defaultLanguage,
  initialLang,
}: GuideClientProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [lang, setLang] = useState(initialLang);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    if (!urlLang) {
      const browserLang = navigator.language.split('-')[0];
      if (languages.includes(browserLang)) {
        setLang(browserLang);
      }
    }
  }, [languages]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', brand.primary);
    document.documentElement.style.setProperty('--secondary', brand.secondary);
    document.documentElement.style.setProperty('--background', brand.background);
    document.documentElement.style.setProperty('--primary-rgb', hexToRgb(brand.primary));
    document.documentElement.style.setProperty('--secondary-rgb', hexToRgb(brand.secondary));
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [brand, lang]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tocRef.current && !tocRef.current.contains(event.target as Node)) {
        setTocOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStepChange = (newStep: number) => {
    if (newStep === currentStep || isAnimating) return;
    setIsAnimating(true);
    setCurrentStep(newStep);
    setTocOpen(false);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    setLangMenuOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.history.replaceState({}, '', url.toString());
  };

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const t = (text: string | undefined) => {
    if (!text) return '';
    return replaceBrandName(text, brand.name);
  };

  const getLocalizedText = (obj: { [key: string]: string } | undefined) => {
    if (!obj) return '';
    return obj[lang] || obj[defaultLanguage] || '';
  };

  const renderContent = (step: Step) => {
    const content = getLocalizedText(step.content);
    
    return (
      <div className="space-y-6">
        <p className="text-lg text-white/80 whitespace-pre-line">{t(content)}</p>

        {step.listItems && (step.listItems[lang] || step.listItems[defaultLanguage]) && (
          <ul className="space-y-3">
            {(step.listItems[lang] || step.listItems[defaultLanguage] || []).map((item, idx) => (
              <li 
                key={idx} 
                className="flex items-start gap-3 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <span 
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ background: brand.secondary }}
                />
                <span className="text-white/80">{t(item)}</span>
              </li>
            ))}
          </ul>
        )}

        {step.numberedSteps && (step.numberedSteps[lang] || step.numberedSteps[defaultLanguage]) && (
          <ol className="space-y-4">
            {(step.numberedSteps[lang] || step.numberedSteps[defaultLanguage] || []).map((item, idx) => (
              <li 
                key={idx} 
                className="flex items-start gap-4 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <span 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: brand.primary }}
                >
                  {idx + 1}
                </span>
                <span className="text-white/80 pt-1">{t(item)}</span>
              </li>
            ))}
          </ol>
        )}

        {step.columns && (step.columns[lang] || step.columns[defaultLanguage]) && (
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="glass rounded-xl p-5 card-hover">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="font-semibold text-red-400">
                  {lang === 'ar' ? 'ينخفض' : lang === 'uz' ? 'Kamayadi' : lang === 'bn' ? 'কমে' : lang === 'fr' ? 'Diminue' : lang === 'ru' ? 'Уменьшается' : 'Decreases'}
                </span>
              </div>
              <p className="text-white/70 text-sm whitespace-pre-line">
                {t((step.columns[lang] || step.columns[defaultLanguage])?.decrease || '')}
              </p>
            </div>
            <div className="glass rounded-xl p-5 card-hover">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="font-semibold text-green-400">
                  {lang === 'ar' ? 'يزيد' : lang === 'uz' ? 'Oshadi' : lang === 'bn' ? 'বাড়ে' : lang === 'fr' ? 'Augmente' : lang === 'ru' ? 'Увеличивается' : 'Increases'}
                </span>
              </div>
              <p className="text-white/70 text-sm whitespace-pre-line">
                {t((step.columns[lang] || step.columns[defaultLanguage])?.increase || '')}
              </p>
            </div>
          </div>
        )}

        {step.errorCards && (step.errorCards[lang] || step.errorCards[defaultLanguage]) && (
          <div className="grid gap-4 mt-6">
            {(step.errorCards[lang] || step.errorCards[defaultLanguage] || []).map((card: ErrorCard, idx: number) => (
              <div
                key={idx}
                className="glass rounded-xl p-5 card-hover animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className={`flex ${card.image ? 'flex-col md:flex-row gap-4' : ''}`}>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2" style={{ color: brand.secondary }}>
                      {t(card.title)}
                    </h4>
                    <p className="text-white/70 text-sm mb-3">{t(card.description)}</p>
                    <div className="notes-box rounded-lg p-3">
                      <p className="text-sm text-white/80">
                        <span className="font-semibold">
                          {lang === 'ar' ? 'الحل: ' : lang === 'uz' ? 'Yechim: ' : lang === 'bn' ? 'সমাধান: ' : lang === 'fr' ? 'Solution : ' : lang === 'ru' ? 'Решение: ' : 'Solution: '}
                        </span>
                        {t(card.solution)}
                      </p>
                    </div>
                  </div>
                  {card.image && (
                    <div className="flex-shrink-0 flex items-center justify-center">
                      <img
                        src={card.image}
                        alt={t(card.title)}
                        className="rounded-xl max-w-full md:max-w-[200px] max-h-[200px] object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {step.notes && (step.notes[lang] || step.notes[defaultLanguage]) && (
          <div className="notes-box rounded-xl p-4 mt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: brand.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white/80 text-sm">{t(step.notes[lang] || step.notes[defaultLanguage])}</p>
            </div>
          </div>
        )}

        {step.warning && (step.warning[lang] || step.warning[defaultLanguage]) && (
          <div className="warning-box rounded-xl p-4 mt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: brand.secondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-white/90 font-medium text-sm whitespace-pre-line">{t(step.warning[lang] || step.warning[defaultLanguage])}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: brand.background }}>
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full opacity-10 blur-3xl"
          style={{ background: brand.primary }}
        />
        <div 
          className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full opacity-10 blur-3xl"
          style={{ background: brand.secondary }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo and brand name */}
          <div className="flex items-center gap-3">
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-8 md:h-9 w-auto max-w-[140px]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-xl md:text-2xl font-bold gradient-text">{brand.name}</span>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-1">
            {/* TOC dropdown */}
            <div className="relative" ref={tocRef}>
              <button
                onClick={() => { setTocOpen(!tocOpen); setLangMenuOpen(false); }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Table of contents"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {tocOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 max-h-96 overflow-y-auto glass rounded-xl py-2 shadow-xl">
                  {steps.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => handleStepChange(idx)}
                      className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center gap-3 ${
                        currentStep === idx ? 'bg-white/10' : ''
                      }`}
                    >
                      <span 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: currentStep === idx ? brand.primary : 'rgba(255,255,255,0.1)' }}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-sm text-white/90 truncate">
                        {t(s.title[lang] || s.title[defaultLanguage])}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => { setLangMenuOpen(!langMenuOpen); setTocOpen(false); }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
              >
                <span>{lang.toUpperCase()}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 glass rounded-xl py-2 shadow-xl">
                  {languages.map((l) => (
                    <button
                      key={l}
                      onClick={() => handleLangChange(l)}
                      className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors text-sm ${
                        lang === l ? 'text-white font-medium' : 'text-white/70'
                      }`}
                    >
                      {languageNames[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <div className="progress-bar h-full" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 pt-20 pb-28 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-white/50 text-sm">
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          {/* Step content */}
          <div 
            key={`${currentStep}-${lang}`}
            className={`glass rounded-3xl p-6 md:p-10 ${isAnimating ? 'animate-fade-in-up' : ''}`}
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: brand.primary }}>
              {t(step.title[lang] || step.title[defaultLanguage])}
            </h1>
            {renderContent(step)}
            {step.image && (
              <div className="mt-6 flex justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <img
                  src={step.image}
                  alt={t(step.title[lang] || step.title[defaultLanguage])}
                  className="rounded-2xl max-w-full md:max-w-md shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleStepChange(idx)}
                className={`nav-dot ${currentStep === idx ? 'active' : ''}`}
                aria-label={`Step ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => handleStepChange(currentStep - 1)}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              currentStep === 0 
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:bg-white/10'
            }`}
          >
            <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-white/50 text-xs text-center max-w-[50%] truncate">
            {t(step.title[lang] || step.title[defaultLanguage])}
          </span>

          <button
            onClick={() => handleStepChange(currentStep + 1)}
            disabled={currentStep === steps.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              currentStep === steps.length - 1 
                ? 'opacity-30 cursor-not-allowed' 
                : 'btn-primary'
            }`}
          >
            <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
}
