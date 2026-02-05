'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', brand.primary);
    document.documentElement.style.setProperty('--secondary', brand.secondary);
    document.documentElement.style.setProperty('--background', brand.background);
    document.documentElement.style.setProperty('--primary-rgb', hexToRgb(brand.primary));
    document.documentElement.style.setProperty('--secondary-rgb', hexToRgb(brand.secondary));
  }, [brand]);

  const handleStepChange = (newStep: number) => {
    if (newStep === currentStep || isAnimating) return;
    setIsAnimating(true);
    setCurrentStep(newStep);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleLangChange = (newLang: string) => {
    setLang(newLang);
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

  const renderContent = (step: Step) => {
    const content = step.content[lang] || step.content[defaultLanguage];
    
    return (
      <div className="space-y-6">
        {/* Main content */}
        <p className="text-lg text-white/80 whitespace-pre-line">{t(content)}</p>

        {/* List items */}
        {step.listItems && step.listItems[lang] && (
          <ul className="space-y-3">
            {step.listItems[lang].map((item, idx) => (
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

        {/* Numbered steps */}
        {step.numberedSteps && step.numberedSteps[lang] && (
          <ol className="space-y-4">
            {step.numberedSteps[lang].map((item, idx) => (
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

        {/* Two columns for limit/balance */}
        {step.columns && step.columns[lang] && (
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="glass rounded-xl p-5 card-hover">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-6 h-6" style={{ color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="font-semibold text-red-400">{lang === 'ru' ? 'Уменьшается' : 'Decreases'}</span>
              </div>
              <p className="text-white/70 text-sm whitespace-pre-line">{t(step.columns[lang].decrease)}</p>
            </div>
            <div className="glass rounded-xl p-5 card-hover">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-6 h-6" style={{ color: '#22C55E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="font-semibold text-green-400">{lang === 'ru' ? 'Увеличивается' : 'Increases'}</span>
              </div>
              <p className="text-white/70 text-sm whitespace-pre-line">{t(step.columns[lang].increase)}</p>
            </div>
          </div>
        )}

        {/* Error cards */}
        {step.errorCards && step.errorCards[lang] && (
          <div className="grid gap-4 mt-6">
            {step.errorCards[lang].map((card: ErrorCard, idx: number) => (
              <div 
                key={idx} 
                className="glass rounded-xl p-5 card-hover animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <h4 className="font-bold text-lg mb-2" style={{ color: brand.secondary }}>
                  {t(card.title)}
                </h4>
                <p className="text-white/70 text-sm mb-3">{t(card.description)}</p>
                <div className="notes-box rounded-lg p-3">
                  <p className="text-sm text-white/80">
                    <span className="font-semibold">{lang === 'ru' ? 'Решение: ' : 'Solution: '}</span>
                    {t(card.solution)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        {step.notes && step.notes[lang] && (
          <div className="notes-box rounded-xl p-4 mt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: brand.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white/80 text-sm">{t(step.notes[lang])}</p>
            </div>
          </div>
        )}

        {/* Warning */}
        {step.warning && step.warning[lang] && (
          <div className="warning-box rounded-xl p-4 mt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: brand.secondary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-white/90 font-medium text-sm">{t(step.warning[lang])}</p>
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
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ color: brand.primary }}>
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="w-10 h-10"
                style={{ filter: 'brightness(0) invert(1)' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <span className="text-xl font-bold gradient-text">{brand.name}</span>
          </div>

          {/* Language switcher */}
          <div className="flex items-center gap-2">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  lang === l 
                    ? 'text-white' 
                    : 'text-white/50 hover:text-white/80'
                }`}
                style={lang === l ? { background: brand.primary } : {}}
              >
                {languageNames[l]}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <div className="progress-bar h-full" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 pt-24 pb-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-white/50 text-sm">
              {lang === 'ru' ? 'Шаг' : 'Step'} {currentStep + 1} / {steps.length}
            </span>
          </div>

          {/* Step content */}
          <div 
            key={`${currentStep}-${lang}`}
            className={`glass rounded-3xl p-8 md:p-12 ${isAnimating ? 'animate-fade-in-up' : ''}`}
          >
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-8 gradient-text">
              {t(step.title[lang] || step.title[defaultLanguage])}
            </h1>

            {/* Content */}
            {renderContent(step)}
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleStepChange(idx)}
                className={`nav-dot ${currentStep === idx ? 'active' : ''}`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => handleStepChange(currentStep - 1)}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 0 
                ? 'opacity-30 cursor-not-allowed' 
                : 'hover:bg-white/10'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">{lang === 'ru' ? 'Назад' : 'Back'}</span>
          </button>

          <span className="text-white/50 text-sm">
            {step.title[lang] || step.title[defaultLanguage]}
          </span>

          <button
            onClick={() => handleStepChange(currentStep + 1)}
            disabled={currentStep === steps.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === steps.length - 1 
                ? 'opacity-30 cursor-not-allowed' 
                : 'btn-primary'
            }`}
          >
            <span className="hidden sm:inline">{lang === 'ru' ? 'Далее' : 'Next'}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
}
