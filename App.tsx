import { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { isAuthenticated, getUserType, INTENDED_PATH_KEY } from './src/api/auth-storage';
import { getAccess, dashboardForUserType, ROUTE_ACCESS } from './src/routing';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BlogPage } from './pages/BlogPage';
import { AboutPage } from './pages/AboutPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { AuthPage } from './pages/AuthPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { BrandDashboard } from './pages/BrandDashboard';
import { BrandHomePage } from './pages/BrandHomePage';
import { SearchInfluencers } from './pages/SearchInfluencers';
import { CreateCampaign } from './pages/CreateCampaign';
import { InfluencerProfile } from './pages/InfluencerProfile';
import { InfluencerDashboard } from './pages/InfluencerDashboard';
import { NotificationsPage } from './pages/NotificationsPage';
import { BrandProfilePage } from './pages/BrandProfilePage';

// --- sessionStorage helpers (safe: silently ignore if storage is blocked) ---
function safeSessionSet(key: string, value: string): void {
  try { sessionStorage.setItem(key, value); } catch { /* ignore */ }
}

type PageName =
  | 'home' | 'blog' | 'about' | 'testimonials'
  | 'auth' | 'forgot-password'
  | 'brand-dashboard' | 'search-influencers' | 'create-campaign' | 'influencer-profile'
  | 'brand-home' | 'brand-profile'
  | 'influencer-dashboard' | 'brand-notifications' | 'influencer-notifications';

/** Pure mapping of URL path → page name. Used by handleNavigation. */
function pathToPage(path: string): PageName {
  if (path === '/blog') return 'blog';
  if (path === '/about') return 'about';
  if (path === '/testimonials') return 'testimonials';
  if (path === '/auth' || path === '/login' || path === '/register') return 'auth';
  if (path === '/forgot-password') return 'forgot-password';
  if (path === '/brand-dashboard') return 'brand-dashboard';
  if (path === '/search-influencers') return 'search-influencers';
  if (path === '/create-campaign') return 'create-campaign';
  if (path === '/brand-home') return 'brand-home';
  if (path === '/brand-profile') return 'brand-profile';
  if (path.startsWith('/influencer-profile')) return 'influencer-profile';
  if (path === '/influencer-dashboard') return 'influencer-dashboard';
  if (path === '/brand-notifications') return 'brand-notifications';
  if (path === '/influencer-notifications') return 'influencer-notifications';
  return 'home';
}

/**
 * Returns the path to redirect to, or null if the page should render as-is.
 * Does NOT perform navigation — caller handles it.
 */
function resolveRoute(path: string): string | null {
  const access = getAccess(path);
  const isAuth = isAuthenticated();
  const userType = getUserType();

  if (isAuth && userType === null) {
    if (access === 'brand-only' || access === 'influencer-only') {
      safeSessionSet(INTENDED_PATH_KEY, path);
      return '/auth';
    }
  }

  if (access === 'guest-only') {
    if (isAuth && userType !== null) return dashboardForUserType(userType);
    return null;
  }

  if (access === 'public') return null;

  if (!isAuth) {
    safeSessionSet(INTENDED_PATH_KEY, path);
    return '/auth';
  }
  if (
    (access === 'brand-only' && userType !== 'brand') ||
    (access === 'influencer-only' && userType !== 'influencer')
  ) {
    return dashboardForUserType(userType);
  }
  return null;
}

const knownPaths = new Set(['/', ...Object.keys(ROUTE_ACCESS)]);

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentPage, setCurrentPage] = useState<PageName>('home');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      setTheme(defaultTheme);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  // Handle URL-based routing
  useEffect(() => {
    const handleNavigation = () => {
      let path = window.location.pathname;

      const redirectPath = resolveRoute(path);
      if (redirectPath !== null) {
        window.history.replaceState({}, '', redirectPath);
        path = redirectPath;
      }

      setCurrentPage(pathToPage(path));
    };

    // Handle initial load
    handleNavigation();

    // Listen for navigation changes
    window.addEventListener('popstate', handleNavigation);

    // Intercept clicks on links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href) {
        const url = new URL(link.href);
        // Only handle internal links
        const isKnownPath =
          knownPaths.has(url.pathname) ||
          url.pathname.startsWith('/influencer-profile');
        if (url.origin === window.location.origin && isKnownPath) {
          e.preventDefault();
          if (url.pathname !== window.location.pathname) {
            window.history.pushState({}, '', url.pathname);
            handleNavigation();
            window.scrollTo(0, 0);
          }
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  // Render the appropriate page
  if (currentPage === 'blog') {
    return <BlogPage theme={theme} toggleTheme={toggleTheme} />;
  }

  if (currentPage === 'about') {
    return <AboutPage theme={theme} toggleTheme={toggleTheme} />;
  }

  if (currentPage === 'testimonials') {
    return <TestimonialsPage theme={theme} toggleTheme={toggleTheme} />;
  }

  if (currentPage === 'auth') {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthPage />
      </GoogleOAuthProvider>
    );
  }

  if (currentPage === 'forgot-password') {
    return <ForgotPasswordPage />;
  }

  if (currentPage === 'brand-dashboard') {
    return <BrandDashboard theme={theme} toggleTheme={toggleTheme} />;
  }

  if (currentPage === 'brand-home') {
    return <BrandHomePage theme={theme} toggleTheme={toggleTheme} />;
  }

  if (currentPage === 'brand-profile') {
    return <BrandProfilePage theme={theme} toggleTheme={toggleTheme} />;
  }

  if (currentPage === 'search-influencers') {
    return <SearchInfluencers theme={theme} toggleTheme={toggleTheme} />;
  }

  if (currentPage === 'create-campaign') {
    return <CreateCampaign theme={theme} toggleTheme={toggleTheme} />;
  }

  if (currentPage === 'influencer-profile') {
    return <InfluencerProfile theme={theme} toggleTheme={toggleTheme} />;
  }

  if (currentPage === 'influencer-dashboard') {
    return <InfluencerDashboard theme={theme} toggleTheme={toggleTheme} />;
  }

  if (currentPage === 'brand-notifications') {
    return <NotificationsPage theme={theme} toggleTheme={toggleTheme} userType="brand" />;
  }

  if (currentPage === 'influencer-notifications') {
    return <NotificationsPage theme={theme} toggleTheme={toggleTheme} userType="influencer" />;
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background-primary))] transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
