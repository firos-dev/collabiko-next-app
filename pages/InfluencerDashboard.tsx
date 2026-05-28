import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Bell, Search, Filter, DollarSign, Calendar,
  TrendingUp, MapPin, Briefcase, Clock, Heart, Eye,
  Instagram, Youtube, Twitter, Facebook, CheckCircle, AlertCircle,
  Edit, Save, X, Camera, Users, BarChart3,
  MessageSquare, Star, LogOut, Moon, Sun, Menu
} from 'lucide-react';
import { clearAuth } from '../src/api/auth-storage';
import logo from '../assets/Logo.png';
import { listCampaigns, getSavedCampaignIds, toggleSaveCampaign, applyToCampaign, type ApiCampaign } from '../src/api/campaigns';
import { getMyInfluencerProfile, updateMyInfluencerProfile } from '../src/api/influencers';
import { listNotifications, type ApiNotification } from '../src/api/notifications';
import { ApiError } from '../src/api/http';

interface Campaign {
  id: string;
  brandName: string;
  brandLogo: string;
  title: string;
  category: string;
  description: string;
  budget: string;
  duration: string;
  location: string;
  platform: string[];
  requirements: { minFollowers: string; engagement: string; niche: string[] };
  deadline: string;
  status: 'open' | 'closing-soon' | 'featured';
  applicants: number;
}

function mapApiToCampaign(c: ApiCampaign): Campaign {
  return {
    id: c.id,
    brandName: c.brand?.brandName ?? 'Brand',
    brandLogo: c.brand?.logoUrl ?? '',
    title: c.title,
    category: c.category,
    description: c.description,
    budget: c.budget ?? '—',
    duration: c.duration ?? '—',
    location: c.location ?? 'Remote',
    platform: (c.platforms?.map((p) => p.platform) ?? []).filter(Boolean),
    requirements: {
      minFollowers: c.minFollowers ?? '—',
      engagement: c.engagementRequirement ?? '—',
      niche: c.niche ? [c.niche] : [],
    },
    deadline: c.deadline ?? '',
    status: (c.status === 'closing-soon' || c.status === 'featured' ? c.status : 'open') as Campaign['status'],
    applicants: c.applicantsCount ?? 0,
  };
}

const PAGE_SIZE = 6;

