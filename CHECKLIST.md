# ✅ Setup Checklist

Use this checklist when setting up the project locally:

## Before You Start

- [ ] Node.js 18+ installed
- [ ] npm, yarn, or pnpm installed
- [ ] Project downloaded/exported from Figma Make

## Step-by-Step Setup

### 1. File Structure
- [ ] Created `src/` folder
- [ ] Moved `App.tsx` to `src/App.tsx`
- [ ] Moved `components/` to `src/components/`
- [ ] Moved `pages/` to `src/pages/`
- [ ] Moved `styles/` to `src/styles/`
- [ ] `main.tsx` is in `src/main.tsx`

### 2. Logo/Assets
- [ ] Created `src/assets/` folder
- [ ] Downloaded logo from Figma Make
- [ ] Saved logo as `src/assets/logo.png`

**Alternative (if no logo):**
- [ ] Used placeholder div instead (see QUICK-FIX.md)

### 3. Dependencies
- [ ] Ran `npm install` (or `yarn install` / `pnpm install`)
- [ ] No errors during installation

### 4. Configuration Files Present
- [ ] `package.json` ✅
- [ ] `vite.config.ts` ✅
- [ ] `tsconfig.json` ✅
- [ ] `tailwind.config.js` ✅
- [ ] `postcss.config.js` ✅
- [ ] `index.html` ✅

### 5. Run the Project
- [ ] Ran `npm run dev`
- [ ] No errors in terminal
- [ ] Browser opened to `http://localhost:5173`
- [ ] Page loads successfully

## Final Structure Should Look Like:

```
collabiko-landing-page/
├── src/
│   ├── assets/
│   │   └── logo.png           ← YOUR LOGO
│   ├── components/
│   │   ├── figma/
│   │   ├── ui/
│   │   ├── About.tsx
│   │   ├── Blog.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   └── Testimonials.tsx
│   ├── pages/
│   │   └── BlogPage.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── node_modules/              ← Created after npm install
├── index.html
├── package.json
├── package-lock.json          ← Created after npm install
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── README.md
├── SETUP.md
├── QUICK-FIX.md
└── CHECKLIST.md              ← YOU ARE HERE
```

## Common Issues

### ❌ Error: "Cannot find module '../assets/logo.png'"
**Fix:** 
1. Make sure `logo.png` exists in `src/assets/`
2. Or use the placeholder div (see QUICK-FIX.md)

### ❌ Error: "The `border-border` class does not exist"
**Fix:** 
1. Make sure you have `tailwind.config.js` in the root
2. Check that `package.json` has Tailwind v3.4.1 (not v4)
3. Run `npm install` again

### ❌ Error: "Cannot find module './App'"
**Fix:** 
1. Make sure `App.tsx` is in `src/` folder
2. Check that `main.tsx` is in `src/` folder

### ❌ Port 5173 already in use
**Fix:**
1. Kill the existing process
2. Or change port in `vite.config.ts`

## Success! ✨

If you see the Collabiko landing page in your browser with:
- ✅ Header with navigation
- ✅ Hero section
- ✅ About section
- ✅ Testimonials
- ✅ Contact form
- ✅ Footer

Then you're all set! 🎉

## Next Steps

- [ ] Test light/dark mode toggle
- [ ] Test responsive design (resize browser)
- [ ] Navigate to Blog page
- [ ] Test all navigation links
- [ ] Customize content as needed
- [ ] Replace placeholder images if desired
- [ ] Update text content
- [ ] Add your own logo

## Build for Production

When ready to deploy:

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

Your production files will be in the `dist/` folder.
