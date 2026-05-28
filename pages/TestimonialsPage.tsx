import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Star, Quote, ThumbsUp, Users, TrendingUp, Award } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface TestimonialsPageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function TestimonialsPage({ theme, toggleTheme }: TestimonialsPageProps) {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Influencer',
      avatar: 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MzczNDUzOHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      quote: 'Collabiko has transformed how I connect with brands. The platform is intuitive, and I\'ve landed multiple high-paying partnerships within my first month. Highly recommended for any serious influencer!',
      followers: '250K',
      collaborations: 47,
    },
    {
      name: 'Michael Chen',
      role: 'Brand Manager',
      avatar: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM3Njc4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      quote: 'As a brand manager, finding authentic influencers was always a challenge. Collabiko\'s verification system and analytics tools have made our campaigns more effective and measurable. Game-changer!',
      company: 'TechFlow Inc.',
      collaborations: 32,
    },
    {
      name: 'Emma Rodriguez',
      role: 'Content Creator',
      avatar: 'https://images.unsplash.com/photo-1645848810565-ff3c1de0da09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwY3JlYXRvciUyMGluZmx1ZW5jZXJ8ZW58MXx8fHwxNjM3Mzk5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      quote: 'The best investment I\'ve made in my influencer career. The direct communication tools and secure payment system give me peace of mind. I\'ve grown my brand partnerships by 300% this year!',
      followers: '180K',
      collaborations: 65,
    },
    {
      name: 'David Park',
      role: 'Marketing Director',
      avatar: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM3Njc4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      quote: 'Collabiko streamlined our entire influencer marketing workflow. We can now manage multiple campaigns simultaneously with clear ROI tracking. Our engagement rates have doubled since using this platform.',
      company: 'GrowthX Marketing',
      collaborations: 28,
    },
    {
      name: 'Jessica Martinez',
      role: 'Fashion Influencer',
      avatar: 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MzczNDUzOHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      quote: 'I love how easy it is to discover brands that align with my aesthetic and values. The platform\'s matching algorithm is spot-on, and I\'ve formed long-term partnerships that feel authentic.',
      followers: '420K',
      collaborations: 89,
    },
    {
      name: 'Alex Thompson',
      role: 'E-commerce Manager',
      avatar: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM3Njc4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      quote: 'Working with influencers through Collabiko has been seamless. The platform handles everything from contracts to analytics. Our sales conversion from influencer campaigns increased by 180%!',
      company: 'StyleHub',
      collaborations: 41,
    },
  ];

  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Active Users',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: ThumbsUp,
      value: '50,000+',
      label: 'Successful Collaborations',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      value: '98%',
      label: 'Success Rate',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Award,
      value: '4.9/5',
      label: 'Average Rating',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const categories = [
    {
      title: 'From Influencers',
      description: 'Hear from content creators who found their dream brand partnerships',
      filter: ['Influencer', 'Content Creator', 'Fashion Influencer'],
    },
    {
      title: 'From Brands',
      description: 'Discover how businesses scaled their marketing with influencer collaborations',
      filter: ['Brand Manager', 'Marketing Director', 'E-commerce Manager'],
    },
  ];

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background-primary))] transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl" />
          
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <div className="inline-block px-4 py-2 rounded-full bg-[rgb(var(--color-background-tertiary))] border border-[rgb(var(--color-border-medium))] mb-6">
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Testimonials
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl xl:text-7xl mb-6">
                Trusted by Thousands
                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  of Brands & Influencers
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-[rgb(var(--color-text-secondary))] mb-8">
                Don't just take our word for it. Here's what our community has to say about their experience with Collabiko.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 lg:py-32 bg-[rgb(var(--color-background-secondary))]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-[rgb(var(--color-text-secondary))] font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Testimonials Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl lg:text-5xl mb-4">
                Success Stories
              </h2>
              <p className="text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
                Real results from real people. Discover how Collabiko has helped brands and influencers grow together.
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className="card group animate-fade-in hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote className="w-16 h-16 text-[rgb(var(--color-primary))]" />
                  </div>
                  
                  <div className="relative z-10">
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <p className="text-[rgb(var(--color-text-secondary))] mb-6 italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <ImageWithFallback
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-[rgb(var(--color-border-medium))]"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[rgb(var(--color-surface))]" />
                      </div>
                      
                      <div>
                        <p className="font-bold text-[rgb(var(--color-text-primary))]">{testimonial.name}</p>
                        <p className="text-sm text-[rgb(var(--color-text-tertiary))]">{testimonial.role}</p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex items-center gap-4 text-sm text-[rgb(var(--color-text-tertiary))]">
                      {'followers' in testimonial && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{testimonial.followers}</span>
                        </div>
                      )}
                      {'company' in testimonial && (
                        <div className="flex items-center gap-1">
                          <span>{testimonial.company}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{testimonial.collaborations} collabs</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Categories Section */}
            <div className="grid md:grid-cols-2 gap-12">
              {categories.map((category, index) => (
                <div
                  key={category.title}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="card mb-6">
                    <h3 className="text-2xl lg:text-3xl mb-2">{category.title}</h3>
                    <p className="text-[rgb(var(--color-text-secondary))]">{category.description}</p>
                  </div>
                  
                  <div className="space-y-6">
                    {testimonials
                      .filter(t => category.filter.includes(t.role))
                      .slice(0, 2)
                      .map((testimonial) => (
                        <div
                          key={testimonial.name}
                          className="card group hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <ImageWithFallback
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-[rgb(var(--color-border-medium))] flex-shrink-0"
                            />
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-bold text-[rgb(var(--color-text-primary))]">{testimonial.name}</p>
                                <div className="flex gap-0.5">
                                  {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-[rgb(var(--color-text-secondary))] italic">
                                "{testimonial.quote}"
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-[rgb(var(--color-background-secondary))]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="card relative overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute inset-0 gradient-mesh opacity-30" />
              
              <div className="relative z-10 text-center py-12 px-6">
                <h2 className="text-4xl lg:text-5xl mb-6">
                  Join Our Success Stories
                </h2>
                <p className="text-lg lg:text-xl text-[rgb(var(--color-text-secondary))] mb-8 max-w-2xl mx-auto">
                  Be part of a thriving community where brands and influencers create meaningful partnerships every day.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/auth"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-bold hover:shadow-primary-glow-hover transition-all duration-200 hover:-translate-y-1"
                  >
                    Start Your Journey
                  </a>
                  <a
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[rgb(var(--color-background-tertiary))] border-2 border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] font-bold hover:bg-[rgb(var(--color-background-secondary))] transition-all duration-200 hover:-translate-y-1"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
