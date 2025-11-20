# Internationalization (i18n) Setup Guide

This document explains the complete i18n implementation for the Social Media App.

## Overview

The application now supports full multilingual functionality with:
- **English (en)** - Default language, LTR layout
- **Persian (fa)** - RTL layout support

## Architecture

### 1. Translation Files
Translation files are located in the `messages/` directory:
- `messages/en.json` - English translations
- `messages/fa.json` - Persian translations

### 2. Configuration Files

#### `src/i18n/config.ts`
Defines supported locales, their properties (direction, name, native name), and helper functions.

#### `src/i18n/request.ts`
Configures next-intl to work with the App Router. Determines locale from cookies with fallback to 'en'.

#### `src/middleware.ts`
Next.js middleware that handles locale detection and cookie management.

#### `next.config.mjs`
Includes the next-intl plugin configuration.

### 3. Components

#### `src/components/LocaleProvider.tsx`
Client component that provides translations to the app and sets HTML `dir` and `lang` attributes.

#### `src/components/LanguageSwitcher.tsx`
Interactive component allowing users to switch between languages. Automatically:
- Updates the locale cookie
- Refreshes the page
- Changes RTL/LTR direction

## Features

### RTL/LTR Support
- Persian (fa) automatically switches to RTL mode
- English (en) uses LTR mode
- Direction is set on the HTML element and persists across page navigation

### Language Persistence
- Selected language is stored in a cookie (`locale`)
- Cookie persists for 1 year
- Language preference is maintained across sessions

### Automatic Direction Switching
- When switching to Persian, the entire UI flips to RTL
- All text alignment, spacing, and layout adapt automatically
- Tailwind CSS classes work correctly in both directions

## Usage

### Using Translations in Components

#### Server Components
```tsx
import { getTranslations } from 'next-intl/server';

export default async function MyComponent() {
  const t = await getTranslations('common');
  return <h1>{t('appName')}</h1>;
}
```

#### Client Components
```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');
  return <h1>{t('appName')}</h1>;
}
```

### Translation Keys Structure

Translations are organized by feature:
- `common.*` - Common UI elements (buttons, labels, etc.)
- `auth.*` - Authentication pages
- `posts.*` - Post-related content
- `user.*` - User profile and actions
- `search.*` - Search functionality
- `notifications.*` - Notifications
- `messages.*` - Messaging
- `errors.*` - Error messages

### Adding New Translations

1. Add the key to both `messages/en.json` and `messages/fa.json`
2. Use the translation key in your component
3. The translation will automatically work in both languages

Example:
```json
// messages/en.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my feature"
  }
}

// messages/fa.json
{
  "myFeature": {
    "title": "ویژگی من",
    "description": "این ویژگی من است"
  }
}
```

## RTL Styling

### CSS Support
The global CSS (`src/app/globals.css`) includes RTL-specific styles:
- Text alignment for RTL languages
- Spacing adjustments
- Typography improvements for Persian

### Tailwind CSS
Tailwind CSS v3.4+ has built-in RTL support. The `dir` attribute on the HTML element automatically handles:
- Logical properties (start/end instead of left/right)
- Text alignment
- Flexbox and Grid layouts

### Manual RTL Adjustments
If you need to manually adjust styles for RTL:

```css
[dir="rtl"] .my-class {
  /* RTL-specific styles */
}
```

## Language Switcher

The language switcher is integrated into the Navbar component. Users can:
1. Click the language icon
2. Select their preferred language
3. The page automatically refreshes with the new language and direction

## Testing

To test the i18n implementation:

1. **Language Switching**: Click the language switcher in the navbar
2. **RTL Layout**: Switch to Persian and verify:
   - Text is right-aligned
   - Layout flows from right to left
   - Icons and buttons are positioned correctly
3. **Persistence**: Refresh the page - language should persist
4. **All Text**: Verify all UI text is translated

## File Structure

```
├── messages/
│   ├── en.json          # English translations
│   └── fa.json          # Persian translations
├── src/
│   ├── i18n/
│   │   ├── config.ts    # Locale configuration
│   │   └── request.ts   # Next-intl request config
│   ├── components/
│   │   ├── LocaleProvider.tsx      # Locale provider
│   │   └── LanguageSwitcher.tsx    # Language switcher UI
│   ├── middleware.ts    # Next.js middleware
│   └── app/
│       └── layout.tsx   # Root layout with i18n
└── next.config.mjs      # Next.js config with next-intl plugin
```

## Notes

- The locale is stored in cookies, not in the URL (localePrefix: 'never')
- All server components that need translations should use `getTranslations`
- All client components should use `useTranslations`
- The HTML `dir` and `lang` attributes are automatically set based on the current locale
- Persian typography uses the same font family as English (Geist Sans)

## Troubleshooting

### Translations not showing
- Ensure the component is wrapped in `LocaleProvider`
- Check that translation keys exist in both `en.json` and `fa.json`
- Verify the component is using the correct translation hook

### RTL not working
- Check that the HTML element has `dir="rtl"` attribute
- Verify Persian locale is selected
- Ensure CSS includes RTL-specific styles

### Language not persisting
- Check browser cookies are enabled
- Verify the cookie is being set in the middleware
- Check cookie expiration settings

