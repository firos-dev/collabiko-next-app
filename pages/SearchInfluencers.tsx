import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, MapPin, Users, TrendingUp, Instagram, Youtube, Twitter, Facebook, Star, Target, ChevronDown, CheckCircle, Award } from 'lucide-react';
import { DashboardHeader } from '../components/DashboardHeader';
import { listInfluencers, type ApiInfluencer } from '../src/api/influencers';

interface SearchInfluencersProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface Influencer {
  id: string;
  name: string;
  username: string;
  avatar: string;
  niche: string;
  location: string;
  followers: string;
  engagement: string;
  platforms: string[];
  rating: number;
  verified: boolean;
  priceRange: string;
  bio?: string;
  price?: string;
}

function mapApiToInfluencer(a: ApiInfluencer): Influencer {
  const name = [a.user?.firstName, a.user?.lastName].filter(Boolean).join(' ') || a.username || 'Influencer';
  return {
    id: a.id,
    name,
    username: a.username ? (a.username.startsWith('@') ? a.username : `@${a.username}`) : '',
    avatar: a.user?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    niche: a.niches?.[0]?.niche || 'General',
    location: a.location || '—',
    followers: a.totalFollowers || '—',
    engagement: a.avgEngagement ? `${a.avgEngagement}%` : '—',
    platforms: (a.platforms?.map((p) => p.platform?.toLowerCase()) || []).filter(Boolean),
    rating: a.rating ? parseFloat(String(a.rating)) : 0,
    verified: !!a.verified,
    priceRange: a.priceRange || '—',
    bio: a.bio || undefined,
    price: a.priceRange || undefined,
  };
}

const niches = ['All', 'Fashion & Lifestyle', 'Tech & Gaming', 'Beauty & Makeup', 'Fitness & Health', 'Travel & Adventure', 'Food & Cooking', 'Business & Finance', 'Entertainment'];
const followerRanges = ['All', '10K - 50K', '50K - 100K', '100K - 500K', '500K+'];
const engagementRanges = ['All', '0% - 2%', '2% - 4%', '4% - 6%', '6%+'];

