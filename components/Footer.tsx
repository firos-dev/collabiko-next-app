import { Mail, Heart } from 'lucide-react';
import logo from '../assets/Logo.png';

export function Footer() {
  const footerLinks = {
    Product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Security', href: '#security' },
      { label: 'Roadmap', href: '#roadmap' },
    ],
    Company: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
      { label: 'Contact', href: '#contact' },
    ],
    Resources: [
      { label: 'Documentation', href: '#docs' },
      { label: 'Help Center', href: '#help' },
      { label: 'Community', href: '#community' },
      { label: 'Status', href: '#status' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'GDPR', href: '#gdpr' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', url: '#twitter', icon: 'T' },
    { name: 'LinkedIn', url: '#linkedin', icon: 'L' },
    { name: 'Instagram', url: '#instagram', icon: 'I' },
    { name: 'Facebook', url: '#facebook', icon: 'F' },
  ];

  return (
    <footer className="bg-[rgb(var(--color-background-primary))] border-t border-[rgb(var(--color-border-light))]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <a href="#home" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-lg overflow-hidden transition-transform group-hover:scale-110">
                <img src={logo} alt="Collabiko Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
                Collabiko
              </span>
            </a>
            
            <p className="text-[rgb(var(--color-text-secondary))] mb-6 max-w-sm">
              Connecting brands with influencers for meaningful collaborations. Build authentic partnerships that drive real results.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 rounded-xl bg-[rgb(var(--color-background-tertiary))] border border-[rgb(var(--color-border-medium))] flex items-center justify-center hover:border-[rgb(var(--color-primary))] hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                  aria-label={social.name}
                >
                  <span className="text-sm font-bold">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-base font-bold text-[rgb(var(--color-text-primary))] mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-link))] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-[rgb(var(--color-border-light))]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-base font-bold text-[rgb(var(--color-text-primary))] mb-2">
                Stay Updated
              </h4>
              <p className="text-[rgb(var(--color-text-secondary))]">
                Subscribe to our newsletter for the latest updates and features.
              </p>
            </div>
            
            <form className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-field w-full pl-12"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl gradient-primary text-white font-bold hover:shadow-primary-glow-hover transition-all duration-200 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[rgb(var(--color-border-light))]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[rgb(var(--color-text-tertiary))] text-center md:text-left">
              © {new Date().getFullYear()} Collabiko. All rights reserved.
            </p>
            
            <p className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-tertiary))]">
              Made with <Heart className="w-4 h-4 fill-red-500 text-red-500" /> for the creative community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}