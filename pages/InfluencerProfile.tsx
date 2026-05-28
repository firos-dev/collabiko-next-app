import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, MapPin, Users, Instagram, Youtube, Twitter, Facebook, 
  Star, Heart, CheckCircle, Target,
  Send, MessageCircle as MessageCircleIcon, Share2, X, Phone, Mail
} from 'lucide-react';
import { getInfluencer, type ApiInfluencer } from '../src/api/influencers';
import { sendMessage } from '../src/api/messages';
import { ApiError } from '../src/api/http';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPie, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import logo from '../assets/Logo.png';

interface InfluencerProfileProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Mock data
const platformStats = [
  {
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    followers: '250K',
    engagement: '9.2%',
    avgLikes: '23K',
    avgComments: '1.2K'
  },
  {
    name: 'YouTube',
    icon: Youtube,
    color: '#FF0000',
    followers: '120K',
    engagement: '7.8%',
    avgLikes: '9.4K',
    avgComments: '890'
  },
  {
    name: 'Twitter',
    icon: Twitter,
    color: '#1DA1F2',
    followers: '50K',
    engagement: '6.5%',
    avgLikes: '3.2K',
    avgComments: '450'
  },
  {
    name: 'Facebook',
    icon: Facebook,
    color: '#4267B2',
    followers: '30K',
    engagement: '5.2%',
    avgLikes: '1.5K',
    avgComments: '230'
  }
];

const followersGrowthData = [
  { month: 'Jul', followers: 380000 },
  { month: 'Aug', followers: 395000 },
  { month: 'Sep', followers: 410000 },
  { month: 'Oct', followers: 425000 },
  { month: 'Nov', followers: 438000 },
  { month: 'Dec', followers: 450000 }
];

const engagementData = [
  { day: 'Mon', engagement: 8.2 },
  { day: 'Tue', engagement: 7.8 },
  { day: 'Wed', engagement: 9.1 },
  { day: 'Thu', engagement: 8.5 },
  { day: 'Fri', engagement: 9.3 },
  { day: 'Sat', engagement: 8.7 },
  { day: 'Sun', engagement: 8.9 }
];

const audienceDemographics = [
  { name: '18-24', value: 30 },
  { name: '25-34', value: 45 },
  { name: '35-44', value: 20 },
  { name: '45+', value: 5 }
];

const audienceGender = [
  { name: 'Female', value: 65 },
  { name: 'Male', value: 32 },
  { name: 'Other', value: 3 }
];

const recentPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
    likes: 23000,
    comments: 1200,
    shares: 450,
    date: '2 days ago'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    likes: 21500,
    comments: 980,
    shares: 380,
    date: '4 days ago'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    likes: 25000,
    comments: 1450,
    shares: 520,
    date: '1 week ago'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
    likes: 19800,
    comments: 890,
    shares: 340,
    date: '1 week ago'
  }
];

const topLocations = [
  { country: 'United States', percentage: 45 },
  { country: 'United Kingdom', percentage: 18 },
  { country: 'Canada', percentage: 12 },
  { country: 'Australia', percentage: 10 },
  { country: 'Germany', percentage: 8 },
  { country: 'France', percentage: 7 }
];

