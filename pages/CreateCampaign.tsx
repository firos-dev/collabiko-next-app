import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, X, DollarSign, Calendar, Users, Target, TrendingUp, Search, Sparkles, FileText } from 'lucide-react';
import { DashboardHeader } from '../components/DashboardHeader';
import { createCampaign } from '../src/api/campaigns';
import { ApiError } from '../src/api/http';

const niches = ["Fashion & Lifestyle", "Tech & Gaming", "Beauty & Makeup", "Fitness & Health", "Travel & Adventure", "Food & Cooking", "Business & Finance", "Entertainment"];
const platforms = ["Instagram", "YouTube", "TikTok", "Twitter", "Facebook", "LinkedIn"];
const contentTypes = ["Photo Post", "Video Post", "Story", "Reel", "Blog Post", "Live Stream"];

interface CreateCampaignProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function CreateCampaign({ theme, toggleTheme }: CreateCampaignProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    niche: '',
    platforms: [] as string[],
    contentType: '',
    startDate: '',
    endDate: '',
    budget: '',
    minFollowers: '',
    maxFollowers: '',
    targetAudience: '',
    requirements: '',
    deliverables: [''],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData({
      ...formData,
      platforms: formData.platforms.includes(platform)
        ? formData.platforms.filter(p => p !== platform)
        : [...formData.platforms, platform]
    });
  };

  const addDeliverable = () => {
    setFormData({
      ...formData,
      deliverables: [...formData.deliverables, '']
    });
  };

  const removeDeliverable = (index: number) => {
    setFormData({
      ...formData,
      deliverables: formData.deliverables.filter((_, i) => i !== index)
    });
  };

  const updateDeliverable = (index: number, value: string) => {
    const newDeliverables = [...formData.deliverables];
    newDeliverables[index] = value;
    setFormData({
      ...formData,
      deliverables: newDeliverables
    });
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      await createCampaign({
        title: formData.title,
        description: formData.description,
        niche: formData.niche,
        platforms: formData.platforms,
        contentType: formData.contentType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget,
        minFollowers: formData.minFollowers || undefined,
        maxFollowers: formData.maxFollowers || undefined,
        targetAudience: formData.targetAudience || undefined,
        requirements: formData.requirements || undefined,
        deliverables: formData.deliverables.filter(Boolean),
      });
      window.history.pushState({}, '', '/brand-dashboard');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Failed to create campaign');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background-primary))]">
      {/* Header */}
      <DashboardHeader userType="brand" theme={theme} toggleTheme={toggleTheme} showBackButton={true} />

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
              <a
                href="/search-influencers"
                className="px-6 py-3 rounded-xl bg-transparent text-[rgb(var(--color-text-secondary))] font-bold hover:bg-[rgb(var(--color-background-secondary))] transition-all"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search Influencers
                </div>
              </a>
              <button
                className="px-6 py-3 rounded-xl gradient-primary text-white font-bold shadow-primary-glow transition-all"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Create Campaign
                </div>
              </button>
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
              Create New Campaign
            </h1>
            <p className="text-lg text-[rgb(var(--color-text-secondary))]">
              Launch a campaign and let influencers apply to collaborate with your brand
            </p>
          </motion.div>

          {/* Campaign Form */}
          {submitError && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {submitError}
            </div>
          )}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Basic Information */}
            <div className="glass rounded-2xl p-8 border border-[rgb(var(--color-border-light))]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
                  Basic Information
                </h2>
              </div>

              <div className="space-y-6">
                {/* Campaign Title */}
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Summer Fashion Collection Launch"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                  />
                </div>

                {/* Campaign Description */}
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                    Campaign Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your campaign goals, brand values, and what you're looking for in a collaboration..."
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all resize-none"
                  />
                </div>

                {/* Niche and Content Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                      Niche *
                    </label>
                    <select
                      name="niche"
                      value={formData.niche}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                    >
                      <option value="">Select a niche</option>
                      {niches.map(niche => (
                        <option key={niche} value={niche}>{niche}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                      Content Type *
                    </label>
                    <select
                      name="contentType"
                      value={formData.contentType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                    >
                      <option value="">Select content type</option>
                      {contentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Platforms */}
            <div className="glass rounded-2xl p-8 border border-[rgb(var(--color-border-light))]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
                  Platforms
                </h2>
              </div>

              <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-4">
                Select the platforms where you want the campaign to run *
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {platforms.map(platform => (
                  <motion.button
                    key={platform}
                    type="button"
                    onClick={() => handlePlatformToggle(platform)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      formData.platforms.includes(platform)
                        ? 'gradient-primary text-white shadow-primary-glow'
                        : 'bg-[rgb(var(--color-background-secondary))] text-[rgb(var(--color-text-primary))] border border-[rgb(var(--color-border-medium))] hover:border-[rgb(var(--color-primary))]'
                    }`}
                  >
                    {platform}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Timeline & Budget */}
            <div className="glass rounded-2xl p-8 border border-[rgb(var(--color-border-light))]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
                  Timeline & Budget
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                    Campaign Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                    Campaign End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                  />
                </div>

                {/* Budget */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                    Total Budget (USD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="e.g., 5000"
                      required
                      min="0"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Target Influencers */}
            <div className="glass rounded-2xl p-8 border border-[rgb(var(--color-border-light))]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
                  Target Influencers
                </h2>
              </div>

              <div className="space-y-6">
                {/* Follower Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                      Minimum Followers
                    </label>
                    <input
                      type="number"
                      name="minFollowers"
                      value={formData.minFollowers}
                      onChange={handleInputChange}
                      placeholder="e.g., 10000"
                      min="0"
                      className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                      Maximum Followers
                    </label>
                    <input
                      type="number"
                      name="maxFollowers"
                      value={formData.maxFollowers}
                      onChange={handleInputChange}
                      placeholder="e.g., 1000000"
                      min="0"
                      className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                    />
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                    Target Audience Description
                  </label>
                  <textarea
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    placeholder="Describe the ideal audience demographics, interests, and characteristics..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Campaign Requirements */}
            <div className="glass rounded-2xl p-8 border border-[rgb(var(--color-border-light))]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">
                  Requirements & Deliverables
                </h2>
              </div>

              <div className="space-y-6">
                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                    Campaign Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="List any specific requirements, guidelines, or expectations for influencers..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all resize-none"
                  />
                </div>

                {/* Deliverables */}
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                    Expected Deliverables *
                  </label>
                  <div className="space-y-3">
                    {formData.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          value={deliverable}
                          onChange={(e) => updateDeliverable(index, e.target.value)}
                          placeholder={`Deliverable ${index + 1} (e.g., 3 Instagram posts with product tags)`}
                          required
                          className="flex-1 px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-medium))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] transition-all"
                        />
                        {formData.deliverables.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDeliverable(index)}
                            className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addDeliverable}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[rgb(var(--color-background-secondary))] text-[rgb(var(--color-text-primary))] border border-[rgb(var(--color-border-medium))] hover:border-[rgb(var(--color-primary))] transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Add Deliverable
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <motion.button
                type="button"
                onClick={() => window.history.back()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl bg-[rgb(var(--color-background-secondary))] text-[rgb(var(--color-text-primary))] border border-[rgb(var(--color-border-medium))] font-bold hover:border-[rgb(var(--color-primary))] transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 rounded-xl gradient-primary text-white font-bold hover:shadow-primary-glow-hover transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <TrendingUp className="w-5 h-5" />
                {submitting ? 'Creating...' : 'Launch Campaign'}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </main>
    </div>
  );
}