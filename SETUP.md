# 🚀 Quick Setup Guide for Local Development

## ✅ What's Already Done

I've updated the code to work locally:
- ✅ All `figma:asset` imports changed to `../assets/logo.png`
- ✅ All configuration files created (`package.json`, `vite.config.ts`, etc.)
- ✅ Ready to run after you complete the steps below

## 📋 Setup Checklist

### Step 1: Get the Logo Image

**Option A - From Figma Make (if still in the tool):**
1. Right-click on the logo in the header
2. Save as `logo.png`

**Option B - Use a placeholder (temporary):**
```bash
# Create the assets folder
mkdir -p src/assets

# You can use any logo image and rename it to logo.png
# Place it in: src/assets/logo.png
```

### Step 2: Organize the File Structure

When you export/download from Figma Make, you need to move some files:

```bash
# Create the src folder if it doesn't exist
mkdir -p src

# Move the main files
mv App.tsx src/
mv components src/
mv pages src/
mv styles src/

# The structure should now be:
# /
# ├── src/
# │   ├── assets/
# │   │   └── logo.png
# │   ├── components/
# │   ├── pages/
# │   ├── styles/
# │   ├── App.tsx
# │   └── main.tsx
# ├── index.html
# ├── package.json
# └── ... (config files)
```

### Step 3: Install & Run

```bash
# Install all dependencies
npm install

# Start the development server
npm run dev
```

Your app should now be running at `http://localhost:5173` 🎉

## 🐛 Troubleshooting

### Error: Cannot find module '../assets/logo.png'
- Make sure `logo.png` exists in `src/assets/`
- Check that the file name is exactly `logo.png` (lowercase)

### Error: Cannot find module './App'
- Make sure `App.tsx` is in the `src/` folder
- Make sure `main.tsx` is in the `src/` folder

### Module not found errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

### Port 5173 already in use
- Change the port in `vite.config.ts`:
  ```ts
  export default defineConfig({
    plugins: [react()],
    server: {
      port: 3000, // or any other port
    },
  });
  ```

## 📦 Alternative: Use a Placeholder Logo

If you can't get the original logo, create a simple SVG placeholder:

```bash
# Create src/assets/logo.svg
```

Then update the imports in `Header.tsx` and `Footer.tsx`:
```tsx
import logo from '../assets/logo.svg';
```

Or use a simple colored div instead:

In `Header.tsx` and `Footer.tsx`, replace:
```tsx
<img src={logo} alt="Collabiko Logo" className="w-full h-full object-cover" />
```

With:
```tsx
<div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
  C
</div>
```

## 🎯 Final Folder Structure

```
collabiko-landing-page/
├── src/
│   ├── assets/
│   │   └── logo.png          ← YOUR LOGO HERE
│   ├── components/
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   ├── ui/               ← Shadcn components
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
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── postcss.config.js
├── .gitignore
├── README.md
└── SETUP.md               ← YOU ARE HERE

```

## ✨ You're All Set!

Once everything is set up, you can:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

Happy coding! 🚀
