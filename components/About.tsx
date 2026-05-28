import { Search, MessageSquare, Handshake, TrendingUp, Shield, Zap } from 'lucide-react';

export function About() {
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

  return (
    <section id="about" className="py-20 lg:py-32 bg-[rgb(var(--color-background-secondary))]">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
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
                    <step.icon className="w-7 h-7 stroke-[#0000ff] dark:stroke-white" strokeWidth={2} />
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

        {/* Benefits Section */}
        <div className="text-center mb-16">
          <h3 className="text-2xl lg:text-3xl mb-4">Why Choose Collabiko?</h3>
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
  );
}