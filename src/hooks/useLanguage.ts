import { useState, useCallback } from 'react';
import { Language, defaultLanguage, t as translate } from '@/lib/i18n';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));
  }, []);

  const t = useCallback(
    (key: string) => translate(key, language),
    [language]
  );

  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
  };
}