interface InfluencerDashboardProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function InfluencerDashboard({ theme, toggleTheme }: InfluencerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'profile'>('campaigns');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [budgetRange, setBudgetRange] = useState<string>('all');
  const [savedCampaigns, setSavedCampaigns] = useState<string[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    proposedContent: '',
    deliverables: '',
    timeline: '',
    socialLinks: ''
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const activeLoadRef = useRef(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; type: string; title: string; message: string; time: string; unread: boolean }>>([]);
  const [_notificationsLoading, setNotificationsLoading] = useState(false);
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  // Reset and load first page whenever filters change
  useEffect(() => {
    offsetRef.current = 0;
    setCampaigns([]);
    setHasMore(false);
    setCampaignsLoading(true);
    activeLoadRef.current = true;

    listCampaigns({
      search: searchQuery || undefined,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      platform: selectedPlatform === 'all' ? undefined : selectedPlatform,
      limit: PAGE_SIZE,
      offset: 0,
    })
      .then((res) => {
        const items = (res.items || []).map(mapApiToCampaign);
        setCampaigns(items);
        offsetRef.current = items.length;
        setHasMore(items.length === PAGE_SIZE && items.length < (res.total ?? 0));
      })
      .catch(() => setCampaigns([]))
      .finally(() => {
        setCampaignsLoading(false);
        activeLoadRef.current = false;
      });
  }, [searchQuery, selectedCategory, selectedPlatform]);

  const loadMore = useCallback(() => {
    if (activeLoadRef.current || !hasMore) return;
    activeLoadRef.current = true;
    setLoadingMore(true);
    const currentOffset = offsetRef.current;

    listCampaigns({
      search: searchQuery || undefined,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      platform: selectedPlatform === 'all' ? undefined : selectedPlatform,
      limit: PAGE_SIZE,
      offset: currentOffset,
    })
      .then((res) => {
        const items = (res.items || []).map(mapApiToCampaign);
        setCampaigns((prev) => [...prev, ...items]);
        offsetRef.current = currentOffset + items.length;
        setHasMore(items.length === PAGE_SIZE && offsetRef.current < (res.total ?? 0));
      })
      .catch(() => {})
      .finally(() => {
        setLoadingMore(false);
        activeLoadRef.current = false;
      });
  }, [hasMore, searchQuery, selectedCategory, selectedPlatform]);

  // Observe sentinel div to trigger loadMore on scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  useEffect(() => {
    getSavedCampaignIds().then(setSavedCampaigns).catch(() => setSavedCampaigns([]));
  }, []);

  useEffect(() => {
    if (!showNotifications) return;
    setNotificationsLoading(true);
    listNotifications()
      .then((res) => {
        const items = (res.items || []).map((n: ApiNotification) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          time: n.createdAt ? new Date(n.createdAt).toLocaleString() : '',
          unread: !n.readAt,
        }));
        setNotifications(items);
      })
      .catch(() => setNotifications([]))
      .finally(() => setNotificationsLoading(false));
  }, [showNotifications]);

  const unreadCount = notifications.filter(n => n.unread).length;

  // Profile state — populated from API on mount
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    platforms: [] as Array<{ platform: string; followers: string; engagementRate: string }>,
    engagement: '',
    categories: [] as string[],
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [savedProfile, setSavedProfile] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    platforms: [] as Array<{ platform: string; followers: string; engagementRate: string }>,
    engagement: '',
    categories: [] as string[],
  });

  useEffect(() => {
    getMyInfluencerProfile()
      .then((data) => {
        if (!data) {
          setProfileError('Profile not found. Please contact support.');
          return;
        }
        setProfile({
          name: [data.user?.firstName, data.user?.lastName].filter(Boolean).join(' ') || '',
          email: data.user?.email || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
          platforms: (data.platforms || []).map((p) => ({
            platform: p.platform,
            followers: p.followers || '',
            engagementRate: p.engagementRate ? `${p.engagementRate}%` : '',
          })),
          engagement: data.avgEngagement ? `${data.avgEngagement}%` : '',
          categories: (data.niches || []).map((n) => n.niche),
        });
        setSavedProfile({
          name: [data.user?.firstName, data.user?.lastName].filter(Boolean).join(' ') || '',
          email: data.user?.email || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
          platforms: (data.platforms || []).map((p) => ({
            platform: p.platform,
            followers: p.followers || '',
            engagementRate: p.engagementRate ? `${p.engagementRate}%` : '',
          })),
          engagement: data.avgEngagement ? `${data.avgEngagement}%` : '',
          categories: (data.niches || []).map((n) => n.niche),
        });
      })
      .catch((err: unknown) => {
        setProfileError((err instanceof Error ? err.message : null) || 'Failed to load profile');
      })
      .finally(() => setProfileLoading(false));
  }, []);

  const categories = ['all', 'Fashion & Lifestyle', 'Tech & Gaming', 'Beauty & Makeup', 'Fitness & Health', 'Travel & Adventure', 'Food & Cooking', 'Business & Finance', 'Entertainment'];
  const platforms = ['all', 'instagram', 'youtube', 'twitter', 'facebook'];
  const budgetRanges = ['all', '$0-$500', '$500-$1000', '$1000-$2500', '$2500+'];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || campaign.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'all' || campaign.platform.includes(selectedPlatform);
    let matchesBudget = true;
    if (budgetRange !== 'all' && campaign.budget) {
      const num = parseInt(campaign.budget.replace(/[^0-9]/g, ''), 10);
      if (!Number.isNaN(num)) {
        if (budgetRange === '$0-$500') matchesBudget = num <= 500;
        else if (budgetRange === '$500-$1000') matchesBudget = num > 500 && num <= 1000;
        else if (budgetRange === '$1000-$2500') matchesBudget = num > 1000 && num <= 2500;
        else if (budgetRange === '$2500+') matchesBudget = num > 2500;
      }
    }
    return matchesSearch && matchesCategory && matchesPlatform && matchesBudget;
  });

  const handleToggleSave = async (campaignId: string) => {
    try {
      await toggleSaveCampaign(campaignId);
      const ids = await getSavedCampaignIds();
      setSavedCampaigns(ids);
    } catch {
      // keep UI state
    }
  };

  const handleSubmitApplication = async () => {
    if (!selectedCampaign) return;
    setApplyError(null);
    setApplySubmitting(true);
    try {
      await applyToCampaign(selectedCampaign.id, {
        coverLetter: applicationData.coverLetter,
        proposedContent: applicationData.proposedContent,
        deliverables: applicationData.deliverables,
        timeline: applicationData.timeline || undefined,
        socialLinks: applicationData.socialLinks || undefined,
      });
      setShowApplicationModal(false);
      setApplicationData({ coverLetter: '', proposedContent: '', deliverables: '', timeline: '', socialLinks: '' });
    } catch (err) {
      setApplyError(err instanceof ApiError ? err.message : 'Failed to submit application');
    } finally {
      setApplySubmitting(false);
    }
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileError(null);
    try {
      const updated = await updateMyInfluencerProfile({
        bio: profile.bio || null,
        location: profile.location || null,
        website: profile.website || null,
        niches: profile.categories.map((c) => ({ niche: c })),
        platforms: profile.platforms.map((p) => ({
          platform: p.platform,
          followers: p.followers || undefined,
          engagementRate: p.engagementRate || undefined,
        })),
      });
      setProfile({
        name: [updated.user?.firstName, updated.user?.lastName].filter(Boolean).join(' ') || '',
        email: updated.user?.email || '',
        bio: updated.bio || '',
        location: updated.location || '',
        website: updated.website || '',
        platforms: (updated.platforms || []).map((p) => ({
          platform: p.platform,
          followers: p.followers || '',
          engagementRate: p.engagementRate ? `${p.engagementRate}%` : '',
        })),
        engagement: updated.avgEngagement ? `${updated.avgEngagement}%` : '',
        categories: (updated.niches || []).map((n) => n.niche),
      });
      setSavedProfile({
        name: [updated.user?.firstName, updated.user?.lastName].filter(Boolean).join(' ') || '',
        email: updated.user?.email || '',
        bio: updated.bio || '',
        location: updated.location || '',
        website: updated.website || '',
        platforms: (updated.platforms || []).map((p) => ({
          platform: p.platform,
          followers: p.followers || '',
          engagementRate: p.engagementRate ? `${p.engagementRate}%` : '',
        })),
        engagement: updated.avgEngagement ? `${updated.avgEngagement}%` : '',
        categories: (updated.niches || []).map((n) => n.niche),
      });
      setEditingProfile(false);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'featured':
        return <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs flex items-center gap-1">
          <Star className="w-3 h-3 fill-white" /> Featured
        </span>;
      case 'closing-soon':
        return <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> Closing Soon
        </span>;
      default:
        return <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Open
        </span>;
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background-primary))]">
      {/* Header */}
      <header className="glass border-b border-[rgb(var(--color-border-light))] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden transition-transform group-hover:scale-110">
                  <img src={logo} alt="Collabiko Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="font-bold text-[rgb(var(--color-text-primary))]">Collabiko</h1>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))]">Influencer Dashboard</p>
                </div>
              </div>
            </div>

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

              {/* User menu */}
              <div className="relative pl-4 border-l border-[rgb(var(--color-border-light))]">
                <motion.button
                  onClick={() => setShowUserMenu(prev => !prev)}
                  className="flex items-center gap-3 hover:bg-[rgb(var(--color-background-secondary))] rounded-xl px-2 py-1.5 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-[rgb(var(--color-text-primary))]">{profile.name}</p>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">Influencer</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
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
                            setActiveTab('profile');
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

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-4 sm:mt-6">
        <div className="flex gap-2 border-b border-[rgb(var(--color-border-light))] overflow-x-auto">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 sm:px-6 py-3 font-medium transition-all relative flex-shrink-0 whitespace-nowrap ${
              activeTab === 'campaigns'
                ? 'text-blue-600'
                : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Available Campaigns
            </div>
            {activeTab === 'campaigns' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 sm:px-6 py-3 font-medium transition-all relative flex-shrink-0 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'text-blue-600'
                : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              My Profile
            </div>
            {activeTab === 'profile' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'campaigns' ? (
            <motion.div
              key="campaigns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search and Filter Bar */}
              <div className="mb-6 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
                    <input
                      type="text"
                      placeholder="Search campaigns by title, brand, or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-[rgb(var(--color-text-tertiary))]"
                    />
                  </div>
                  <motion.button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-colors ${
                      showFilters
                        ? 'bg-blue-600 text-white'
                        : 'bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-background-tertiary))]'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Filter className="w-5 h-5" />
                    Filters
                  </motion.button>
                </div>

                {/* Filter Panel */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-[rgb(var(--color-background-secondary))] rounded-xl border border-[rgb(var(--color-border-light))] overflow-hidden"
                    >
                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Category Filter */}
                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Category</label>
                          <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {categories.map(cat => (
                              <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Platform Filter */}
                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Platform</label>
                          <select
                            value={selectedPlatform}
                            onChange={(e) => setSelectedPlatform(e.target.value)}
                            className="w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {platforms.map(platform => (
                              <option key={platform} value={platform}>
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Budget Filter */}
                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Budget Range</label>
                          <select
                            value={budgetRange}
                            onChange={(e) => setBudgetRange(e.target.value)}
                            className="w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {budgetRanges.map(range => (
                              <option key={range} value={range}>
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Results Count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[rgb(var(--color-text-secondary))]">
                  <span className="font-semibold text-[rgb(var(--color-text-primary))]">{filteredCampaigns.length}</span> campaigns found
                </p>
                {savedCampaigns.length > 0 && (
                  <button className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                    <Heart className="w-4 h-4 fill-blue-600" />
                    {savedCampaigns.length} Saved
                  </button>
                )}
              </div>

              {/* Campaign Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[rgb(var(--color-background-secondary))] rounded-2xl border border-[rgb(var(--color-border-light))] overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b border-[rgb(var(--color-border-light))]">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                            {campaign.brandLogo
                              ? <img src={campaign.brandLogo} alt="Brand logo" className="w-full h-full object-cover" />
                              : '🎯'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">{campaign.brandName}</h3>
                            <p className="text-sm text-[rgb(var(--color-text-secondary))]">{campaign.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(campaign.status)}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleSave(campaign.id)}
                            className="p-2 hover:bg-[rgb(var(--color-background-tertiary))] rounded-lg transition-colors"
                          >
                            <Heart 
                              className={`w-5 h-5 transition-colors ${
                                savedCampaigns.includes(campaign.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-[rgb(var(--color-text-tertiary))]'
                              }`}
                            />
                          </motion.button>
                        </div>
                      </div>

                      <h4 className="font-semibold text-[rgb(var(--color-text-primary))] mb-2">{campaign.title}</h4>
                      <p className="text-[rgb(var(--color-text-secondary))] text-sm line-clamp-2">{campaign.description}</p>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      {/* Campaign Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-[rgb(var(--color-text-secondary))]">Budget:</span>
                          <span className="font-semibold text-[rgb(var(--color-text-primary))]">{campaign.budget}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-[rgb(var(--color-text-secondary))]">Duration:</span>
                          <span className="font-semibold text-[rgb(var(--color-text-primary))]">{campaign.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span className="text-[rgb(var(--color-text-secondary))]">Location:</span>
                          <span className="font-semibold text-[rgb(var(--color-text-primary))]">{campaign.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-[rgb(var(--color-text-secondary))]">Applicants:</span>
                          <span className="font-semibold text-[rgb(var(--color-text-primary))]">{campaign.applicants}</span>
                        </div>
                      </div>

                      {/* Platforms */}
                      <div>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-2">Platforms:</p>
                        <div className="flex gap-2">
                          {campaign.platform.map(platform => (
                            <div key={platform} className="px-3 py-1.5 bg-[rgb(var(--color-background-tertiary))] border border-[rgb(var(--color-border-light))] rounded-lg flex items-center gap-1.5 text-sm text-[rgb(var(--color-text-primary))]">
                              {getPlatformIcon(platform)}
                              <span className="capitalize">{platform}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Requirements */}
                      <div>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-2">Requirements:</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                            {campaign.requirements.minFollowers} followers
                          </span>
                          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs">
                            {campaign.requirements.engagement} engagement
                          </span>
                          {campaign.requirements.niche.map(niche => (
                            <span key={niche} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs">
                              {niche}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center justify-between pt-4 border-t border-[rgb(var(--color-border-light))]">
                        <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))]">
                          <Calendar className="w-4 h-4" />
                          <span>Deadline: {new Date(campaign.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-6 py-4 bg-[rgb(var(--color-background-tertiary))] flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-2.5 bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-xl hover:bg-[rgb(var(--color-background-primary))] transition-colors font-medium flex items-center justify-center gap-2"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setShowDetailsModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setShowApplicationModal(true);
                        }}
                      >
                        <Send className="w-4 h-4" />
                        Apply Now
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Scroll sentinel — triggers loadMore when visible */}
              {hasMore && <div ref={sentinelRef} className="h-8" />}

              {loadingMore && (
                <div className="text-center py-6 text-[rgb(var(--color-text-secondary))] text-sm">
                  Loading more campaigns...
                </div>
              )}

              {campaignsLoading && (
                <div className="text-center py-16 text-[rgb(var(--color-text-secondary))]">Loading campaigns...</div>
              )}
              {!campaignsLoading && filteredCampaigns.length === 0 && (
                <div className="text-center py-16">
                  <Briefcase className="w-16 h-16 text-[rgb(var(--color-text-tertiary))] mx-auto mb-4" />
                  <p className="text-[rgb(var(--color-text-secondary))] text-lg">No campaigns found</p>
                  <p className="text-[rgb(var(--color-text-tertiary))] text-sm mt-2">Try adjusting your filters or search query</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Profile Management */}
              <div className="max-w-4xl mx-auto">
                {profileError && (
                  <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                    {profileError}
                  </div>
                )}
                {profileLoading ? (
                  <div className="text-center py-12 text-[rgb(var(--color-text-secondary))]">Loading profile...</div>
                ) : (
                <div className="bg-[rgb(var(--color-background-secondary))] rounded-2xl border border-[rgb(var(--color-border-light))] overflow-hidden">
                  {/* Profile Header */}
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>

                  <div className="px-8 pb-8">
                    {/* Profile Image */}
                    <div className="relative -mt-20 mb-6">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-4 border-[rgb(var(--color-background-secondary))] flex items-center justify-center shadow-xl">
                        <User className="w-16 h-16 text-white" />
                      </div>
                      {editingProfile && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg"
                        >
                          <Camera className="w-5 h-5" />
                        </motion.button>
                      )}
                    </div>

                    {/* Edit Toggle */}
                    <div className="flex justify-end mb-6">
                      {!editingProfile ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEditingProfile(true)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Profile
                        </motion.button>
                      ) : (
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { setProfile(savedProfile); setEditingProfile(false); }}
                            className="px-6 py-2 bg-[rgb(var(--color-background-tertiary))] text-[rgb(var(--color-text-primary))] rounded-xl flex items-center gap-2 hover:bg-[rgb(var(--color-background-primary))] transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSaveProfile}
                            disabled={profileSaving}
                            className="px-6 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <Save className="w-4 h-4" />
                            {profileSaving ? 'Saving...' : 'Save Changes'}
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Profile Form */}
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Full Name</label>
                          <input
                            type="text"
                            value={profile.name}
                            readOnly
                            disabled={true}
                            className="w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Email</label>
                          <input
                            type="email"
                            value={profile.email}
                            readOnly
                            disabled={true}
                            className="w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Phone</label>
                          <input
                            type="tel"
                            value=""
                            disabled={true}
                            placeholder="Not available"
                            className="w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Location</label>
                          <input
                            type="text"
                            value={profile.location}
                            onChange={(e) => setProfile((prev) => ({...prev, location: e.target.value}))}
                            disabled={!editingProfile}
                            className="w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Website</label>
                        <input
                          type="url"
                          value={profile.website}
                          onChange={(e) => setProfile((prev) => ({...prev, website: e.target.value}))}
                          disabled={!editingProfile}
                          className="w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Bio</label>
                        <textarea
                          value={profile.bio}
                          onChange={(e) => setProfile((prev) => ({...prev, bio: e.target.value}))}
                          disabled={!editingProfile}
                          rows={4}
                          className="w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 resize-none"
                        />
                      </div>

                      {/* Social Media Stats */}
                      <div>
                        <h3 className="font-semibold text-[rgb(var(--color-text-primary))] mb-4">Social Media Analytics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {profile.platforms.length === 0 && !editingProfile && (
                            <p className="col-span-4 text-[rgb(var(--color-text-secondary))] text-sm">No platforms added yet.</p>
                          )}
                          {profile.platforms.map((p) => (
                            <div key={p.platform} className="p-4 bg-[rgb(var(--color-background-primary))] rounded-xl border border-[rgb(var(--color-border-light))]">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {getPlatformIcon(p.platform)}
                                  <span className="text-sm text-[rgb(var(--color-text-secondary))] capitalize">{p.platform}</span>
                                </div>
                                {editingProfile && (
                                  <button
                                    onClick={() => setProfile((prev) => ({ ...prev, platforms: prev.platforms.filter((x) => x.platform !== p.platform) }))}
                                    className="text-[rgb(var(--color-text-tertiary))] hover:text-red-500 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              {editingProfile ? (
                                <input
                                  type="text"
                                  value={p.followers}
                                  onChange={(e) => setProfile((prev) => ({
                                    ...prev,
                                    platforms: prev.platforms.map((x) =>
                                      x.platform === p.platform ? { ...x, followers: e.target.value } : x
                                    ),
                                  }))}
                                  placeholder="e.g. 125K"
                                  className="w-full text-sm px-2 py-1 bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-light))] rounded text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              ) : (
                                <p className="text-xl font-bold text-[rgb(var(--color-text-primary))]">{p.followers || '—'}</p>
                              )}
                            </div>
                          ))}
                          {editingProfile && (() => {
                            const ALL_PLATFORMS = ['instagram', 'youtube', 'twitter', 'facebook', 'tiktok', 'linkedin'];
                            const added = new Set(profile.platforms.map((p) => p.platform));
                            const available = ALL_PLATFORMS.filter((p) => !added.has(p));
                            if (available.length === 0) return null;
                            return (
                              <div className="p-4 border-2 border-dashed border-[rgb(var(--color-border-light))] rounded-xl flex flex-col items-center justify-center">
                                <select
                                  className="w-full text-sm px-2 py-1 bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-light))] rounded text-[rgb(var(--color-text-primary))] focus:outline-none"
                                  value=""
                                  onChange={(e) => {
                                    if (!e.target.value) return;
                                    setProfile((prev) => ({ ...prev, platforms: [...prev.platforms, { platform: e.target.value, followers: '', engagementRate: '' }] }));
                                  }}
                                >
                                  <option value="">+ Add platform</option>
                                  {available.map((p) => <option key={p} value={p}>{p}</option>)}
                                </select>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Engagement Rate */}
                      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center">
                              <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-[rgb(var(--color-text-secondary))]">Average Engagement Rate</p>
                              <p className="text-3xl font-bold text-green-600">{profile.engagement}</p>
                            </div>
                          </div>
                          <BarChart3 className="w-16 h-16 text-green-200 dark:text-green-800" />
                        </div>
                      </div>

                      {/* Categories / Niches */}
                      <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Content Categories</label>
                        <div className="flex flex-wrap gap-2">
                          {profile.categories.map((category) => (
                            <span key={category} className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg flex items-center gap-2">
                              {category}
                              {editingProfile && (
                                <button
                                  onClick={() => setProfile((prev) => ({ ...prev, categories: prev.categories.filter((c) => c !== category) }))}
                                  className="hover:text-blue-900 dark:hover:text-blue-200"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </span>
                          ))}
                          {editingProfile && (() => {
                            const NICHES = ['Fashion & Lifestyle', 'Tech & Gaming', 'Beauty & Makeup', 'Fitness & Health', 'Travel & Adventure', 'Food & Cooking', 'Business & Finance', 'Entertainment'];
                            const available = NICHES.filter((n) => !profile.categories.includes(n));
                            if (available.length === 0) return null;
                            return (
                              <select
                                className="px-3 py-2 border-2 border-dashed border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-secondary))] rounded-lg bg-transparent focus:outline-none hover:border-blue-500 hover:text-blue-500 transition-colors text-sm"
                                value=""
                                onChange={(e) => {
                                  if (!e.target.value) return;
                                  setProfile((prev) => ({ ...prev, categories: [...prev.categories, e.target.value] }));
                                }}
                              >
                                <option value="">+ Add Category</option>
                                {available.map((n) => <option key={n} value={n}>{n}</option>)}
                              </select>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Campaign Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedCampaign && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[rgb(var(--color-background-secondary))] rounded-2xl border border-[rgb(var(--color-border-light))] w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-[rgb(var(--color-background-secondary))] border-b border-[rgb(var(--color-border-light))] px-8 py-6 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-[rgb(var(--color-text-primary))]">Campaign Details</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-[rgb(var(--color-background-tertiary))] rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                  </motion.button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-3xl overflow-hidden">
                    {selectedCampaign.brandLogo
                      ? <img src={selectedCampaign.brandLogo} alt="Brand logo" className="w-full h-full object-cover" />
                      : '🎯'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">{selectedCampaign.brandName}</h3>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">{selectedCampaign.category}</p>
                  </div>
                  {getStatusBadge(selectedCampaign.status)}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-2">{selectedCampaign.title}</h4>
                  <p className="text-[rgb(var(--color-text-secondary))]">{selectedCampaign.description}</p>
                </div>

                {/* Campaign Details */}
                <div className="grid grid-cols-2 gap-4 p-6 bg-[rgb(var(--color-background-tertiary))] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[rgb(var(--color-text-secondary))]">Budget</p>
                      <p className="font-semibold text-[rgb(var(--color-text-primary))]">{selectedCampaign.budget}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[rgb(var(--color-text-secondary))]">Duration</p>
                      <p className="font-semibold text-[rgb(var(--color-text-primary))]">{selectedCampaign.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[rgb(var(--color-text-secondary))]">Location</p>
                      <p className="font-semibold text-[rgb(var(--color-text-primary))]">{selectedCampaign.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[rgb(var(--color-text-secondary))]">Applicants</p>
                      <p className="font-semibold text-[rgb(var(--color-text-primary))]">{selectedCampaign.applicants}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 col-span-2">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[rgb(var(--color-text-secondary))]">Deadline</p>
                      <p className="font-semibold text-[rgb(var(--color-text-primary))]">{new Date(selectedCampaign.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                {/* Platforms */}
                <div>
                  <h5 className="font-semibold text-[rgb(var(--color-text-primary))] mb-3">Platforms</h5>
                  <div className="flex gap-3">
                    {selectedCampaign.platform.map(platform => (
                      <div key={platform} className="px-4 py-2 bg-[rgb(var(--color-background-tertiary))] border border-[rgb(var(--color-border-light))] rounded-lg flex items-center gap-2">
                        {getPlatformIcon(platform)}
                        <span className="capitalize text-[rgb(var(--color-text-primary))]">{platform}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h5 className="font-semibold text-[rgb(var(--color-text-primary))] mb-3">Requirements</h5>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-[rgb(var(--color-text-secondary))]">Minimum Followers:</span>
                      <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{selectedCampaign.requirements.minFollowers}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-[rgb(var(--color-text-secondary))]">Engagement Rate:</span>
                      <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">{selectedCampaign.requirements.engagement}</span>
                    </div>
                    <div>
                      <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-2">Content Niches:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCampaign.requirements.niche.map(niche => (
                          <span key={niche} className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm">
                            {niche}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-[rgb(var(--color-border-light))]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowApplicationModal(true);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Apply for this Campaign
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campaign Application Modal */}
      <AnimatePresence>
        {showApplicationModal && selectedCampaign && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowApplicationModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[rgb(var(--color-background-secondary))] rounded-2xl border border-[rgb(var(--color-border-light))] w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-[rgb(var(--color-background-secondary))] border-b border-[rgb(var(--color-border-light))] px-8 py-6 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-[rgb(var(--color-text-primary))]">Apply for Campaign</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowApplicationModal(false)}
                    className="p-2 hover:bg-[rgb(var(--color-background-tertiary))] rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                  </motion.button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-[rgb(var(--color-background-tertiary))] rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                    {selectedCampaign.brandLogo
                      ? <img src={selectedCampaign.brandLogo} alt="Brand logo" className="w-full h-full object-cover" />
                      : '🎯'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">{selectedCampaign.brandName}</h3>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">{selectedCampaign.title}</p>
                  </div>
                </div>

                {/* Application Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
                      Cover Letter <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={applicationData.coverLetter}
                      onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                      placeholder="Tell the brand why you're the perfect fit for this campaign..."
                      rows={4}
                      className="w-full px-4 py-3 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[rgb(var(--color-text-tertiary))] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
                      Proposed Content Strategy <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={applicationData.proposedContent}
                      onChange={(e) => setApplicationData({...applicationData, proposedContent: e.target.value})}
                      placeholder="Describe the content you plan to create for this campaign..."
                      rows={4}
                      className="w-full px-4 py-3 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[rgb(var(--color-text-tertiary))] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
                      Deliverables <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={applicationData.deliverables}
                      onChange={(e) => setApplicationData({...applicationData, deliverables: e.target.value})}
                      placeholder="List the deliverables you'll provide (e.g., 3 Instagram posts, 2 Stories, 1 Reel)..."
                      rows={3}
                      className="w-full px-4 py-3 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[rgb(var(--color-text-tertiary))] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
                      Proposed Timeline
                    </label>
                    <textarea
                      value={applicationData.timeline}
                      onChange={(e) => setApplicationData({...applicationData, timeline: e.target.value})}
                      placeholder="When will you deliver each piece of content?..."
                      rows={3}
                      className="w-full px-4 py-3 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[rgb(var(--color-text-tertiary))] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">
                      Social Media Links
                    </label>
                    <textarea
                      value={applicationData.socialLinks}
                      onChange={(e) => setApplicationData({...applicationData, socialLinks: e.target.value})}
                      placeholder="Provide links to your social media profiles..."
                      rows={3}
                      className="w-full px-4 py-3 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[rgb(var(--color-text-tertiary))] resize-none"
                    />
                  </div>
                </div>

                {applyError && (
                  <p className="text-red-600 dark:text-red-400 text-sm px-8">{applyError}</p>
                )}
                {/* Submit Button */}
                <div className="flex gap-3 pt-4 border-t border-[rgb(var(--color-border-light))] px-8 pb-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowApplicationModal(false)}
                    className="flex-1 py-3 bg-[rgb(var(--color-background-tertiary))] text-[rgb(var(--color-text-primary))] rounded-xl hover:bg-[rgb(var(--color-background-primary))] transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitApplication}
                    disabled={applySubmitting}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Send className="w-5 h-5" />
                    {applySubmitting ? 'Submitting...' : 'Submit Application'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                      notification.type === 'campaign' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      notification.type === 'application' ? 'bg-green-100 dark:bg-green-900/30' :
                      notification.type === 'message' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      notification.type === 'payment' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                      'bg-red-100 dark:bg-red-900/30'
                    }`}
                  >
                    {notification.type === 'campaign' && <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                    {notification.type === 'application' && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />}
                    {notification.type === 'message' && <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                    {notification.type === 'payment' && <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
                    {notification.type === 'deadline' && <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />}
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
                window.history.pushState({}, '', '/influencer-notifications');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View All Notifications
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Send(props: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}