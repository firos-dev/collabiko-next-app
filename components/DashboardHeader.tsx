import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Moon,
  Sun,
  LogOut,
  User,
  Users,
  X,
  ArrowLeft,
  MessageSquare,
  Briefcase,
  DollarSign,
  Clock,
  Menu,
  Edit,
} from 'lucide-react';
import { clearAuth } from '../src/api/auth-storage';
import logo from '../assets/Logo.png';

interface DashboardHeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  userType: 'brand' | 'influencer';
  userName?: string;
  userSubtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function DashboardHeader({
  theme,
  toggleTheme,
  userType,
  userName = userType === 'brand' ? 'Brand Manager' : 'Sarah Johnson',
  userSubtitle = userType === 'brand' ? 'TechFlow Inc.' : 'Influencer',
  showBackButton = false,
  onBackClick,
}: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications =
    userType === 'brand'
      ? [
          {
            id: 1,
            type: 'application',
            title: 'New Campaign Application',
            message: 'Sarah Johnson applied to your "Summer Fashion Campaign"',
            time: '5 minutes ago',
            unread: true,
          },
          {
            id: 2,
            type: 'message',
            title: 'New Message',
            message: 'Michael Chen sent you a message about collaboration details',
            time: '1 hour ago',
            unread: true,
          },
          {
            id: 3,
            type: 'campaign',
            title: 'Campaign Milestone',
            message: 'Your "Tech Product Launch" campaign reached 10K impressions',
            time: '3 hours ago',
            unread: false,
          },
          {
            id: 4,
            type: 'application',
            title: 'Application Update',
            message: 'Emma Rodriguez accepted your collaboration offer',
            time: '1 day ago',
            unread: false,
          },
          {
            id: 5,
            type: 'system',
            title: 'Payment Processed',
            message: 'Payment of $1,500 has been successfully processed',
            time: '2 days ago',
            unread: false,
          },
        ]
      : [
          {
            id: 1,
            type: 'campaign',
            title: 'New Campaign Match',
            message: 'TechGear Pro has a campaign that matches your profile',
            time: '10 minutes ago',
            unread: true,
          },
          {
            id: 2,
            type: 'application',
            title: 'Application Accepted',
            message: 'Your application for "Summer Fashion Campaign" was accepted',
            time: '2 hours ago',
            unread: true,
          },
          {
            id: 3,
            type: 'message',
            title: 'New Message',
            message: 'StyleHub Fashion sent you a collaboration offer',
            time: '5 hours ago',
            unread: true,
          },
          {
            id: 4,
            type: 'payment',
            title: 'Payment Received',
            message: 'You received $1,200 for "Tech Product Launch" campaign',
            time: '1 day ago',
            unread: false,
          },
          {
            id: 5,
            type: 'deadline',
            title: 'Deadline Reminder',
            message: 'Campaign deliverable due in 3 days',
            time: '2 days ago',
            unread: false,
          },
        ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  const handleLogoClick = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <>
      <header className="glass border-b border-[rgb(var(--color-border-light))] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <button
                  onClick={handleBackClick}
                  className="p-2 hover:bg-[rgb(var(--color-background-secondary))] rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                </button>
              )}
              <button onClick={handleLogoClick} className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-lg overflow-hidden transition-transform group-hover:scale-110">
                  <img src={logo} alt="Collabiko Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Collabiko</h1>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                    {userType === 'brand' ? 'Brand Dashboard' : 'Influencer Dashboard'}
                  </p>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                onClick={toggleTheme}
                className="p-2 hover:bg-[rgb(var(--color-background-secondary))] rounded-xl transition-colors"
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

              {/* User menu */}
              <div className="relative pl-4 border-l border-[rgb(var(--color-border-light))]">
                <motion.button
                  onClick={() => setShowUserMenu(prev => !prev)}
                  className="flex items-center gap-3 hover:bg-[rgb(var(--color-background-secondary))] rounded-xl px-2 py-1.5 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">{userName}</p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">{userSubtitle}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    {userType === 'brand' ? (
                      <Users className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <Menu className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                </motion.button>

                {/* Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <>
                      {/* Click-away overlay */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-light))] rounded-xl shadow-xl z-50 overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            const path = userType === 'brand' ? '/brand-profile' : '/influencer-dashboard';
                            window.history.pushState({}, '', path);
                            window.dispatchEvent(new PopStateEvent('popstate'));
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-background-tertiary))] transition-colors"
                        >
                          <Edit className="w-4 h-4 text-[rgb(var(--color-text-secondary))]" />
                          Edit Profile
                        </button>
                        <div className="border-t border-[rgb(var(--color-border-light))]" />
                        <button
                          onClick={() => {
                            clearAuth();
                            window.history.pushState({}, '', '/auth');
                            window.dispatchEvent(new PopStateEvent('popstate'));
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[rgb(var(--color-text-primary))] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors group"
                        >
                          <LogOut className="w-4 h-4 text-[rgb(var(--color-text-secondary))] group-hover:text-red-600 transition-colors" />
                          Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      {showNotifications && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-20 right-4 w-96 bg-[rgb(var(--color-surface))] shadow-2xl rounded-2xl z-50 border border-[rgb(var(--color-border-light))] overflow-hidden"
        >
          <div className="p-4 border-b border-[rgb(var(--color-border-light))] bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Notifications</h3>
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
                      notification.type === 'application'
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : notification.type === 'message'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : notification.type === 'campaign'
                        ? 'bg-purple-100 dark:bg-purple-900/30'
                        : notification.type === 'payment'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30'
                        : notification.type === 'deadline'
                        ? 'bg-red-100 dark:bg-red-900/30'
                        : 'bg-gray-100 dark:bg-gray-900/30'
                    }`}
                  >
                    {notification.type === 'application' && (
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                    {notification.type === 'message' && (
                      <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                    {notification.type === 'campaign' && (
                      <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    )}
                    {notification.type === 'payment' && (
                      <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    )}
                    {notification.type === 'deadline' && (
                      <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                    {notification.type === 'system' && (
                      <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
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
                const path =
                  userType === 'brand' ? '/brand-notifications' : '/influencer-notifications';
                window.history.pushState({}, '', path);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="w-full text-sm text-[rgb(var(--color-text-link))] hover:text-[rgb(var(--color-text-link-hover))] font-medium transition-colors"
            >
              View All Notifications
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
