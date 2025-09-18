# CLAUDE.md - Project Documentation

## Project Overview

This is a Slidev presentation titled "Seeing Beyond the Framework Illusion" by Sean C Davis for CascadiaJS 2025. Slidev is a presentation framework that uses Vue.js and Markdown.

## Key Technologies

- **Slidev**: Presentation framework
- **Vue.js**: Component framework used by Slidev
- **UnoCSS**: Utility-first CSS framework for styling
- **Excalidraw**: Drawing integration for diagrams
- **TypeScript**: Configuration files
- **Netlify**: Deployment platform

## Project Structure

### Root Files

- `slides.md` - Main presentation content with frontmatter configuration
- `package.json` - Dependencies and scripts
- `netlify.toml` - Netlify deployment configuration
- `uno.config.ts` - UnoCSS configuration with custom color palette
- `.gitignore` - Git ignore patterns
- `.nvmrc` - Node version specification (v20)

### Directories

#### `/layouts/`

Custom Slidev layout components:

- `Setup.vue` - Simple layout (88 bytes)
- `SCDIntro.vue` - Sean C Davis intro layout with styling
- `Drawing.vue` - Layout for Excalidraw drawings
- `ContainedGif.vue` - GIF container layout
- `CodeExample.vue` - Code example layout
- `CodeComparison.vue` - Side-by-side code comparison
- `LogoGrid.vue` - Grid layout for logos

#### `/drawings/`

Excalidraw JSON files:

- `astro-build-process.excalidraw.json` (32KB)
- `framework-to-primitives.excalidraw.json` (30KB)

**IMPORTANT DEPLOYMENT ISSUE**: The slides.md references drawings at `./public/drawings/` but the actual files are in `./drawings/`. This is why drawings don't appear in production.

#### `/images/`

- Background images in `/bg/` subdirectory
- GIFs (arrested-dev-magic.gif, parks-rec-drumroll.gif, schitts-feelings.gif)
- PNG files (seancdavis-avatar.png, seancdavis-favicon.png, ax-blog-post.png)
- Icons in `/icons/` subdirectory

#### `/styles/`

- `index.css` - Global CSS with custom properties and layout overrides

#### `/setup/`

- `shiki.ts` - Syntax highlighting configuration

## Build & Deployment

### NPM Scripts

- `npm run dev` - Start development server with auto-open
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run export` - Export slides

### Netlify Configuration

- **Publish directory**: `dist`
- **Build command**: `npm run build`
- **Node version**: 20
- Redirects configured for SPA behavior

### Dependencies

- `@slidev/cli` v52.1.0
- `@slidev/theme-default` and `@slidev/theme-seriph`
- `slidev-addon-excalidraw` v1.0.4 for drawing integration
- `vue` v3.5.18
- `playwright-chromium` v1.55.0 (dev dependency)

## Styling & Theming

### Color Palette (UnoCSS)

Custom colors defined in `uno.config.ts`:

- **Gray scale**: 100-900 with specific hex values
- **Blue**: Default (#2260bf), dark (#1d4a8f), with alpha variant
- **Accent colors**: Green (#007785), lime (#9ce736), orange (#ff6b00), pink (#eea2bf), yellow (#ffd445)

### Fonts

- **Sans/Serif**: Source Serif Pro
- **Mono**: Operator Mono

## Presentation Configuration

### Frontmatter Settings

- Theme: default
- Background: Custom SVG (`./images/bg/scd-bg-shapes.svg`)
- Transition: slide-left
- Color scheme: light
- MDC: enabled
- SEO: Auto OG image generation
- Favicon: Custom Sean C Davis favicon

### Addons

- `slidev-addon-excalidraw` for interactive drawings

## Known Issues

1. **Drawings not showing in production**: The slides.md references drawings at `./public/drawings/` but files are actually in `./drawings/`. Need to either:
   - Move drawings to `public/drawings/` directory, OR
   - Update references in slides.md to point to correct path

## Development Workflow

1. Use `npm run dev` for development with hot reload
2. Drawings are created with Excalidraw and saved as JSON in `/drawings/`
3. Custom layouts in `/layouts/` for different slide types
4. Images stored in `/images/` with organized subdirectories
5. Build with `npm run build` - outputs to `dist/`
6. Deploy via Netlify which publishes the `dist/` directory

## Git Information

- Current branch: main
- Recent commits include package fixes, favicon updates, and layout fixes
- Clean working directory
