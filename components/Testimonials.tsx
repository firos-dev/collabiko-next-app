import { Star, Quote } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Influencer',
      avatar: 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MzczNDUzOHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      quote: 'Collabiko has transformed how I connect with brands. The platform is intuitive, and I\'ve landed multiple high-paying partnerships within my first month. Highly recommended for any serious influencer!',
    },
    {
      name: 'Michael Chen',
      role: 'Brand Manager',
      avatar: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM3Njc4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      quote: 'As a brand manager, finding authentic influencers was always a challenge. Collabiko\'s verification system and analytics tools have made our campaigns more effective and measurable. Game-changer!',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Content Creator',
      avatar: 'https://images.unsplash.com/photo-1645848810565-ff3c1de0da09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW50JTIwY3JlYXRvciUyMGluZmx1ZW5jZXJ8ZW58MXx8fHwxNjM3Mzk5NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      quote: 'The best investment I\'ve made in my influencer career. The direct communication tools and secure payment system give me peace of mind. I\'ve grown my brand partnerships by 300% this year!',
    },
    {
      name: 'David Park',
      role: 'Marketing Director',
      avatar: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjM3Njc4ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 5,
      quote: 'Collabiko streamlined our entire influencer marketing workflow. We can now manage multiple campaigns simultaneously with clear ROI tracking. Our engagement rates have doubled since using this platform.',
    },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-[rgb(var(--color-background-primary))] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 rounded-full bg-[rgb(var(--color-background-tertiary))] border border-[rgb(var(--color-border-medium))] mb-4">
            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl mb-4">
            Trusted by Thousands
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              of Brands & Influencers
            </span>
          </h2>
          <p className="text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our community has to say about their experience with Collabiko.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="card group animate-fade-in"
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
                <div className="flex items-center gap-4">
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
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '50K+', label: 'Collaborations' },
            { value: '98%', label: 'Success Rate' },
            { value: '4.9/5', label: 'Average Rating' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <p className="text-[rgb(var(--color-text-secondary))]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
