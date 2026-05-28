import { Header } from '../components/Header';
import { Blog } from '../components/Blog';
import { Footer } from '../components/Footer';

interface BlogPageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function BlogPage({ theme, toggleTheme }: BlogPageProps) {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-background-primary))] transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Blog />
      </main>
      <Footer />
    </div>
  );
}
