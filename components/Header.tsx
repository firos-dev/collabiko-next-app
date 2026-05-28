import { useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import logo from '../assets/Logo.png';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function Header({ theme, toggleTheme }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If it's a hash link
    if (href.startsWith('#')) {
      e.preventDefault();
      
      // If we're not on the home page, navigate to home page first
      if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        
        // Wait for navigation to complete, then scroll to section
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        // We're already on homepage, just scroll to section
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[var(--z-fixed)] glass">
      <nav className="max-w-[1440px] mx-auto px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg overflow-hidden transition-transform group-hover:scale-110">
              <img src={logo} alt="Collabiko Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
              Collabiko
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] transition-colors duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-[rgb(var(--color-background-tertiary))] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
              ) : (
                <Sun className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
              )}
            </button>
            <a
              href="/auth"
              className="px-6 py-2.5 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'transparent',
                color: theme === 'light' ? '#0000ff' : 'white',
                border: theme === 'light' ? '2px solid #0000ff' : '2px solid white'
              }}
              onMouseEnter={(e) => {
                if (theme === 'light') {
                  e.currentTarget.style.backgroundColor = '#0000ff';
                  e.currentTarget.style.color = 'white';
                } else {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#1f2937';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme === 'light' ? '#0000ff' : 'white';
              }}
            >
              Login
            </a>
            <a
              href="/auth"
              className="px-6 py-2.5 rounded-xl gradient-primary text-white font-bold hover:shadow-primary-glow-hover transition-all duration-200 hover:-translate-y-0.5"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button + Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-[rgb(var(--color-background-tertiary))] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
              ) : (
                <Sun className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-[rgb(var(--color-background-tertiary))] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[rgb(var(--color-text-primary))]" />
              ) : (
                <Menu className="w-6 h-6 text-[rgb(var(--color-text-primary))]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    handleNavClick(e, item.href);
                    setMobileMenuOpen(false);
                  }}
                  className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] transition-colors duration-200 font-medium py-2"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => {
                  handleNavClick(e, '#contact');
                  setMobileMenuOpen(false);
                }}
                className="px-6 py-2.5 rounded-xl gradient-primary text-white font-bold text-center hover:shadow-primary-glow-hover transition-all duration-200"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}