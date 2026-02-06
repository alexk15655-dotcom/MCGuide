# MCGuide - Complete Documentation

**Interactive Multilingual Agent Guide with Branding Support**

Version: 0.1.0 | Last Updated: February 2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Installation & Setup](#4-installation--setup)
5. [Running the Application](#5-running-the-application)
6. [Architecture](#6-architecture)
7. [Components Reference](#7-components-reference)
8. [TypeScript Interfaces](#8-typescript-interfaces)
9. [Utility Functions](#9-utility-functions)
10. [Configuration](#10-configuration)
    - [Brand Configuration](#101-brand-configuration)
    - [Content Configuration](#102-content-configuration)
11. [Routing & URL Structure](#11-routing--url-structure)
12. [Internationalization (i18n)](#12-internationalization-i18n)
13. [Theming & Styling](#13-theming--styling)
14. [Content Types](#14-content-types)
15. [Deployment](#15-deployment)
16. [Customization Guide](#16-customization-guide)
    - [Adding a New Brand](#161-adding-a-new-brand)
    - [Adding a New Language](#162-adding-a-new-language)
    - [Adding a New Step](#163-adding-a-new-step)
    - [Replacing Images](#164-replacing-images)
    - [Embedding Videos](#165-embedding-videos)
17. [Supported Brands](#17-supported-brands)
18. [Guide Steps Reference](#18-guide-steps-reference)

---

## 1. Overview

MCGuide is a Next.js-based web application that provides an interactive, step-by-step onboarding guide for agents working with Mobcash and affiliated betting platforms. The application supports **25 brands** and **6 languages** with full RTL (right-to-left) support for Arabic.

### Key Features

- Multi-brand support with dynamic color theming (25 brands)
- Multilingual content (English, Russian, Arabic, Uzbek, Bengali, French)
- RTL layout support for Arabic
- Interactive step-by-step navigation with smooth animations
- Table of contents dropdown
- Progress bar indicator
- Responsive design (mobile and desktop)
- Static site generation for all brand pages
- Lazy-loaded images and videos
- Glassmorphism UI with gradient accents
- YouTube/Vimeo video embedding
- Error cards with optional images
- Browser language auto-detection

---

## 2. Technology Stack

| Layer            | Technology                         | Version  |
|------------------|------------------------------------|----------|
| Framework        | Next.js (App Router)               | 16.1.6   |
| UI Library       | React                              | 19.2.3   |
| Language         | TypeScript                         | ^5       |
| Styling          | Tailwind CSS + PostCSS + Custom CSS| ^4       |
| Deployment       | Netlify                            | -        |
| Netlify Plugin   | @netlify/plugin-nextjs             | ^5.15.7  |
| Linting          | ESLint + eslint-config-next        | ^9       |
| Package Manager  | npm                                | -        |

### Dependencies

**Production:**
```
next: 16.1.6
react: 19.2.3
react-dom: 19.2.3
@netlify/plugin-nextjs: ^5.15.7
```

**Development:**
```
tailwindcss: ^4
@tailwindcss/postcss: ^4
typescript: ^5
@types/node: ^20
@types/react: ^19
@types/react-dom: ^19
eslint: ^9
eslint-config-next: 16.1.6
```

---

## 3. Project Structure

```
MCGuide/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (metadata, global CSS import)
│   ├── page.tsx                      # Home page (redirects to /mobcash)
│   ├── globals.css                   # Global styles, animations, CSS variables
│   └── [brand]/                      # Dynamic brand route
│       ├── page.tsx                  # Brand page (server component)
│       └── GuideClient.tsx           # Interactive guide (client component)
│
├── lib/                              # Shared utilities and types
│   ├── types.ts                      # TypeScript interfaces
│   └── utils.ts                      # Helper functions
│
├── config/                           # Application configuration
│   └── brands.json                   # Brand definitions (25 brands)
│
├── content/                          # Content data
│   └── steps.json                    # Guide steps (11 steps, 6 languages)
│
├── public/                           # Static assets
│   ├── logos/                        # Brand logo SVG files (25 files)
│   ├── images/                       # Step images (PNG/SVG)
│   └── favicon.ico                   # Favicon
│
├── package.json                      # NPM configuration and scripts
├── package-lock.json                 # Locked dependency tree
├── tsconfig.json                     # TypeScript compiler options
├── next.config.ts                    # Next.js configuration
├── netlify.toml                      # Netlify deployment settings
├── eslint.config.mjs                 # ESLint rules
├── postcss.config.mjs                # PostCSS/Tailwind plugin config
└── next-env.d.ts                     # Next.js TypeScript declarations
```

---

## 4. Installation & Setup

### Prerequisites

- Node.js (compatible with Next.js 16)
- npm

### Install Dependencies

```bash
npm install
```

### Environment Variables

No environment variables are required. All configuration is embedded in JSON files at build time.

---

## 5. Running the Application

### Development Server

```bash
npm run dev
```

Opens at `http://localhost:3000`. Hot-reload is enabled. The root URL redirects to `/mobcash` (default brand).

### Production Build

```bash
npm run build
```

Compiles the application and generates static pages for all 25 brands via `generateStaticParams()`. Output directory: `.next/`.

### Start Production Server

```bash
npm start
```

Serves the production build. Must run `npm run build` first.

### Lint

```bash
npm run lint
```

Runs ESLint with Next.js and TypeScript rules.

---

## 6. Architecture

### Design Overview

```
                    ┌─────────────────────────────┐
                    │         Static Content       │
                    │  brands.json   steps.json    │
                    └──────────┬──────────────────┘
                               │
                    ┌──────────▼──────────────────┐
                    │    Server Component          │
                    │    /app/[brand]/page.tsx      │
                    │                              │
                    │  - Route validation           │
                    │  - Static param generation    │
                    │  - Language resolution        │
                    │  - Dynamic metadata           │
                    └──────────┬──────────────────┘
                               │ props
                    ┌──────────▼──────────────────┐
                    │    Client Component          │
                    │    GuideClient.tsx            │
                    │                              │
                    │  - Step navigation            │
                    │  - Language switching          │
                    │  - Animations                 │
                    │  - Dynamic theming (CSS vars) │
                    │  - RTL support                │
                    │  - Content rendering           │
                    └─────────────────────────────┘
```

### Key Patterns

| Pattern | Description |
|---------|-------------|
| **Static Site Generation** | `generateStaticParams()` pre-renders all brand routes at build time |
| **Server/Client Split** | `page.tsx` (server) handles data fetching; `GuideClient.tsx` (client) handles interactivity |
| **CSS Variable Theming** | Brand colors injected at runtime via `document.documentElement.style.setProperty()` |
| **Localization Fallback** | Content falls back from requested language to default language (`en`) |
| **Template Placeholders** | `{{brand}}` in content is dynamically replaced with the brand name |
| **Click-outside Detection** | `useRef` + `mousedown` event listener to close dropdown menus |
| **RTL Support** | `document.documentElement.dir` set to `rtl` for Arabic, `ltr` otherwise |

---

## 7. Components Reference

### `app/layout.tsx` - Root Layout

The root layout wraps all pages with HTML structure and global CSS.

```tsx
export const metadata: Metadata = {
  title: "Agent Guide",
  description: "Interactive guide for agents",
};
```

- Imports `globals.css`
- Sets page `lang="en"`
- Provides `<html>` and `<body>` wrapper

---

### `app/page.tsx` - Home Page

```tsx
export default function Home() {
  redirect('/mobcash');
}
```

Simple server component that redirects the root URL `/` to `/mobcash` (default brand).

---

### `app/[brand]/page.tsx` - Brand Page (Server Component)

**Responsibilities:**
- Validates the `brand` URL parameter against `brands.json`
- Returns 404 if brand is not found (`notFound()`)
- Resolves language from `?lang=` query parameter
- Falls back to default language if the requested language is unsupported
- Generates static params for all 25 brands
- Generates dynamic metadata per brand

**Key Functions:**

| Function | Description |
|----------|-------------|
| `generateStaticParams()` | Returns an array of all brand slugs for static generation |
| `generateMetadata()` | Returns `{ title: "BrandName - Guide", description: "Agent guide for BrandName" }` |
| `BrandGuidePage()` | Main page component; validates brand, resolves language, renders `GuideClient` |

**Props passed to GuideClient:**

| Prop | Type | Description |
|------|------|-------------|
| `brand` | `Brand` | Brand object (name, logo, colors) |
| `brandSlug` | `string` | URL slug (e.g., `mobcash`) |
| `steps` | `Step[]` | Array of guide steps |
| `languages` | `string[]` | Available language codes |
| `languageNames` | `object` | Map of language codes to display names |
| `defaultLanguage` | `string` | Default language code (`en`) |
| `initialLang` | `string` | Resolved initial language |

---

### `app/[brand]/GuideClient.tsx` - Interactive Guide (Client Component)

The main interactive component that renders the full guide experience.

**State Variables:**

| State | Type | Default | Description |
|-------|------|---------|-------------|
| `currentStep` | `number` | `0` | Index of the currently displayed step |
| `lang` | `string` | `initialLang` | Current language code |
| `isAnimating` | `boolean` | `false` | Prevents navigation during animations |
| `tocOpen` | `boolean` | `false` | Table of contents dropdown visibility |
| `langMenuOpen` | `boolean` | `false` | Language selector dropdown visibility |

**Refs:**

| Ref | Purpose |
|-----|---------|
| `tocRef` | References the TOC dropdown for click-outside detection |
| `langRef` | References the language dropdown for click-outside detection |

**Effects (useEffect):**

1. **Browser language detection**: On mount, detects browser language and sets it if supported and no `?lang=` param exists
2. **CSS variable injection**: When `brand` or `lang` changes, updates CSS custom properties (`--primary`, `--secondary`, `--background`, `--primary-rgb`, `--secondary-rgb`) and document direction (`dir`)
3. **Click-outside handler**: Registers a `mousedown` listener to close dropdowns when clicking outside

**Methods:**

| Method | Parameters | Description |
|--------|-----------|-------------|
| `handleStepChange(newStep)` | `number` | Navigates to a new step with animation guard (600ms) |
| `handleLangChange(newLang)` | `string` | Switches language, updates URL query parameter via `replaceState` |
| `t(text)` | `string \| undefined` | Replaces `{{brand}}` placeholders with the actual brand name |
| `getLocalizedText(obj)` | `{ [key: string]: string }` | Returns localized text with fallback to default language |
| `renderContent(step)` | `Step` | Renders all content types for a given step |

**UI Sections:**

| Section | Description |
|---------|-------------|
| Background | Fixed decorative gradient blobs using brand colors |
| Header | Fixed top bar: brand logo, "Mobcash" gradient text, TOC button, language selector |
| Progress Bar | Horizontal bar showing completion percentage |
| Step Indicator | `"X / Y"` text centered above content |
| Content Card | Glassmorphism card with step title and rendered content |
| Navigation Dots | Clickable dots below the content card |
| Bottom Nav | Fixed bottom bar with Previous/Next buttons and current step title |

---

## 8. TypeScript Interfaces

Defined in `lib/types.ts`:

### Brand

```typescript
interface Brand {
  name: string;        // Display name (e.g., "Mobcash")
  logo: string;        // Path to SVG logo (e.g., "/logos/mobcash.svg")
  primary: string;     // Primary hex color (e.g., "#2563EB")
  secondary: string;   // Secondary hex color (e.g., "#F97316")
  background: string;  // Background hex color (e.g., "#0F172A")
}
```

### Brands

```typescript
interface Brands {
  [key: string]: Brand;  // Brand slug -> Brand object
}
```

### ErrorCard

```typescript
interface ErrorCard {
  title: string;        // Error title
  description: string;  // Error description
  solution: string;     // Resolution instructions
  image?: string;       // Optional error screenshot path
}
```

### Step

```typescript
interface Step {
  id: string;                                              // Unique identifier (e.g., "what-is")
  order: number;                                           // Display order (1-based)
  title: { [lang: string]: string };                       // Localized title
  content: { [lang: string]: string };                     // Localized main text
  notes?: { [lang: string]: string };                      // Optional info note
  warning?: { [lang: string]: string };                    // Optional warning box
  image?: string;                                          // Optional step image path
  video?: string;                                          // Optional video embed URL
  listItems?: { [lang: string]: string[] };                // Optional bullet list
  numberedSteps?: { [lang: string]: string[] };            // Optional numbered steps
  columns?: { [lang: string]: { decrease: string; increase: string } };  // Two-column layout
  errorCards?: { [lang: string]: ErrorCard[] };             // Optional error cards
}
```

### Content

```typescript
interface Content {
  languages: string[];                      // Array of supported language codes
  defaultLanguage: string;                  // Fallback language code
  languageNames: { [key: string]: string }; // Language code -> display name
  steps: Step[];                            // Array of guide steps
}
```

---

## 9. Utility Functions

Defined in `lib/utils.ts`:

### `hexToRgb(hex: string): string`

Converts a hexadecimal color string to an RGB values string.

```typescript
hexToRgb("#2563EB");  // Returns "37, 99, 235"
hexToRgb("#F97316");  // Returns "249, 115, 22"
hexToRgb("invalid");  // Returns "0, 0, 0" (fallback)
```

Used internally to set `--primary-rgb` and `--secondary-rgb` CSS variables for `rgba()` usage in styles.

### `replaceBrandName(text: string, brandName: string): string`

Replaces all occurrences of `{{brand}}` in a text string with the provided brand name.

```typescript
replaceBrandName("Welcome to {{brand}}!", "WowBet");
// Returns "Welcome to WowBet!"
```

Used throughout the UI to dynamically insert brand names into localized content.

---

## 10. Configuration

### 10.1 Brand Configuration

**File:** `config/brands.json`

Contains 25 brand definitions. Each brand is keyed by its URL slug.

**Schema:**

```json
{
  "brand-slug": {
    "name": "Brand Display Name",
    "logo": "/logos/brand-slug.svg",
    "primary": "#HEX_COLOR",
    "secondary": "#HEX_COLOR",
    "background": "#HEX_COLOR"
  }
}
```

**Color Properties:**

| Property | Usage |
|----------|-------|
| `primary` | Step titles, active nav dots, progress bar start, notes border, primary button gradient |
| `secondary` | Bullet points, warning border, error card titles, progress bar end, gradient text accent |
| `background` | Page background, dropdown menus |

---

### 10.2 Content Configuration

**File:** `content/steps.json`

Contains the full guide content with multilingual support.

**Top-level Schema:**

```json
{
  "languages": ["en", "ru", "ar", "uz", "bn", "fr"],
  "defaultLanguage": "en",
  "languageNames": {
    "en": "English",
    "ru": "Русский",
    "ar": "العربية",
    "uz": "O'zbek",
    "bn": "বাংলা",
    "fr": "Français"
  },
  "steps": [ ... ]
}
```

**Step Schema:**

Each step supports all fields defined in the `Step` TypeScript interface. All text fields use the pattern `{ "lang_code": "text" }` for localization. The `{{brand}}` placeholder is supported in all text fields.

---

## 11. Routing & URL Structure

| URL Pattern | Description |
|-------------|-------------|
| `/` | Redirects to `/mobcash` |
| `/{brand}` | Brand guide page with default language |
| `/{brand}?lang={code}` | Brand guide page with specific language |

**Examples:**

```
/mobcash              -> Mobcash guide, English (default)
/mobcash?lang=ru      -> Mobcash guide, Russian
/wowbet?lang=ar       -> WowBet guide, Arabic (RTL)
/1xslots?lang=fr      -> 1xSlots guide, French
/betjam               -> BetJam guide, auto-detected or default language
```

**Language Resolution Order:**

1. `?lang=` query parameter (if valid)
2. Browser language (`navigator.language`) (if supported, on client side)
3. Default language (`en`)

**Static Generation:**

All 25 brand routes are pre-rendered at build time via `generateStaticParams()`. Language switching happens client-side via `window.history.replaceState()`.

---

## 12. Internationalization (i18n)

### Supported Languages

| Code | Name | Direction |
|------|------|-----------|
| `en` | English | LTR |
| `ru` | Русский (Russian) | LTR |
| `ar` | العربية (Arabic) | **RTL** |
| `uz` | O'zbek (Uzbek) | LTR |
| `bn` | বাংলা (Bengali) | LTR |
| `fr` | Français (French) | LTR |

### Localization Approach

- All text content is stored in `steps.json` as objects keyed by language code
- The `getLocalizedText()` function returns text for the current language with fallback to the default language
- The `t()` function wraps `replaceBrandName()` for brand placeholder substitution
- Hardcoded UI labels (e.g., "Solution:", "Decreases", "Increases") use inline conditional chains based on the `lang` variable

### RTL Support

When Arabic (`ar`) is selected:
- `document.documentElement.dir` is set to `rtl`
- Tailwind's `rtl:` modifier is used for directional styling (e.g., `rtl:rotate-180` on navigation arrows)
- Warning boxes use `border-left` which visually flips to `border-right` in RTL context

---

## 13. Theming & Styling

### CSS Custom Properties

Defined in `:root` in `globals.css` and overridden at runtime:

| Variable | Default | Description |
|----------|---------|-------------|
| `--primary` | `#2563EB` | Primary brand color |
| `--secondary` | `#F97316` | Secondary brand color |
| `--background` | `#0F172A` | Page background color |
| `--primary-rgb` | `37, 99, 235` | Primary color as RGB values |
| `--secondary-rgb` | `249, 115, 22` | Secondary color as RGB values |

### Custom CSS Classes

| Class | Description |
|-------|-------------|
| `.glass` | Glassmorphism effect: semi-transparent white background, blur, subtle border |
| `.gradient-text` | Text with gradient fill from primary to secondary color |
| `.btn-primary` | Primary button with gradient background and hover lift effect |
| `.card-hover` | Card with hover elevation and shadow effect |
| `.warning-box` | Orange/red gradient background with secondary color left border |
| `.notes-box` | Primary color tinted background with primary color left border |
| `.nav-dot` | Circle navigation indicator, `.active` variant with glow effect |
| `.progress-bar` | Gradient bar from primary to secondary with smooth width transition |

### Animations

| Class | Keyframe | Duration | Description |
|-------|----------|----------|-------------|
| `.animate-fade-in-up` | `fadeInUp` | 0.5s | Fade in while sliding up 12px |
| `.animate-step-transition` | `stepTransition` | 0.35s | Fade in while sliding up 8px |
| `.animate-slide-in-left` | `slideInLeft` | 0.6s | Fade in while sliding from left 30px |
| `.animate-float` | `float` | 3s (infinite) | Gentle up/down floating motion |

### Font

The application uses **Manrope** (400-800 weight) loaded via `@font-face` from Google Fonts CDN, with `system-ui, sans-serif` as fallback.

### Scrollbar

Custom webkit scrollbar styling:
- 8px width
- Track: `rgba(255, 255, 255, 0.05)`
- Thumb: `var(--primary)`, hover: `var(--secondary)`

---

## 14. Content Types

Each guide step can include any combination of the following content types:

### Main Text (`content`)

Always present. Rendered as a paragraph with `whitespace-pre-line` for line break support.

### Bullet List (`listItems`)

Unordered list with colored bullet dots (secondary color). Items animate in with staggered delay.

### Numbered Steps (`numberedSteps`)

Ordered list with numbered circles (primary color background). Items animate in with staggered delay.

### Two-Column Layout (`columns`)

Side-by-side cards showing "Decreases" (red, down arrow) and "Increases" (green, up arrow). Responsive: stacks vertically on mobile.

### Error Cards (`errorCards`)

Cards displaying error scenarios with:
- Title (secondary color)
- Description
- Solution (in a notes-box)
- Optional image (displayed to the right on desktop, below on mobile; flipped for RTL)

### Notes Box (`notes`)

Informational callout with an info icon and primary color accent border.

### Warning Box (`warning`)

Warning callout with a warning triangle icon and secondary color accent border. Supports `whitespace-pre-line`.

### Image (`image`)

Lazy-loaded image centered below content. Auto-hides on load error.

### Video (`video`)

Responsive 16:9 iframe embed. Supports YouTube and Vimeo URLs. Lazy-loaded.

---

## 15. Deployment

### Netlify (Configured)

The project includes a `netlify.toml` configuration:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Deployment steps:**

1. Push the repository to GitHub
2. Connect the repository to Netlify via the Netlify UI
3. Netlify automatically detects `netlify.toml` and deploys

### Manual Deployment

1. Run `npm run build`
2. Deploy the `.next` directory to any Next.js-compatible hosting (Vercel, AWS, etc.)

---

## 16. Customization Guide

### 16.1 Adding a New Brand

1. Add a new entry to `config/brands.json`:

```json
{
  "newbrand": {
    "name": "NewBrand",
    "logo": "/logos/newbrand.svg",
    "primary": "#FF5733",
    "secondary": "#33FF57",
    "background": "#1A1A2E"
  }
}
```

2. Place the brand's SVG logo at `public/logos/newbrand.svg`

3. The brand page is immediately accessible at `/{brand-slug}` (e.g., `/newbrand`)

4. Rebuild the application (`npm run build`) for static generation

---

### 16.2 Adding a New Language

1. Add the language code to the `languages` array in `content/steps.json`:

```json
"languages": ["en", "ru", "ar", "uz", "bn", "fr", "es"]
```

2. Add the display name to `languageNames`:

```json
"languageNames": {
  ...
  "es": "Español"
}
```

3. Add translations for the new language in every step's text fields (`title`, `content`, `notes`, `warning`, `listItems`, `numberedSteps`, `columns`, `errorCards`)

4. If the language is RTL, add it to the RTL check in `GuideClient.tsx`:

```tsx
document.documentElement.dir = (lang === 'ar' || lang === 'he') ? 'rtl' : 'ltr';
```

5. Update hardcoded UI labels (e.g., "Solution:", "Decreases", "Increases") in `GuideClient.tsx` to include the new language

---

### 16.3 Adding a New Step

Add a new step object to the `steps` array in `content/steps.json`:

```json
{
  "id": "new-step-id",
  "order": 12,
  "title": {
    "en": "New Step Title",
    "ru": "Заголовок нового шага"
  },
  "content": {
    "en": "Step content with {{brand}} placeholder.",
    "ru": "Содержимое шага с подстановкой {{brand}}."
  },
  "notes": {
    "en": "Optional informational note.",
    "ru": "Необязательная информационная заметка."
  },
  "image": "/images/step-12.png"
}
```

Include translations for all supported languages. Add any optional fields (`warning`, `listItems`, `numberedSteps`, `columns`, `errorCards`, `video`) as needed.

---

### 16.4 Replacing Images

1. Place new images in `public/images/` (PNG or SVG recommended)
2. Update the `image` field in the corresponding step in `content/steps.json`:

```json
"image": "/images/step-01.png"
```

For error card images, update the `image` field within the error card object:

```json
{
  "title": "Error Title",
  "description": "...",
  "solution": "...",
  "image": "/images/error-screenshot.png"
}
```

---

### 16.5 Embedding Videos

Set the `video` field in a step to a valid embed URL:

**YouTube:**
```json
"video": "https://www.youtube.com/embed/VIDEO_ID"
```

**Vimeo:**
```json
"video": "https://player.vimeo.com/video/VIDEO_ID"
```

The video renders in a responsive 16:9 container with lazy loading.

---

## 17. Supported Brands

| # | Slug | Display Name | Primary Color | Secondary Color | Background |
|---|------|-------------|---------------|-----------------|------------|
| 1 | `mobcash` | Mobcash | `#2563EB` | `#F97316` | `#0F172A` |
| 2 | `wowbet` | WowBet | `#8A42FD` | `#EAEAF9` | `#080A26` |
| 3 | `ultrapari` | UltraPari | `#8DFFB0` | `#420031` | `#1E1B4B` |
| 4 | `1xslots` | 1xSlots | `#EF4444` | `#FBBF24` | `#1C1917` |
| 5 | `apuesta360` | Apuesta 360 | `#004225` | `#2D2D2D` | `#0C1222` |
| 6 | `betjam` | BetJam | `#5C00A3` | `#FFB700` | `#2E005C` |
| 7 | `dbbet` | DBbet | `#84CC16` | `#F472B6` | `#1A2E05` |
| 8 | `fairpari` | FairPari | `#FBBF24` | `#3B82F6` | `#292524` |
| 9 | `fastpari` | FastPari | `#14B8A6` | `#F97316` | `#042F2E` |
| 10 | `funpari` | FunPari | `#E11D48` | `#22D3EE` | `#1F2937` |
| 11 | `jvspin` | JVSpin | `#7C3AED` | `#34D399` | `#0D0D1A` |
| 12 | `paripulse` | PariPulse | `#0891B2` | `#FB923C` | `#0A1628` |
| 13 | `yohoho` | Yohoho.bet | `#D90200` | `#FF9800` | `#0F0F0F` |
| 14 | `lilbet` | LilBet | `#34CC67` | `#082B53` | `#04182f` |
| 15 | `betongame` | BetOnGame | `#DC2626` | `#38BDF8` | `#171717` |
| 16 | `wepari` | WePari | `#4F46E5` | `#FCD34D` | `#1E1E2E` |
| 17 | `coldbet` | ColdBet | `#0D9488` | `#E879F9` | `#0F2830` |
| 18 | `luckypari` | LuckyPari | `#EA580C` | `#818CF8` | `#1C1412` |
| 19 | `winebet` | Winebet | `#BF2227` | `#E8E8E8` | `#1E2029` |
| 20 | `wekawin` | Wekawin | `#A21CAF` | `#4ADE80` | `#1A0A1F` |
| 21 | `b86` | B86.bet | `#0284C7` | `#F59E0B` | `#0C1929` |
| 22 | `grandpari` | GrandPari | `#65A30D` | `#F43F5E` | `#1A2E0A` |
| 23 | `greenbet` | GreenBet | `#D946EF` | `#22C55E` | `#1E0A2E` |
| 24 | `secretbet` | SecretBet | `#0369A1` | `#FBBF24` | `#0A1929` |

---

## 18. Guide Steps Reference

The guide consists of 11 steps covering the full agent onboarding flow:

| # | ID | Title (EN) | Content Types |
|---|-----|-----------|---------------|
| 1 | `what-is` | What is Mobcash? | content, notes, warning, image |
| 2 | `find-players` | You'll easily find players | content, listItems, notes, image |
| 3 | `limit` | Limit | content, columns, image |
| 4 | `balance` | Balance | content, columns, notes, image |
| 5 | `deposit` | Depositing to players | content, numberedSteps, notes, warning, image |
| 6 | `withdraw` | Withdrawing to players | content, numberedSteps, notes, warning, image |
| 7 | `prepayment` | Prepayment | content, numberedSteps, notes, image |
| 8 | `commission` | Commission | content, warning, notes, image |
| 9 | `errors` | Errors | content, numberedSteps, warning, image |
| 10 | `common-errors` | Common errors | content, errorCards, image |
| 11 | `important-info` | Important information | content, numberedSteps, image |