export function SearchInfluencers({ theme, toggleTheme }: SearchInfluencersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('All');
  const [selectedFollowerRange, setSelectedFollowerRange] = useState('All');
  const [selectedEngagement, setSelectedEngagement] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    listInfluencers({
      search: searchQuery || undefined,
      niche: selectedNiche === 'All' ? undefined : selectedNiche,
    })
      .then((res) => {
        if (!cancelled) {
          setInfluencers((res.items || []).map(mapApiToInfluencer));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || 'Failed to load influencers');
          setInfluencers([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [searchQuery, selectedNiche]);

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesSearch = !searchQuery ||
      influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.niche.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNiche = selectedNiche === 'All' || influencer.niche === selectedNiche;
    return matchesSearch && matchesNiche;
  });

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background-primary))]">
      {/* Header */}
      <DashboardHeader
        userType="brand"
        theme={theme}
        toggleTheme={toggleTheme}
        showBackButton={true}
      />

      {/* Main Content */}
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Page Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 glass rounded-2xl border border-[rgb(var(--color-border-light))] w-full sm:w-auto">
              <button
                className="px-6 py-3 rounded-xl gradient-primary text-white font-bold shadow-primary-glow transition-all"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Influencers
                </div>
              </button>
              <a
                href="/create-campaign"
                className="px-6 py-3 rounded-xl bg-transparent text-[rgb(var(--color-text-secondary))] font-bold hover:bg-[rgb(var(--color-background-secondary))] transition-all"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Create Campaign
                </div>
              </a>
            </div>
          </motion.div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[rgb(var(--color-text-primary))] mb-4">
              Search Influencers
            </h1>
            <p className="text-lg text-[rgb(var(--color-text-secondary))]">
              Discover the perfect influencers for your brand collaborations
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="glass rounded-2xl p-4 sm:p-6 border border-[rgb(var(--color-border-light))]">
              {/* Search Input */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
                  <input
                    type="text"
                    placeholder="Search by name, username, or niche..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-4 rounded-xl font-bold flex items-center gap-2 transition-all ${
                    showFilters 
                      ? 'gradient-primary text-white shadow-primary-glow' 
                      : 'bg-[rgb(var(--color-background-secondary))] text-[rgb(var(--color-text-primary))] border border-[rgb(var(--color-border-medium))]'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </motion.button>
              </div>

              {/* Filter Options */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[rgb(var(--color-border-light))]">
                      {/* Niche Filter */}
                      <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                          Niche
                        </label>
                        <div className="relative">
                          <select
                            value={selectedNiche}
                            onChange={(e) => setSelectedNiche(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                          >
                            {niches.map(niche => (
                              <option key={niche} value={niche}>{niche}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))] pointer-events-none" />
                        </div>
                      </div>

                      {/* Followers Filter */}
                      <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                          Followers
                        </label>
                        <div className="relative">
                          <select
                            value={selectedFollowerRange}
                            onChange={(e) => setSelectedFollowerRange(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                          >
                            {followerRanges.map(range => (
                              <option key={range} value={range}>{range}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))] pointer-events-none" />
                        </div>
                      </div>

                      {/* Engagement Filter */}
                      <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                          Engagement Rate
                        </label>
                        <div className="relative">
                          <select
                            value={selectedEngagement}
                            onChange={(e) => setSelectedEngagement(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
                          >
                            {engagementRanges.map(range => (
                              <option key={range} value={range}>{range}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            {error && (
              <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            )}
            <p className="text-[rgb(var(--color-text-secondary))]">
              Found <span className="font-bold text-[rgb(var(--color-text-primary))]">{filteredInfluencers.length}</span> influencers
            </p>
          </motion.div>

          {loading && (
            <div className="py-12 text-center text-[rgb(var(--color-text-secondary))]">Loading influencers...</div>
          )}

          {/* Influencer Cards */}
          {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInfluencers.map((influencer, index) => (
              <motion.a
                key={influencer.id}
                href={`/influencer-profile/${influencer.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass rounded-2xl overflow-hidden border border-[rgb(var(--color-border-light))] hover:border-[rgb(var(--color-primary))] transition-all group cursor-pointer"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={influencer.avatar}
                        alt={influencer.name}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-[rgb(var(--color-background-secondary))]"
                      />
                      {influencer.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-[rgb(var(--color-background-primary))]">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-[rgb(var(--color-text-primary))] truncate">
                        {influencer.name}
                      </h3>
                      <p className="text-sm text-[rgb(var(--color-text-tertiary))] truncate">
                        {influencer.username}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-[rgb(var(--color-text-primary))]">
                          {influencer.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-4 line-clamp-2">
                    {influencer.bio}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[rgb(var(--color-background-secondary))] rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                        <span className="text-xs text-[rgb(var(--color-text-tertiary))]">Followers</span>
                      </div>
                      <p className="font-bold text-[rgb(var(--color-text-primary))]">
                        {influencer.followers}
                      </p>
                    </div>
                    <div className="bg-[rgb(var(--color-background-secondary))] rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-[rgb(var(--color-text-tertiary))]">Engagement</span>
                      </div>
                      <p className="font-bold text-[rgb(var(--color-text-primary))]">
                        {influencer.engagement}
                      </p>
                    </div>
                  </div>

                  {/* Niche & Location */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[rgb(var(--color-text-tertiary))]" />
                      <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                        {influencer.niche}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[rgb(var(--color-text-tertiary))]" />
                      <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                        {influencer.location}
                      </span>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="flex items-center gap-2 mb-4">
                    {influencer.platforms.map(platform => (
                      <div
                        key={platform}
                        className="w-8 h-8 rounded-lg bg-[rgb(var(--color-background-secondary))] flex items-center justify-center text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] transition-colors"
                      >
                        {getPlatformIcon(platform)}
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="mt-auto pt-4 border-t border-[rgb(var(--color-border-light))]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-[rgb(var(--color-text-tertiary))]">Price Range</span>
                      <span className="font-bold text-[rgb(var(--color-text-primary))]">
                        {influencer.price}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 rounded-xl gradient-primary text-white font-bold hover:shadow-primary-glow-hover transition-all"
                    >
                      View Profile
                    </motion.button>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
          )}

          {/* Empty State */}
          {!loading && filteredInfluencers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[rgb(var(--color-background-secondary))] flex items-center justify-center">
                <Search className="w-12 h-12 text-[rgb(var(--color-text-tertiary))]" />
              </div>
              <h3 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">
                No influencers found
              </h3>
              <p className="text-[rgb(var(--color-text-secondary))] mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedNiche('All');
                  setSelectedFollowerRange('All');
                  setSelectedEngagement('All');
                }}
                className="px-6 py-3 rounded-xl gradient-primary text-white font-bold hover:shadow-primary-glow-hover transition-all"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}