import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { submitContact } from '../src/api/contact';
import { ApiError } from '../src/api/http';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await submitContact(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@collabiko.com',
      href: 'mailto:hello@collabiko.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'San Francisco, CA',
      href: '#',
    },
  ];

  return (
    <section id="contact" className="py-20 lg:py-32 bg-[rgb(var(--color-background-secondary))] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 rounded-full bg-[rgb(var(--color-background-tertiary))] border border-[rgb(var(--color-border-medium))] mb-4">
            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Get in Touch
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl mb-4">
            Let's Start a
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Conversation
            </span>
          </h2>
          <p className="text-lg text-[rgb(var(--color-text-secondary))] max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help. Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="animate-fade-in">
            <div className="card">
              <h3 className="text-2xl mb-6">Send us a Message</h3>
              
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                  <p className="text-[rgb(var(--color-text-secondary))]">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-[rgb(var(--color-text-primary))]">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field w-full placeholder:text-[rgb(var(--color-text-tertiary))]"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-[rgb(var(--color-text-primary))]">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field w-full placeholder:text-[rgb(var(--color-text-tertiary))]"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-[rgb(var(--color-text-primary))]">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="input-field w-full resize-none placeholder:text-[rgb(var(--color-text-tertiary))]"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-bold hover:shadow-primary-glow-hover transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {loading ? 'Sending...' : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="card">
              <h3 className="text-2xl mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="flex items-start gap-4 group hover:translate-x-2 transition-transform"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[rgb(var(--color-text-tertiary))] mb-1">{info.label}</p>
                      <p className="font-medium text-[rgb(var(--color-text-primary))]">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Social Media */}
            <div className="card">
              <h3 className="text-2xl mb-6">Follow Us</h3>
              
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'Instagram', 'Facebook'].map((platform) => (
                  <a
                    key={platform}
                    href={`#${platform.toLowerCase()}`}
                    className="w-12 h-12 rounded-xl bg-[rgb(var(--color-background-tertiary))] border border-[rgb(var(--color-border-medium))] flex items-center justify-center hover:border-[rgb(var(--color-primary))] hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                    aria-label={platform}
                  >
                    <span className="text-sm font-bold">{platform[0]}</span>
                  </a>
                ))}
              </div>
            </div>
            
            {/* CTA Card */}
            <div className="relative overflow-hidden rounded-2xl p-8 gradient-primary text-white">
              <div className="relative z-10">
                <h4 className="text-2xl font-bold mb-2 text-white">Ready to Get Started?</h4>
                <p className="mb-6 text-white/90">
                  Join thousands of brands and influencers already using Collabiko.
                </p>
                <a
                  href="#home"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[rgb(var(--color-primary))] font-bold hover:bg-white/90 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Get Started Now
                  <Send className="w-4 h-4" />
                </a>
              </div>
              
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}