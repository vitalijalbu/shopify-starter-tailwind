# Skimo Festival - Shopify Theme 🎿

Un tema Shopify moderno e performante per Skimo Festival, costruito con Vite, Tailwind CSS v4, Alpine.js e GSAP.

## Stack Tecnologico

- **Build Tool**: Vite 7.1.7
- **CSS Framework**: Tailwind CSS v4.1.13
- **JavaScript Framework**: Alpine.js v3.15.0 + @alpinejs/focus
- **Animations**: GSAP v3.13.0
- **Carousel**: Swiper v12.0.2
- **Shopify Integration**: vite-plugin-shopify v4.0.2

## Installazione e Setup

### Prerequisiti
- Node.js 18+ 
- npm o yarn
- Shopify CLI 3.x
- Accesso allo store Shopify

### Setup Iniziale

1. **Clona il repository**
   ```bash
   git clone https://github.com/rideonagency/skimofestival.git
   cd skimofestival
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Setup hooks Git** (opzionale)
   ```bash
   npm run setup
   ```

4. **Configura l'ambiente**
   - Crea un file `.env` con le tue credenziali Shopify
   - Configura `shopify.theme.toml` con il tuo store

### Sviluppo

#### Server di Sviluppo Locale (solo Vite)
```bash
npm run dev
```
Avvia Vite su `http://localhost:5173` per sviluppo degli asset statici.

#### Server di Sviluppo Shopify
```bash
npm run shopify:dev
```
Avvia il server Shopify con hot-reload del tema.

#### Sviluppo Completo (consigliato)
```bash
# Terminal 1: Vite dev server
npm run dev

# Terminal 2: Shopify theme dev
npm run shopify:dev
```

## Struttura del Progetto

```
skimofestival/
├── assets/                 # Asset compilati da Vite
│   ├── theme.[hash].css   # CSS principale
│   ├── theme.[hash].js    # JavaScript principale  
│   └── manifest.json      # Manifest degli asset
├── blocks/                # Blocchi Shopify
│   └── button.liquid
├── config/                # Configurazioni tema
│   ├── settings_data.json
│   └── settings_schema.json
├── layout/                # Layout Liquid
│   ├── theme.liquid
│   └── password.liquid
├── locales/               # Traduzioni
│   └── it.default.json
├── sections/              # Sezioni Shopify
│   ├── festival-hero.liquid
│   ├── featured-products.liquid
│   ├── footer.liquid
│   ├── header.liquid
│   └── ...
├── snippets/              # Snippet Liquid
│   ├── card-experience.liquid
│   ├── footer-newsletter.liquid
│   ├── icon.liquid
│   └── ...
├── src/                   # Codice sorgente (Vite)
│   └── entrypoints/
│       ├── theme.css      # CSS principale (Tailwind)
│       ├── theme.js       # JavaScript principale (Alpine.js)
│       ├── carousel.js    # Carousel specifico
│       ├── swiper.css     # Stili Swiper
│       └── ...
├── templates/             # Template Shopify
│   ├── index.json
│   ├── product.json
│   ├── collection.json
│   └── ...
├── vite.config.js         # Configurazione Vite
├── tailwind.config.js     # Configurazione Tailwind
├── shopify.theme.toml     # Configurazione Shopify CLI
└── package.json
```

### Directory Chiave

#### `/src/entrypoints/`
- **theme.css**: Stili principali con Tailwind CSS v4, variabili CSS e componenti
- **theme.js**: JavaScript principale con Alpine.js e inizializzazioni
- **carousel.js**: Logica specifica per carousel e slider
- **swiper.css**: Stili personalizzati per Swiper.js

#### `/sections/`
Sezioni Shopify personalizzate:
- `festival-hero.liquid`: Hero section del festival
- `featured-products.liquid`: Prodotti in evidenza
- `footer.liquid`: Footer modulare con newsletter
- `header.liquid`: Header con navigazione

#### `/snippets/`
Componenti riutilizzabili:
- `card-experience.liquid`: Card prodotto con overlay e tags
- `footer-newsletter.liquid`: Form newsletter del footer
- `icon.liquid`: Sistema di icone SVG

### Sistema di Build

Vite compila automaticamente i file in `/src/entrypoints/` e li inserisce nella cartella `/assets/` con hash per il caching. I file vengono referenziati nei template Liquid tramite il manifest generato.

## Comandi Disponibili

Tutti i comandi vanno eseguiti dalla root del progetto:

| Comando | Descrizione |
|---------|-------------|
| `npm install` | Installa le dipendenze |
| `npm run dev` | Avvia il server di sviluppo Vite |
| `npm run build` | Compila gli asset per produzione |
| `npm run preview` | Anteprima del build di produzione |
| `npm run check` | Verifica il build per produzione |
| `npm run shopify:dev` | Avvia Shopify theme dev server |
| `npm run shopify:push` | Carica il tema su Shopify |
| `npm run shopify:pull` | Scarica il tema da Shopify |
| `npm run setup` | Configura gli hook Git |

## Configurazione

### Tailwind CSS v4
Il progetto usa Tailwind CSS v4 con configurazione nel file `src/entrypoints/theme.css`:

- **Design System**: Variabili CSS personalizzate per colori, spacing, font
- **Componenti**: Classi utility per heading, badge, form, button
- **Responsive**: Breakpoint e media query configurabili

### Alpine.js
Configurazione in `src/entrypoints/theme.js`:

- **Focus Plugin**: Gestione del focus per accessibilità
- **Componenti**: Modal, carousel, form interattivi
- **Global State**: Store Alpine per stato dell'applicazione

### Vite Configuration
- **Entry Points**: `theme.js` e `theme.css`
- **Output**: Hash dei file per caching ottimale
- **Integration**: vite-plugin-shopify per integrazione seamless

## Design System

### Heading Classes
```html
<h1 class="heading-1">Titolo H1 (120px)</h1>
<h2 class="heading-2">Titolo H2 (96px)</h2>
<h3 class="heading-3">Titolo H3 (72px)</h3>
```

### Badge System
```html
<span class="badge">Tag Prodotto</span>
<span class="badge badge-primary">Badge Primario</span>
```

### Color System
- **Primary**: `#228072` (Verde principale)
- **Accent**: `#31B39D` (Teal), `#2EA4DA` (Blue)
- **Gray Scale**: Da `#F7F8F8` a `#25272C`

## Performance

- **Vite HMR**: Hot module replacement per sviluppo veloce
- **Code Splitting**: Separazione automatica del codice
- **Asset Optimization**: Minificazione e ottimizzazione automatica
- **Modern CSS**: Tailwind CSS v4 con CSS nativo

## Supporto Browser

- Chrome/Safari/Firefox moderni
- CSS Grid e Flexbox supportati
- Alpine.js compatibile con IE11+ (tramite polyfill)

---

**Sviluppato da**: [Rideon Agency](https://rideon.agency)  
**Tema**: Skimo Festival Shopify Theme
