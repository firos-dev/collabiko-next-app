import { ArrowRight, Users, Building2 } from 'lucide-react';
import bannerImage from '../assets/Influencer.png';

export function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(var(--color-background-tertiary))] border border-[rgb(var(--color-border-medium))] mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                Join 10,000+ Active Collaborations
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl xl:text-7xl mb-6">
              Connect Brands with
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Influencers
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-[rgb(var(--color-text-secondary))] mb-8 max-w-xl">
              Collabiko bridges the gap between brands seeking authentic promotion and influencers looking for meaningful partnerships. Start collaborating today.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="/auth"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-bold hover:shadow-primary-glow-hover transition-all duration-200 hover:-translate-y-0.5"
              >
                <Users className="w-5 h-5" />
                Register as Influencer
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href="/brand-dashboard"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Building2 className="w-5 h-5" />
                Register as Brand
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative animate-slide-up hidden lg:block">
            <div className="relative">
              <img
                src={bannerImage}
                alt="Brand and influencer collaboration"
                className="w-full h-auto object-cover"
              />
              
              {/* Floating Cards */}
              <div className="absolute top-8 right-8 glass p-4 rounded-xl shadow-xl animate-fade-in hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">✓</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[rgb(var(--color-text-primary))]">Verified Match</p>
                    <p className="text-xs text-[rgb(var(--color-text-tertiary))]">Partnership Active</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-8 left-8 glass p-4 rounded-xl shadow-xl animate-fade-in hidden lg:block">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white" />
                  </div>
                  <span className="text-sm font-bold text-[rgb(var(--color-text-primary))]">+2.5K</span>
                </div>
                <p className="text-xs text-[rgb(var(--color-text-tertiary))]">New collaborations this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}