const COLORS = ['#0000ff', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export function InfluencerProfile(_props: InfluencerProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'content' | 'audience'>('overview');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [messageData, setMessageData] = useState({
    subject: '',
    budget: '',
    message: '',
    campaignType: ''
  });
  const influencerId = typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean).pop() ?? '' : '';
  const [influencer, setInfluencer] = useState<ApiInfluencer | null>(null);
  const [loading, setLoading] = useState(!!influencerId);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!influencerId) {
      setLoading(false);
      return;
    }
    getInfluencer(influencerId).then((data) => {
      setInfluencer(data ?? null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [influencerId]);

  const profile = influencer ? {
    name: [influencer.user?.firstName, influencer.user?.lastName].filter(Boolean).join(' ') || influencer.username || 'Influencer',
    username: influencer.username ? (influencer.username.startsWith('@') ? influencer.username : `@${influencer.username}`) : '',
    avatar: influencer.user?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    coverImage: influencer.coverImageUrl || 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200',
    verified: !!influencer.verified,
    location: influencer.location || '—',
    niche: influencer.niches?.[0]?.niche || 'General',
    bio: influencer.bio || '',
    totalFollowers: influencer.totalFollowers || '—',
    avgEngagement: influencer.avgEngagement ? `${influencer.avgEngagement}%` : '—',
    contentRating: influencer.contentRating ? parseFloat(String(influencer.contentRating)) : 0,
    responseRate: influencer.responseRate || '—',
    responseTime: influencer.responseTime || '—',
    collaborations: influencer.collaborationsCount ?? 0,
    rating: influencer.rating ? parseFloat(String(influencer.rating)) : 0,
    reviews: influencer.reviewsCount ?? 0,
    priceRange: influencer.priceRange || '—',
  } : null;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!influencer?.user?.id) return;
    setMessageError(null);
    setSending(true);
    try {
      await sendMessage({
        recipientId: influencer.user.id,
        subject: messageData.subject,
        body: `Campaign type: ${messageData.campaignType}\nBudget: ${messageData.budget}\n\n${messageData.message}`,
      });
      setShowContactModal(false);
      setMessageData({ subject: '', budget: '', message: '', campaignType: '' });
    } catch (err) {
      setMessageError(err instanceof ApiError ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[rgb(var(--color-background-primary))] flex items-center justify-center">
        {loading ? <p className="text-[rgb(var(--color-text-secondary))]">Loading profile...</p> : <p className="text-[rgb(var(--color-text-secondary))]">Influencer not found</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background-primary))]">
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
              <a href="/search-influencers" className="flex items-center gap-2 px-4 py-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Search
              </a>
              <button className="px-6 py-2 rounded-xl gradient-primary text-white font-bold hover:shadow-primary-glow-hover transition-all">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Cover Image */}
        <div className="relative h-64 lg:h-80 overflow-hidden">
          <img 
            src={profile.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgb(var(--color-background-primary))]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 -mt-24 relative z-10">
          {/* Profile Header */}
          <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 border border-[rgb(var(--color-border-light))] mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Profile Image */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-[rgb(var(--color-background-primary))] shadow-xl"
                >
                  <img 
                    src={profile.avatar} 
                    alt={profile.name} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                {profile.verified && (
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full gradient-primary flex items-center justify-center border-4 border-[rgb(var(--color-background-primary))]">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl lg:text-4xl font-bold text-[rgb(var(--color-text-primary))]">
                        {profile.name}
                      </h1>
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600">
                        <Star className="w-4 h-4 fill-yellow-600" />
                        <span className="font-bold">{profile.rating}</span>
                      </div>
                    </div>
                    <p className="text-lg text-[rgb(var(--color-text-secondary))] mb-2">
                      {profile.username}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[rgb(var(--color-text-secondary))]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {profile.niche}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {profile.totalFollowers} Total Followers
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowContactModal(true)}
                    className="px-8 py-3 rounded-xl gradient-primary text-white font-bold shadow-primary-glow hover:shadow-primary-glow-hover transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    <Send className="w-5 h-5" />
                    Contact for Collaboration
                  </motion.button>
                </div>

                <p className="text-[rgb(var(--color-text-secondary))] mb-6">
                  {profile.bio}
                </p>

                {/* Contact Actions */}
                <div className="flex gap-4 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowContactModal(true)}
                    className="flex-1 px-6 py-3 rounded-xl gradient-primary text-white font-bold shadow-primary-glow hover:shadow-primary-glow-hover transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCallModal(true)}
                    className="flex-1 px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Schedule Call
                  </motion.button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="text-center p-4 rounded-xl bg-[rgb(var(--color-background-secondary))]">
                    <div className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-1">
                      {profile.avgEngagement}
                    </div>
                    <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                      Avg Engagement
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-[rgb(var(--color-background-secondary))]">
                    <div className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-1">
                      {profile.responseRate}
                    </div>
                    <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                      Response Rate
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-[rgb(var(--color-background-secondary))]">
                    <div className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-1">
                      {profile.responseTime}
                    </div>
                    <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                      Avg Response Time
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-[rgb(var(--color-background-secondary))]">
                    <div className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-1">
                      {profile.collaborations}
                    </div>
                    <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                      Collaborations
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-[rgb(var(--color-background-secondary))]">
                    <div className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-1">
                      {profile.priceRange}
                    </div>
                    <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                      Price Range
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['overview', 'analytics', 'content', 'audience'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'gradient-primary text-white shadow-primary-glow'
                      : 'glass text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 pb-16"
              >
                {/* Platform Stats */}
                <div className="glass rounded-2xl p-8 border border-[rgb(var(--color-border-light))]">
                  <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-6">
                    Platform Statistics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {platformStats.map((platform) => (
                      <motion.div
                        key={platform.name}
                        whileHover={{ scale: 1.05 }}
                        className="p-6 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] hover:border-[rgb(var(--color-primary))] transition-all"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${platform.color}20`, color: platform.color }}
                          >
                            <platform.icon className="w-6 h-6" />
                          </div>
                          <div className="font-bold text-[rgb(var(--color-text-primary))]">
                            {platform.name}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-[rgb(var(--color-text-secondary))]">Followers</span>
                            <span className="font-bold text-[rgb(var(--color-text-primary))]">{platform.followers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-[rgb(var(--color-text-secondary))]">Engagement</span>
                            <span className="font-bold text-green-500">{platform.engagement}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-[rgb(var(--color-text-secondary))]">Avg Likes</span>
                            <span className="font-bold text-[rgb(var(--color-text-primary))]">{platform.avgLikes}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-[rgb(var(--color-text-secondary))]">Avg Comments</span>
                            <span className="font-bold text-[rgb(var(--color-text-primary))]">{platform.avgComments}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Followers Growth */}
                <div className="glass rounded-2xl p-8 border border-[rgb(var(--color-border-light))]">
                  <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-6">
                    Followers Growth (Last 6 Months)
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={followersGrowthData}>
                      <defs>
                        <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0000ff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0000ff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="month" stroke="rgb(var(--color-text-secondary))" />
                      <YAxis stroke="rgb(var(--color-text-secondary))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgb(var(--color-background-secondary))', 
                          border: '1px solid rgb(var(--color-border-medium))',
                          borderRadius: '12px'
                        }} 
                      />
                      <Area type="monotone" dataKey="followers" stroke="#0000ff" strokeWidth={3} fillOpacity={1} fill="url(#colorFollowers)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 pb-16"
              >
                {/* Engagement Rate */}
                <div className="glass rounded-2xl p-8 border border-[rgb(var(--color-border-light))]">
                  <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-6">
                    Weekly Engagement Rate
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="day" stroke="rgb(var(--color-text-secondary))" />
                      <YAxis stroke="rgb(var(--color-text-secondary))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgb(var(--color-background-secondary))', 
                          border: '1px solid rgb(var(--color-border-medium))',
                          borderRadius: '12px'
                        }} 
                      />
                      <Bar dataKey="engagement" fill="#0000ff" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Demographics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass rounded-2xl p-8 border border-[rgb(var(--color-border-light))]">
                    <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-6">
                      Audience Age Distribution
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={audienceDemographics}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {audienceDemographics.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>

                  <div className="glass rounded-2xl p-8 border border-[rgb(var(--color-border-light))]">
                    <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-6">
                      Audience Gender Distribution
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={audienceGender}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {audienceGender.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'content' && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pb-16"
              >
                <div className="glass rounded-2xl p-8 border border-[rgb(var(--color-border-light))]">
                  <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-6">
                    Recent Posts
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recentPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        whileHover={{ scale: 1.05 }}
                        className="group cursor-pointer"
                      >
                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                          <img 
                            src={post.image} 
                            alt={`Post ${post.id}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex items-center justify-between text-white text-sm">
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  {(post.likes / 1000).toFixed(1)}K
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircleIcon className="w-4 h-4" />
                                  {post.comments}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Share2 className="w-4 h-4" />
                                  {post.shares}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                          {post.date}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'audience' && (
              <motion.div
                key="audience"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pb-16"
              >
                <div className="glass rounded-2xl p-8 border border-[rgb(var(--color-border-light))]">
                  <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-6">
                    Top Locations
                  </h2>
                  <div className="space-y-4">
                    {topLocations.map((location, index) => (
                      <div key={location.country} className="flex items-center gap-4">
                        <div className="w-8 text-center font-bold text-[rgb(var(--color-text-secondary))]">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-[rgb(var(--color-text-primary))]">
                              {location.country}
                            </span>
                            <span className="font-bold text-[rgb(var(--color-text-primary))]">
                              {location.percentage}%
                            </span>
                          </div>
                          <div className="h-3 bg-[rgb(var(--color-background-secondary))] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${location.percentage}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-full gradient-primary"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 p-4"
            >
              <div className="glass rounded-2xl p-8 border border-[rgb(var(--color-border-light))] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
                    Contact {profile.name}
                  </h2>
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="w-10 h-10 rounded-xl bg-[rgb(var(--color-background-secondary))] hover:bg-red-500/10 text-[rgb(var(--color-text-secondary))] hover:text-red-500 transition-all flex items-center justify-center"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-6">
                  {messageError && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                      {messageError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                      Campaign Type *
                    </label>
                    <select
                      value={messageData.campaignType}
                      onChange={(e) => setMessageData({ ...messageData, campaignType: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                    >
                      <option value="">Select campaign type</option>
                      <option value="Sponsored Post">Sponsored Post</option>
                      <option value="Product Review">Product Review</option>
                      <option value="Brand Ambassador">Brand Ambassador</option>
                      <option value="Event Coverage">Event Coverage</option>
                      <option value="Giveaway">Giveaway</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={messageData.subject}
                      onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
                      placeholder="e.g., Collaboration Opportunity - Summer Fashion Campaign"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                      Budget Range *
                    </label>
                    <input
                      type="text"
                      value={messageData.budget}
                      onChange={(e) => setMessageData({ ...messageData, budget: e.target.value })}
                      placeholder="e.g., $1000 - $1500"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                      Message *
                    </label>
                    <textarea
                      value={messageData.message}
                      onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                      placeholder="Describe your collaboration proposal, campaign details, deliverables, and timeline..."
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowContactModal(false)}
                      className="flex-1 px-6 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] text-[rgb(var(--color-text-primary))] border border-[rgb(var(--color-border-medium))] font-bold hover:border-[rgb(var(--color-primary))] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex-1 px-6 py-3 rounded-xl gradient-primary text-white font-bold shadow-primary-glow hover:shadow-primary-glow-hover transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <Send className="w-5 h-5" />
                      {sending ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Call/Schedule Modal */}
      <AnimatePresence>
        {showCallModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCallModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4"
            >
              <div className="glass rounded-2xl p-8 border border-[rgb(var(--color-border-light))]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
                    Schedule a Call
                  </h2>
                  <button
                    onClick={() => setShowCallModal(false)}
                    className="w-10 h-10 rounded-xl bg-[rgb(var(--color-background-secondary))] hover:bg-red-500/10 text-[rgb(var(--color-text-secondary))] hover:text-red-500 transition-all flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-green-500/20">
                    <img 
                      src={profile.avatar} 
                      alt={profile.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-lg text-[rgb(var(--color-text-primary))] mb-1">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                    {profile.username}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Contact Info */}
                  <div className="p-4 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs text-[rgb(var(--color-text-tertiary))]">Phone Number</p>
                        <p className="font-bold text-[rgb(var(--color-text-primary))]">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                      Available for calls: Mon-Fri, 9AM-5PM PST
                    </p>
                  </div>

                  {/* Email Alternative */}
                  <div className="p-4 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-[rgb(var(--color-text-tertiary))]">Email</p>
                        <p className="font-bold text-[rgb(var(--color-text-primary))]">sarah@agency.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                      Preferred Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                      Call Purpose (Optional)
                    </label>
                    <textarea
                      placeholder="Brief description of what you'd like to discuss..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCallModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] text-[rgb(var(--color-text-primary))] border border-[rgb(var(--color-border-medium))] font-bold hover:border-[rgb(var(--color-primary))] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle call scheduling
                      console.log('Call scheduled');
                      setShowCallModal(false);
                    }}
                    className="flex-1 px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Request Call
                  </button>
                </div>

                <p className="text-xs text-center text-[rgb(var(--color-text-tertiary))] mt-4">
                  The influencer will receive your call request and confirm the appointment
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}