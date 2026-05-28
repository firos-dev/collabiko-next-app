# Collabiko Landing Page

A modern, responsive landing page for Collabiko - a platform connecting brands with influencers for meaningful collaborations.

## Features

- 🎨 **Light/Dark Mode** - Automatic theme switching with system preference detection
- 📱 **Fully Responsive** - Optimized for desktop (1440px), tablet (768px), and mobile (375px)
- ⚡ **Modern Tech Stack** - Built with React, TypeScript, and Tailwind CSS v4
- 🎭 **Glassmorphism Effects** - Modern UI with glass effects and smooth animations
- 📝 **Blog Section** - Dedicated blog page with category filtering
- 🎨 **Design System** - Comprehensive CSS variables and tokens

## Tech Stack

- **React 18.3** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v3.4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Slick** - Carousel/slider component

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. **Clone or download the project**

2. **Download the logo image:**
   - In Figma Make, find the logo image in the assets
   - Right-click and save it as `logo.png`
   - Create the folder: `src/assets/`
   - Place the logo: `src/assets/logo.png`

3. **Move files to src folder:**
   - Move `/App.tsx` → `/src/App.tsx`
   - Move `/components/` → `/src/components/`
   - Move `/pages/` → `/src/pages/`
   - Move `/styles/` → `/src/styles/`

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   - Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
/
├── src/
│   ├── assets/          # Project assets
│   │   └── logo.png
│   ├── components/       # React components
│   │   ├── ui/          # Shadcn UI components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   └── Blog.tsx
│   ├── pages/           # Page components
│   │   └── BlogPage.tsx
│   ├── styles/          # Global styles
│   │   └── globals.css
│   ├── App.tsx          # Main app component with routing
│   └── main.tsx         # App entry point
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Features & Sections

### Home Page
- **Header** - Sticky navigation with glassmorphism effect
- **Hero** - Dual CTAs for influencers and brands
- **About** - 4-step process explanation with gradient cards
- **Testimonials** - Carousel with user reviews
- **Contact** - Contact form with social links
- **Footer** - Links and social media

### Blog Page
- Article grid with categories
- Featured images and meta information
- Newsletter subscription CTA
- Responsive layout

## Design System

The app uses a comprehensive design system defined in `globals.css`:

- **Colors** - CSS custom properties for light/dark modes
- **Typography** - Century Gothic/Poppins font stack
- **Spacing** - 8px grid system
- **Shadows** - Multiple elevation levels
- **Border Radius** - Consistent rounding tokens
- **Breakpoints** - Mobile-first responsive design

## Customization

### Colors

Edit the CSS custom properties in `/src/styles/globals.css`:

```css
:root {
  --color-primary: 0 0 255; /* Blue #0000ff */
  /* ... other colors */
}
```

### Content

- Edit component files in `/src/components/`
- Modify images using the Unsplash tool or replace with your own
- Update text content directly in component files

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary.

## Support

For questions or issues, please contact the development team.