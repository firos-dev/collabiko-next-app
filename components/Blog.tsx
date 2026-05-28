import { Calendar, Clock, ArrowLeft, Tag, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: 'How to Find the Perfect Brand Partnership as an Influencer',
      excerpt: 'Discover the key strategies for identifying and securing brand partnerships that align with your values and audience.',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG1hcmtldGluZ3xlbnwxfHx8fDE3NjM3NTI5ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      author: 'Sarah Johnson',
      date: 'Nov 15, 2024',
      readTime: '5 min read',
      category: 'Influencer Tips',
    },
    {
      id: 2,
      title: '10 Metrics Every Brand Should Track in Influencer Campaigns',
      excerpt: 'Learn which KPIs matter most when measuring the success of your influencer marketing campaigns.',
      image: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGluZmx1ZW5jZXIlMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc2MzgxNzQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      author: 'Michael Chen',
      date: 'Nov 12, 2024',
      readTime: '7 min read',
      category: 'Brand Strategy',
    },
    {
      id: 3,
      title: 'The Rise of Micro-Influencers: Why Small Can Be Big',
      excerpt: 'Explore why brands are increasingly turning to micro-influencers for authentic engagement and better ROI.',
      image: 'https://images.unsplash.com/photo-1645848810565-ff3c1de0da09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwY3JlYXRvciUyMGluZmx1ZW5jZXJ8ZW58MXx8fHwxNjM3Mzk5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      author: 'Emma Rodriguez',
      date: 'Nov 8, 2024',
      readTime: '6 min read',
      category: 'Industry Trends',
    },
    {
      id: 4,
      title: 'Building Long-Term Partnerships: Beyond One-Off Campaigns',
      excerpt: 'How to cultivate lasting relationships between brands and influencers for sustained growth and mutual success.',
      image: 'https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWtlfGVufDF8fHx8MTc2Mzc1ODQzMXww&ixlib=rb-4.1.0&q=80&w=1080',
      author: 'David Park',
      date: 'Nov 5, 2024',
      readTime: '8 min read',
      category: 'Partnerships',
    },
    {
      id: 5,
      title: 'Content Creation Best Practices for Brand Collaborations',
      excerpt: 'Master the art of creating compelling content that resonates with your audience while meeting brand objectives.',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG1hcmtldGluZ3xlbnwxfHx8fDE3NjM3NTI5ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      author: 'Sarah Johnson',
      date: 'Nov 1, 2024',
      readTime: '5 min read',
      category: 'Content Strategy',
    },
    {
      id: 6,
      title: 'Navigating Influencer Marketing Regulations and Disclosure',
      excerpt: 'Stay compliant with FTC guidelines and build trust with your audience through proper disclosure practices.',
      image: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGluZmx1ZW5jZXIlMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc2MzgxNzQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      author: 'Michael Chen',
      date: 'Oct 28, 2024',
      readTime: '6 min read',
      category: 'Legal & Compliance',
    },
  ];

  const categories = ['All', 'Influencer Tips', 'Brand Strategy', 'Industry Trends', 'Partnerships', 'Content Strategy', 'Legal & Compliance'];

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero Section */}
      <section className="bg-[rgb(var(--color-background-secondary))] py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </a>
          
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-2 rounded-full bg-[rgb(var(--color-background-tertiary))] border border-[rgb(var(--color-border-medium))] mb-4">
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Blog & Resources
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl mb-6">
              Insights & Tips for
              <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Successful Collaborations
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-[rgb(var(--color-text-secondary))]">
              Expert advice, industry trends, and practical strategies to help brands and influencers build meaningful partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-20 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  category === 'All'
                    ? 'gradient-primary text-white shadow-primary-glow'
                    : 'bg-[rgb(var(--color-background-tertiary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-secondary))] hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-text-primary))]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className="card group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Featured Image */}
                <div className="relative overflow-hidden rounded-xl mb-4 aspect-video">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full glass text-xs font-bold text-[rgb(var(--color-text-primary))]">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl mb-3 group-hover:text-[rgb(var(--color-primary))] transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-[rgb(var(--color-text-secondary))] mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[rgb(var(--color-text-tertiary))]">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-4 rounded-xl border-2 border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))] font-bold hover:bg-[rgb(var(--color-primary))] hover:text-white transition-all duration-200 hover:-translate-y-0.5">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 lg:py-32 bg-[rgb(var(--color-background-secondary))]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative overflow-hidden rounded-2xl p-12 gradient-primary text-white">
              <div className="relative z-10">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                  Never Miss an Update
                </h3>
                <p className="text-lg mb-8 text-white/90">
                  Subscribe to our newsletter and get the latest insights delivered to your inbox weekly.
                </p>
                
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-xl text-[rgb(var(--color-text-primary))] bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 rounded-xl bg-white text-[rgb(var(--color-primary))] font-bold hover:bg-white/90 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    Subscribe Now
                  </button>
                </form>
              </div>
              
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
