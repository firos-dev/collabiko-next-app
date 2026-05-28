import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  Trash2,
  Filter,
  Search,
  Users,
  MessageSquare,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle,
  Circle,
} from 'lucide-react';
import { DashboardHeader } from '../components/DashboardHeader';
import { listNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification as deleteNotificationApi } from '../src/api/notifications';

interface NotificationsPageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  userType: 'brand' | 'influencer';
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  date: string;
}

export function NotificationsPage({ theme, toggleTheme, userType }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listNotifications()
      .then((res) => {
        const items = (res.items || []).map((n: { id: string; type: string; title: string; message: string; createdAt?: string; readAt?: string | null }) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          time: n.createdAt ? new Date(n.createdAt).toLocaleString() : '',
          unread: !n.readAt,
          date: n.createdAt ? new Date(n.createdAt).toISOString().slice(0, 10) : '',
        }));
        setNotifications(items);
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [userType]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');

  const notificationTypes = userType === 'brand'
    ? ['all', 'application', 'message', 'campaign', 'system']
    : ['all', 'campaign', 'application', 'message', 'payment', 'deadline'];

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'unread' && notification.unread) ||
      (filterStatus === 'read' && !notification.unread);

    return matchesSearch && matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    } catch {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    }
  };

  const markAsUnread = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: true } : n)));
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteNotificationApi(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Users className="w-5 h-5" />;
      case 'message':
        return <MessageSquare className="w-5 h-5" />;
      case 'campaign':
        return <Briefcase className="w-5 h-5" />;
      case 'payment':
        return <DollarSign className="w-5 h-5" />;
      case 'deadline':
        return <Clock className="w-5 h-5" />;
      case 'system':
        return <Bell className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'message':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'campaign':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'payment':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'deadline':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      case 'system':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
  };


  return (
    <div className="min-h-screen bg-[rgb(var(--color-background-primary))]">
      {/* Header */}
      <DashboardHeader
        userType={userType}
        theme={theme}
        toggleTheme={toggleTheme}
        showBackButton={true}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
                Notifications
              </h2>
              <p className="text-[rgb(var(--color-text-secondary))]">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'You\'re all caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <motion.button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle className="w-4 h-4" />
                Mark All as Read
              </motion.button>
            )}
          </div>

          {/* Filters */}
          <div className="card p-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-light))] rounded-lg text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-light))] rounded-lg text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  {notificationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[rgb(var(--color-background-secondary))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-background-tertiary))]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('unread')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                    filterStatus === 'unread'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[rgb(var(--color-background-secondary))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-background-tertiary))]'
                  }`}
                >
                  Unread
                </button>
                <button
                  onClick={() => setFilterStatus('read')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                    filterStatus === 'read'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[rgb(var(--color-background-secondary))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-background-tertiary))]'
                  }`}
                >
                  Read
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading && (
            <div className="card p-12 text-center">
              <p className="text-[rgb(var(--color-text-secondary))]">Loading notifications...</p>
            </div>
          )}
          {!loading && filteredNotifications.length === 0 ? (
            <div className="card p-12 text-center">
              <Bell className="w-16 h-16 text-[rgb(var(--color-text-tertiary))] mx-auto mb-4 opacity-50" />
              <p className="text-lg text-[rgb(var(--color-text-secondary))]">
                No notifications found
              </p>
              <p className="text-sm text-[rgb(var(--color-text-tertiary))] mt-2">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`card p-4 group hover:shadow-lg transition-all duration-200 ${
                  notification.unread ? 'border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-bold text-[rgb(var(--color-text-primary))]">
                        {notification.title}
                      </h3>
                      {notification.unread && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                    <p className="text-[rgb(var(--color-text-secondary))] mb-2">
                      {notification.message}
                    </p>
                    <p className="text-sm text-[rgb(var(--color-text-tertiary))]">
                      {notification.time}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {notification.unread ? (
                      <motion.button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 hover:bg-[rgb(var(--color-background-secondary))] rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Mark as read"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => markAsUnread(notification.id)}
                        className="p-2 hover:bg-[rgb(var(--color-background-secondary))] rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Mark as unread"
                      >
                        <Circle className="w-5 h-5 text-blue-600" />
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}