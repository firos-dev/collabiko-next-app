import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  User, Edit, Save, X, Camera, Building2,
} from 'lucide-react';
import { DashboardHeader } from '../components/DashboardHeader';
import { getMyBrandProfile, updateMyBrandProfile } from '../src/api/brands';

interface BrandProfilePageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const INDUSTRIES = [
  'Technology', 'Fashion', 'Health & Fitness', 'Food & Beverage', 'Travel',
  'Lifestyle', 'Beauty', 'Gaming', 'Finance', 'Education', 'Entertainment',
  'Sports', 'Automotive', 'Real Estate', 'E-commerce', 'Other',
];

export function BrandProfilePage({ theme, toggleTheme }: BrandProfilePageProps) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    brandName: '',
    email: '',
    website: '',
    bio: '',
    industry: '',
    logoUrl: '',
  });
  const [savedProfile, setSavedProfile] = useState({
    brandName: '',
    email: '',
    website: '',
    bio: '',
    industry: '',
    logoUrl: '',
  });

  useEffect(() => {
    getMyBrandProfile()
      .then((data) => {
        if (!data) {
          setProfileError('Brand profile not found. Please contact support.');
          return;
        }
        const p = {
          brandName: data.brandName || '',
          email: data.user?.email || '',
          website: data.website || '',
          bio: data.bio || '',
          industry: data.industry || '',
          logoUrl: data.logoUrl || '',
        };
        setProfile(p);
        setSavedProfile(p);
      })
      .catch((err: unknown) => {
        setProfileError((err instanceof Error ? err.message : null) || 'Failed to load profile');
      })
      .finally(() => setProfileLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileError(null);
    try {
      const updated = await updateMyBrandProfile({
        brandName: profile.brandName || undefined,
        bio: profile.bio || null,
        website: profile.website || null,
        industry: profile.industry || null,
        logoUrl: profile.logoUrl || null,
      });
      const p = {
        brandName: updated.brandName || '',
        email: updated.user?.email || savedProfile.email,
        website: updated.website || '',
        bio: updated.bio || '',
        industry: updated.industry || '',
        logoUrl: updated.logoUrl || '',
      };
      setProfile(p);
      setSavedProfile(p);
      setEditingProfile(false);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background-primary))]">
      <DashboardHeader
        userType="brand"
        theme={theme}
        toggleTheme={toggleTheme}
        userName={profile.brandName || 'Brand'}
        userSubtitle="Brand Profile"
        showBackButton
        onBackClick={() => {
          window.history.pushState({}, '', '/brand-home');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
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
              {/* Profile Header Banner */}
              <div className="relative h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              <div className="px-8 pb-8">
                {/* Logo / Avatar */}
                <div className="relative -mt-20 mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-4 border-[rgb(var(--color-background-secondary))] flex items-center justify-center shadow-xl overflow-hidden">
                    {profile.logoUrl ? (
                      <img src={profile.logoUrl} alt="Brand logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-16 h-16 text-white" />
                    )}
                  </div>
                  {editingProfile && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg"
                      title="Change logo URL below"
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
                      <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Brand Name</label>
                      <input
                        type="text"
                        value={profile.brandName}
                        onChange={(e) => setProfile((prev) => ({ ...prev, brandName: e.target.value }))}
                        disabled={!editingProfile}
                        className="w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        readOnly
                        disabled
                        className="w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Website</label>
                      <input
                        type="url"
                        value={profile.website}
                        onChange={(e) => setProfile((prev) => ({ ...prev, website: e.target.value }))}
                        disabled={!editingProfile}
                        placeholder="https://yourbrand.com"
                        className="w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Logo URL</label>
                      <input
                        type="url"
                        value={profile.logoUrl}
                        onChange={(e) => setProfile((prev) => ({ ...prev, logoUrl: e.target.value }))}
                        disabled={!editingProfile}
                        placeholder="https://example.com/logo.png"
                        className="w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                      disabled={!editingProfile}
                      rows={4}
                      placeholder="Tell influencers about your brand..."
                      className="w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 resize-none"
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-2">Industry</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.industry && (
                        <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg flex items-center gap-2">
                          {profile.industry}
                          {editingProfile && (
                            <button
                              onClick={() => setProfile((prev) => ({ ...prev, industry: '' }))}
                              className="hover:text-blue-900 dark:hover:text-blue-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </span>
                      )}
                      {editingProfile && !profile.industry && (
                        <select
                          className="px-3 py-2 border-2 border-dashed border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-secondary))] rounded-lg bg-transparent focus:outline-none hover:border-blue-500 hover:text-blue-500 transition-colors text-sm"
                          value=""
                          onChange={(e) => {
                            if (!e.target.value) return;
                            setProfile((prev) => ({ ...prev, industry: e.target.value }));
                          }}
                        >
                          <option value="">+ Select Industry</option>
                          {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                        </select>
                      )}
                      {!editingProfile && !profile.industry && (
                        <p className="text-[rgb(var(--color-text-secondary))] text-sm">No industry set.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
