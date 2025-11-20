/**
 * i18n Configuration
 * 
 * Defines supported locales and their properties.
 * RTL languages should have direction: 'rtl', LTR languages should have direction: 'ltr'.
 */

export type Locale = 'en' | 'fa';

export const locales: Locale[] = ['en', 'fa'];

export const defaultLocale: Locale = 'en';

/**
 * Locale configuration mapping
 * Each locale has its direction (RTL/LTR) and display name
 */
export const localeConfig: Record<
  Locale,
  {
    direction: 'ltr' | 'rtl';
    name: string;
    nativeName: string;
  }
> = {
  en: {
    direction: 'ltr',
    name: 'English',
    nativeName: 'English',
  },
  fa: {
    direction: 'rtl',
    name: 'Persian',
    nativeName: 'فارسی',
  },
};

/**
 * Check if a locale is RTL
 */
export function isRTL(locale: Locale): boolean {
  return localeConfig[locale].direction === 'rtl';
}

/**
 * Get the direction for a locale
 */
export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return localeConfig[locale].direction;
}

