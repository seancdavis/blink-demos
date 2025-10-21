# Seeing Beyond the Framework Illusion

A presentation by Sean C Davis for CascadiaJS 2025, built with [Slidev](https://sli.dev/).

## Overview

This presentation explores the concept of framework illusion in web development, encouraging developers to see beyond the specific tools and frameworks to understand the underlying principles and patterns.

## Getting Started

### Prerequisites

- Node.js 20 (specified in `.nvmrc`)
- npm or yarn

### Installation

```bash
yarn install
```

### Development

Start the development server:

```bash
yarn dev
```

This will:

- Start the Slidev development server
- Automatically open the presentation in your browser
- Enable hot reload for live editing

### Building for Production

```bash
yarn build
```

The built presentation will be output to the `dist/` directory.

### Exporting

To export the slides (e.g., as PDF):

```bash
yarn export
```

## Project Structure

```
slides/
├── slides.md              # Main presentation content
├── package.json           # Dependencies and scripts
├── netlify.toml           # Deployment configuration
├── uno.config.ts          # UnoCSS styling configuration
├── layouts/               # Custom Slidev layouts
│   ├── Setup.vue
│   ├── SCDIntro.vue
│   ├── Drawing.vue
│   ├── ContainedGif.vue
│   ├── CodeExample.vue
│   ├── CodeComparison.vue
│   └── LogoGrid.vue
├── drawings/              # Excalidraw diagrams
│   ├── astro-build-process.excalidraw.json
│   └── framework-to-primitives.excalidraw.json
├── images/                # Images and assets
│   ├── bg/               # Background images
│   ├── icons/            # Icon assets
│   └── *.{gif,png}       # Various media files
├── styles/
│   └── index.css         # Global styles
└── setup/
    └── shiki.ts          # Syntax highlighting configuration
```

## Features

### Custom Layouts

The presentation includes several custom Vue layouts:

- **Drawing**: For displaying Excalidraw diagrams
- **CodeComparison**: Side-by-side code comparison
- **CodeExample**: Single code example display
- **LogoGrid**: Grid layout for logos/icons
- **ContainedGif**: Properly sized GIF container
- **SCDIntro**: Speaker introduction layout

### Interactive Diagrams

Uses the `slidev-addon-excalidraw` addon to embed interactive diagrams created with Excalidraw. Diagrams are stored as JSON files in the `drawings/` directory.

### Custom Styling

- **Color Palette**: Custom color scheme defined in `uno.config.ts`
- **Typography**: Source Serif Pro for sans/serif, Operator Mono for code
- **Theme**: Light color scheme with custom background patterns

## Configuration

### Slidev Configuration

Key settings in the frontmatter of `slides.md`:

```yaml
theme: default
background: ./images/bg/scd-bg-shapes.svg
transition: slide-left
colorScheme: light
fonts:
  sans: Source Serif Pro
  serif: Source Serif Pro
  mono: Operator Mono
addons:
  - slidev-addon-excalidraw
```

### Styling

Custom colors and design tokens are configured in:

- `uno.config.ts` - UnoCSS configuration with custom color palette
- `styles/index.css` - Global CSS overrides and custom properties

## Deployment

This project is configured for deployment on Netlify:

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 20

The `netlify.toml` file includes necessary redirects for single-page application behavior.

## Dependencies

### Core

- `@slidev/cli` - Slidev presentation framework
- `@slidev/theme-default` & `@slidev/theme-seriph` - Slidev themes
- `vue` - Vue.js framework
- `slidev-addon-excalidraw` - Excalidraw integration

### Development

- `playwright-chromium` - For export functionality

## Contributing

When making changes:

1. Follow the existing code style and conventions
2. Test in development mode with `npm run dev`
3. Ensure the build works with `npm run build`
4. Check that drawings and images display correctly

## License

This presentation is created by Sean C Davis for CascadiaJS 2025.

## Resources

- [Slidev Documentation](https://sli.dev/)
- [UnoCSS Documentation](https://unocss.dev/)
- [Excalidraw](https://excalidraw.com/)
- [Sean C Davis](https://seancdavis.com/)
