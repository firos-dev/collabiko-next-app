import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Users, TrendingUp, MessageSquare, Bell, LogOut, Moon, Sun, Sparkles, ArrowRight, Megaphone, Target, X, Home } from 'lucide-react';
import { clearAuth } from '../src/api/auth-storage';
import logo from '../assets/Logo.png';
import { listNotifications } from '../src/api/notifications';

interface BrandDashboardProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function BrandDashboard({ theme, toggleTheme }: BrandDashboardProps) {
  const [hoveredOption, setHoveredOption] = useState<'search' | 'campaign' | 'home' | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; type: string; title: string; message: string; time: string; unread: boolean }>>([]);

  useEffect(() => {
    if (!showNotifications) return;
    listNotifications()
      .then((res) => {
        const items = (res.items || []).map((n: { id: string; type: string; title: string; message: string; createdAt?: string; readAt?: string | null }) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          time: n.createdAt ? new Date(n.createdAt).toLocaleString() : '',
          unread: !n.readAt,
        }));
        setNotifications(items);
      })
      .catch(() => setNotifications([]));
  }, [showNotifications]);

  const unreadCount = notifications.filter(n => n.unread).length;
  
  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--color-background-primary))]">
      {/* Header */}
      <header className="glass border-b border-[rgb(var(--color-border-light))] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg overflow-hidden transition-transform group-hover:scale-110">
                <img src={logo} alt="Collabiko Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
                Collabiko
              </span>
            </a>

            <div className="flex items-center gap-4">
              <motion.button
                onClick={toggleTheme}
                className="p-2 hover:bg-[rgb(var(--color-background-secondary))] rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </motion.button>

              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-[rgb(var(--color-background-secondary))] rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </motion.button>

              <div className="flex items-center gap-3 pl-4 border-l border-[rgb(var(--color-border-light))]">
                <div className="text-right">
                  <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">Brand Manager</p>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))]">TechFlow Inc.</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>

              <motion.button
                onClick={() => {
                  clearAuth();
                  window.history.pushState({}, '', '/auth');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-[rgb(var(--color-text-secondary))] group-hover:text-red-600 transition-colors" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex flex-col lg:flex-row w-full">
          {/* Home Panel */}
          <motion.div
            className="relative flex-1 flex items-center justify-center group cursor-pointer overflow-hidden"
            onHoverStart={() => setHoveredOption('home')}
            onHoverEnd={() => setHoveredOption(null)}
            onClick={() => {
              window.history.pushState({}, '', '/brand-home');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            initial={false}
            animate={{
              flex: hoveredOption === 'home' ? 1.2 : hoveredOption !== null ? 0.8 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Background */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: hoveredOption === 'home'
                  ? 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)'
                  : 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)'
              }}
              transition={{ duration: 0.6 }}
            />

            {/* Decorative blobs */}
            <motion.div
              className="absolute top-20 right-20 w-64 h-64 rounded-full bg-emerald-500 opacity-20 blur-3xl"
              animate={{
                scale: hoveredOption === 'home' ? [1, 1.2, 1] : 1,
                opacity: hoveredOption === 'home' ? [0.2, 0.3, 0.2] : 0.2
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-teal-500 opacity-20 blur-3xl"
              animate={{
                scale: hoveredOption === 'home' ? [1, 1.3, 1] : 1,
                opacity: hoveredOption === 'home' ? [0.2, 0.35, 0.2] : 0.2
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 py-12 sm:py-16 text-white text-center">
              <motion.div
                className="relative mb-8 sm:mb-12"
                animate={{
                  scale: hoveredOption === 'home' ? 1.1 : 1,
                  rotateZ: hoveredOption === 'home' ? 5 : 0
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <motion.div
                  className="absolute inset-0 bg-emerald-400 rounded-full blur-3xl opacity-0 group-hover:opacity-50"
                  animate={{ scale: hoveredOption === 'home' ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-4 border-white/20"
                  animate={{
                    borderColor: hoveredOption === 'home' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'
                  }}
                >
                  <Home className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24" strokeWidth={1.5} />

                  {hoveredOption === 'home' && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-white rounded-full"
                          style={{
                            top: `${20 + Math.cos(i * Math.PI / 4) * 100}px`,
                            left: `${20 + Math.sin(i * Math.PI / 4) * 100}px`,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                className="text-center"
                animate={{ y: hoveredOption === 'home' ? -10 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4">Home</h2>
                <p className="text-xl text-white/80 mb-8 max-w-md mx-auto">
                  View all your campaigns and their applications in one place
                </p>

                <motion.div
                  className="space-y-3 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredOption === 'home' ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 text-white/90">
                    <Sparkles className="w-5 h-5" />
                    <span>All your campaigns at a glance</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-white/90">
                    <Sparkles className="w-5 h-5" />
                    <span>Review and manage applications</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-white/90">
                    <Sparkles className="w-5 h-5" />
                    <span>Edit campaigns on the fly</span>
                  </div>
                </motion.div>

                <motion.div
                  className="inline-flex items-center gap-2 text-xl"
                  animate={{ x: hoveredOption === 'home' ? 10 : 0 }}
                >
                  <span>Go to Home</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm"
              initial={{ opacity: 1 }}
              animate={{ opacity: hoveredOption === 'home' ? 0 : 1 }}
            >
              Click to explore
            </motion.div>
          </motion.div>

          <div className="w-px bg-white/10" />

          {/* Left Side - Search Influencer */}
          <motion.div
            className="relative flex-1 flex items-center justify-center group cursor-pointer overflow-hidden"
            onHoverStart={() => setHoveredOption('search')}
            onHoverEnd={() => setHoveredOption(null)}
            onClick={() => {
              window.history.pushState({}, '', '/search-influencers');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            initial={false}
            animate={{
              flex: hoveredOption === 'search' ? 1.2 : hoveredOption !== null ? 0.8 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Animated Background Gradient */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: hoveredOption === 'search'
                  ? 'linear-gradient(135deg, #0000ff 0%, #1e3a8a 50%, #312e81 100%)'
                  : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a8a 100%)'
              }}
              transition={{ duration: 0.6 }}
            />

            {/* Decorative Elements */}
            <motion.div
              className="absolute top-20 right-20 w-64 h-64 rounded-full bg-blue-500 opacity-20 blur-3xl"
              animate={{
                scale: hoveredOption === 'search' ? [1, 1.2, 1] : 1,
                opacity: hoveredOption === 'search' ? [0.2, 0.3, 0.2] : 0.2
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-indigo-500 opacity-20 blur-3xl"
              animate={{
                scale: hoveredOption === 'search' ? [1, 1.3, 1] : 1,
                opacity: hoveredOption === 'search' ? [0.2, 0.35, 0.2] : 0.2
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 py-12 sm:py-16 text-white text-center">
              {/* Icon Container */}
                <motion.div
                  className="relative mb-8 sm:mb-12"
                  animate={{
                    scale: hoveredOption === 'search' ? 1.1 : 1,
                  rotateZ: hoveredOption === 'search' ? 5 : 0
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {/* Icon Glow */}
                <motion.div
                  className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-0 group-hover:opacity-50"
                  animate={{
                    scale: hoveredOption === 'search' ? [1, 1.3, 1] : 1
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Icon Background */}
                <motion.div
                  className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-4 border-white/20"
                  animate={{
                    borderColor: hoveredOption === 'search' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'
                  }}
                >
                  <Search className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24" strokeWidth={1.5} />
                  
                  {/* Sparkle particles when hovered */}
                  {hoveredOption === 'search' && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-white rounded-full"
                          style={{
                            top: `${20 + Math.cos(i * Math.PI / 4) * 100}px`,
                            left: `${20 + Math.sin(i * Math.PI / 4) * 100}px`,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>
              </motion.div>

              {/* Text Content */}
              <motion.div
                className="text-center"
                animate={{
                  y: hoveredOption === 'search' ? -10 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4">
                  Search Influencer
                </h2>
                <p className="text-xl text-white/80 mb-8 max-w-md mx-auto">
                  Discover and connect with influencers that match your brand values and target audience
                </p>

                {/* Features */}
                <motion.div
                  className="space-y-3 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredOption === 'search' ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 text-white/90">
                    <Sparkles className="w-5 h-5" />
                    <span>Advanced filtering by niche & reach</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-white/90">
                    <Sparkles className="w-5 h-5" />
                    <span>Verified influencer profiles</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-white/90">
                    <Sparkles className="w-5 h-5" />
                    <span>Real-time analytics & insights</span>
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  className="inline-flex items-center gap-2 text-xl"
                  animate={{
                    x: hoveredOption === 'search' ? 10 : 0
                  }}
                >
                  <span>Start Searching</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </motion.div>
            </div>

            {/* Hover Indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm"
              initial={{ opacity: 1 }}
              animate={{ opacity: hoveredOption === 'search' ? 0 : 1 }}
            >
              Click to explore
            </motion.div>
          </motion.div>

          {/* Right Side - Campaign Your Idea */}
          <motion.div
            className="relative flex-1 flex items-center justify-center overflow-hidden cursor-pointer group"
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
            }}
            onHoverStart={() => setHoveredOption('campaign')}
            onHoverEnd={() => setHoveredOption(null)}
            onClick={() => {
              window.history.pushState({}, '', '/create-campaign');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            initial={false}
            animate={{
              flex: hoveredOption === 'campaign' ? 1.2 : hoveredOption !== null ? 0.8 : 1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Animated Background Gradient */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: hoveredOption === 'campaign'
                  ? 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)'
                  : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
              }}
              transition={{ duration: 0.6 }}
            />

            {/* Decorative Elements */}
            <motion.div
              className="absolute top-20 left-20 w-64 h-64 rounded-full bg-purple-400 opacity-10 blur-3xl"
              animate={{
                scale: hoveredOption === 'campaign' ? [1, 1.2, 1] : 1,
                opacity: hoveredOption === 'campaign' ? [0.1, 0.2, 0.1] : 0.1
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-pink-400 opacity-10 blur-3xl"
              animate={{
                scale: hoveredOption === 'campaign' ? [1, 1.3, 1] : 1,
                opacity: hoveredOption === 'campaign' ? [0.1, 0.25, 0.1] : 0.1
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 py-12 sm:py-16 text-slate-800 text-center">
              {/* Icon Container */}
                <motion.div
                  className="relative mb-8 sm:mb-12"
                  animate={{
                    scale: hoveredOption === 'campaign' ? 1.1 : 1,
                  rotateZ: hoveredOption === 'campaign' ? -5 : 0
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {/* Icon Glow */}
                <motion.div
                  className="absolute inset-0 bg-purple-400 rounded-full blur-3xl opacity-0 group-hover:opacity-30"
                  animate={{
                    scale: hoveredOption === 'campaign' ? [1, 1.3, 1] : 1
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Icon Background */}
                <motion.div
                  className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border-4 border-slate-200/50 shadow-2xl"
                  animate={{
                    borderColor: hoveredOption === 'campaign' ? 'rgba(139,92,246,0.3)' : 'rgba(226,232,240,0.5)',
                    boxShadow: hoveredOption === 'campaign' 
                      ? '0 25px 50px -12px rgba(139,92,246,0.25)' 
                      : '0 25px 50px -12px rgba(0,0,0,0.25)'
                  }}
                >
                  <Megaphone className="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 text-purple-600" strokeWidth={1.5} />
                  
                  {/* Sparkle particles when hovered */}
                  {hoveredOption === 'campaign' && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-purple-600 rounded-full"
                          style={{
                            top: `${20 + Math.cos(i * Math.PI / 4) * 100}px`,
                            left: `${20 + Math.sin(i * Math.PI / 4) * 100}px`,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>
              </motion.div>

              {/* Text Content */}
              <motion.div
                className="text-center"
                animate={{
                  y: hoveredOption === 'campaign' ? -10 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 text-slate-900">
                  Campaign Your Idea
                </h2>
                <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto">
                  Launch compelling campaigns and let influencers apply to collaborate with your brand
                </p>

                {/* Features */}
                <motion.div
                  className="space-y-3 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredOption === 'campaign' ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 text-slate-700">
                    <Target className="w-5 h-5" />
                    <span>Create targeted campaigns</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-slate-700">
                    <Target className="w-5 h-5" />
                    <span>Set budget & requirements</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-slate-700">
                    <Target className="w-5 h-5" />
                    <span>Review influencer proposals</span>
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  className="inline-flex items-center gap-2 text-xl text-slate-900"
                  animate={{
                    x: hoveredOption === 'campaign' ? 10 : 0
                  }}
                >
                  <span>Create Campaign</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </motion.div>
            </div>

            {/* Hover Indicator */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-400 text-sm"
              initial={{ opacity: 1 }}
              animate={{ opacity: hoveredOption === 'campaign' ? 0 : 1 }}
            >
              Click to create
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Notifications Panel */}
      <AnimatePresence>
      {showNotifications && (
        <motion.div
          key="notifications-panel"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-20 right-4 w-96 bg-[rgb(var(--color-surface))] shadow-2xl rounded-2xl z-50 border border-[rgb(var(--color-border-light))] overflow-hidden"
        >
          <div className="p-4 border-b border-[rgb(var(--color-border-light))] bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                Notifications
              </h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            {unreadCount > 0 && (
              <p className="text-xs text-white/80 mt-1">
                You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-[rgb(var(--color-border-light))] hover:bg-[rgb(var(--color-background-secondary))] transition-colors cursor-pointer ${
                  notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.type === 'application' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      notification.type === 'message' ? 'bg-green-100 dark:bg-green-900/30' :
                      notification.type === 'campaign' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      'bg-red-100 dark:bg-red-900/30'
                    }`}
                  >
                    {notification.type === 'application' && <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                    {notification.type === 'message' && <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />}
                    {notification.type === 'campaign' && <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                    {notification.type === 'system' && <Bell className="w-5 h-5 text-red-600 dark:text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                        {notification.title}
                      </h4>
                      {notification.unread && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-[rgb(var(--color-text-tertiary))] mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[rgb(var(--color-border-light))] bg-[rgb(var(--color-background-secondary))]">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/brand-notifications');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View All Notifications
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}