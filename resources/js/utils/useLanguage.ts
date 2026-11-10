import { useState, useEffect, useCallback } from 'react';

export type AppLanguage = 'en' | 'bn';

const STORAGE_KEY = 'tech_dental_lang';
const EVENT_NAME = 'tech_dental_lang_changed';

/**
 * Default to English ('en') automatically.
 * Only use 'bn' if the user explicitly clicked the Bangla switcher in the current session.
 */
export function getInitialLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'en';
  try {
    const pathname = window.location.pathname.toLowerCase();
    // For single blog and single medicine, synchronize strictly with URL:
    // If URL starts with /bn/, use 'bn'; otherwise default to 'en'
    const isSingleBlogOrMed = pathname.match(/^(?:\/bn)?\/(?:blog|medicines|services?)\/[^\/]+$/i);
    if (isSingleBlogOrMed) {
      return pathname.startsWith('/bn/') ? 'bn' : 'en';
    }

    if (pathname.startsWith('/bn/') || pathname === '/bn') {
      return 'bn';
    }
    const sessionSaved = sessionStorage.getItem(STORAGE_KEY);
    if (sessionSaved === 'bn' || sessionSaved === 'en') return sessionSaved;
  } catch {
    // fallback
  }
  return 'en';
}

export function setAppLanguage(lang: AppLanguage) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { lang } }));
  } catch (e) {
    console.error('Failed to set language:', e);
  }
}

export function useLanguage() {
  const [language, setLanguageState] = useState<AppLanguage>(getInitialLanguage);

  useEffect(() => {
    // Sync document language on mount
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }

    const handleCustomChange = (e: any) => {
      const next = e?.detail?.lang;
      if (next === 'en' || next === 'bn') {
        setLanguageState(next);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'en' || e.newValue === 'bn')) {
        setLanguageState(e.newValue);
      }
    };

    window.addEventListener(EVENT_NAME, handleCustomChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(EVENT_NAME, handleCustomChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [language]);

  const setLanguage = useCallback((newLang: AppLanguage) => {
    setLanguageState(newLang);
    setAppLanguage(newLang);
  }, []);

  const toggleLanguage = useCallback(() => {
    const next: AppLanguage = language === 'bn' ? 'en' : 'bn';
    setLanguage(next);
  }, [language, setLanguage]);

  return {
    language,
    isBn: language === 'bn',
    setLanguage,
    toggleLanguage,
  };
}
