import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Search, MessageSquare, Handshake, TrendingUp, Shield, Zap, Target, Users, Award, Rocket } from 'lucide-react';

interface AboutPageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function AboutPage({ theme, toggleTheme }: AboutPageProps) {
  const steps = [
    {
      icon: Search,
      title: 'Discover & Search',
      description: 'Browse through thousands of verified brands and influencers. Use our advanced filters to find the perfect match for your needs.',
    },
    {
      icon: MessageSquare,
      title: 'Connect & Communicate',
      description: 'Reach out directly through our secure messaging system. Discuss campaign details, negotiate terms, and build relationships.',
    },
    {
      icon: Handshake,
      title: 'Collaborate & Create',
      description: 'Launch your campaign with confidence. Track progress, share content, and manage deliverables all in one place.',
    },
    {
      icon: TrendingUp,
      title: 'Track & Grow',
      description: 'Monitor campaign performance with real-time analytics. Measure ROI and optimize future collaborations for better results.',
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'All users are verified to ensure authenticity and trust in every collaboration.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Fast Matching',
      description: 'Our AI-powered algorithm finds the perfect matches in seconds, saving you time.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track performance metrics and measure the success of your campaigns in real-time.',
      color: 'from-green-500 to-emerald-500',
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
      icon: Handshake,
      value: '25,000+',
      label: 'Successful Collaborations',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Award,
      value: '98%',
      label: 'Satisfaction Rate',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Rocket,
      value: '150+',
      label: 'Countries Worldwide',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const mission = {
    title: 'Our Mission',
    description: 'At Collabiko, we believe in the power of authentic connections. Our mission is to bridge the gap between brands seeking meaningful promotion and influencers looking for partnerships that align with their values. We\'re committed to creating a transparent, efficient, and rewarding platform for all stakeholders.',
  };

  const values = [
    {
      icon: Target,
      title: 'Authenticity',
      description: 'We prioritize genuine connections and authentic partnerships that resonate with audiences.',
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Every profile is verified, and every transaction is secure, ensuring peace of mind for all users.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously evolve our platform with cutting-edge features and AI-powered matching.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'We foster a supportive community where brands and influencers can thrive together.',
    },
  ];

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background-primary))] transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
          {/* Background Gradient Mesh */}
          <div className="absolute inset-0 gradient-mesh opacity-50" />
          
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <div className="inline-block px-4 py-2 rounded-full bg-[rgb(var(--color-background-tertiary))] border border-[rgb(var(--color-border-medium))] mb-6">
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  About Collabiko
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl xl:text-7xl mb-6">
                Empowering
                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Authentic Collaborations
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-[rgb(var(--color-text-secondary))] mb-8">
                We're on a mission to revolutionize how brands and influencers connect, collaborate, and create impactful campaigns together.
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

        {/* Mission Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h2 className="text-4xl lg:text-5xl mb-6">
                {mission.title}
              </h2>
              <p className="text-lg lg:text-xl text-[rgb(var(--color-text-secondary))] leading-relaxed">
                {mission.description}
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 lg:py-32 bg-[rgb(var(--color-background-secondary))]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            {/* Section Header */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-block px-4 py-2 rounded-full bg-[rgb(var(--color-background-tertiary))] border border-[rgb(var(--color-border-medium))] mb-4">
                <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  How It Works
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl mb-4">
                Connecting Brands & Influencers
                <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h2>
              <p className="text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
                Collabiko streamlines the collaboration process, making it easy for brands and influencers to find, connect, and create impactful campaigns together.
              </p>
            </div>

            {/* How It Works Steps */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="card h-full">
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold shadow-primary-glow">
                      {index + 1}
                    </div>
                    
                    {/* Icon */}
                    <div className="mb-4 mt-2">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <step.icon className="w-7 h-7 text-[rgb(var(--color-primary))]" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl mb-2">{step.title}</h3>
                    <p className="text-[rgb(var(--color-text-secondary))]">{step.description}</p>
                  </div>
                  
                  {/* Connector Line (hidden on mobile and last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/4 -right-4 w-8 h-0.5 bg-gradient-to-r from-[rgb(var(--color-border-medium))] to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl lg:text-5xl mb-4">Our Core Values</h2>
              <p className="text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
                These principles guide everything we do at Collabiko
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="card group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-7 h-7 text-[rgb(var(--color-primary))]" />
                  </div>
                  <h3 className="text-xl mb-2">{value.title}</h3>
                  <p className="text-[rgb(var(--color-text-secondary))]">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 lg:py-32 bg-[rgb(var(--color-background-secondary))]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl mb-4">Why Choose Collabiko?</h3>
              <p className="text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
                We provide the tools and features you need to create successful collaborations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="group relative overflow-hidden rounded-2xl bg-[rgb(var(--color-surface))] p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h4 className="text-2xl mb-3">{benefit.title}</h4>
                    <p className="text-[rgb(var(--color-text-secondary))]">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="card relative overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute inset-0 gradient-mesh opacity-30" />
              
              <div className="relative z-10 text-center py-12 px-6">
                <h2 className="text-4xl lg:text-5xl mb-6">
                  Ready to Get Started?
                </h2>
                <p className="text-lg lg:text-xl text-[rgb(var(--color-text-secondary))] mb-8 max-w-2xl mx-auto">
                  Join thousands of brands and influencers who are already creating amazing collaborations on Collabiko.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/auth"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-bold hover:shadow-primary-glow-hover transition-all duration-200 hover:-translate-y-1"
                  >
                    Get Started Free
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[rgb(var(--color-background-tertiary))] border-2 border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] font-bold hover:bg-[rgb(var(--color-background-secondary))] transition-all duration-200 hover:-translate-y-1"
                  >
                    Contact Us
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
