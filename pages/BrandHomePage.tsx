import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Briefcase,
  DollarSign, Clock, MapPin, Calendar, X, ArrowRight,
  Edit, ChevronDown, Check,
  Instagram, Youtube, Twitter, Facebook,
  Star, AlertCircle, CheckCircle,
} from 'lucide-react';
import { DashboardHeader } from '../components/DashboardHeader';
import {
  getMyBrandCampaigns,
  getCampaignApplications,
  updateCampaign,
  updateApplicationStatus,
  type ApiCampaign,
  type ApiApplication,
  type UpdateCampaignPayload,
} from '../src/api/campaigns';

interface BrandHomePageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function BrandHomePage({ theme, toggleTheme }: BrandHomePageProps) {
  const [campaigns, setCampaigns] = useState<ApiCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBrandCampaigns()
      .then((data) => {
        setCampaigns(data.items ?? []);
      })
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background-primary))]">
      <DashboardHeader
        userType="brand"
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
        {/* Page heading */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">My Campaigns</h1>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
              {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={() => {
                window.history.pushState({}, '', '/brand-dashboard');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-4 py-2.5 bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-xl flex items-center gap-2 hover:bg-[rgb(var(--color-background-tertiary))] transition-colors text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Back
            </motion.button>
            <motion.button
              onClick={() => {
                window.history.pushState({}, '', '/create-campaign');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-colors text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowRight className="w-4 h-4" /> Create Campaign
            </motion.button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 text-[rgb(var(--color-text-secondary))]">
            Loading campaigns...
          </div>
        )}

        {/* Empty */}
        {!loading && campaigns.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-[rgb(var(--color-text-tertiary))] mx-auto mb-4" />
            <p className="text-[rgb(var(--color-text-secondary))] text-lg">No campaigns yet</p>
            <p className="text-[rgb(var(--color-text-tertiary))] text-sm mt-2">
              Create your first campaign to get started
            </p>
          </div>
        )}

        {/* Campaign grid */}
        {!loading && campaigns.length > 0 && (
          <CampaignGrid campaigns={campaigns} setCampaigns={setCampaigns} />
        )}
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
// CampaignGrid
// ---------------------------------------------------------------------------

interface CampaignGridProps {
  campaigns: ApiCampaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<ApiCampaign[]>>;
}

function getStatusGradient(status: string): string {
  switch (status) {
    case 'featured': return 'from-yellow-400 to-orange-500';
    case 'closing-soon': return 'from-red-500 to-pink-600';
    case 'closed': return 'from-gray-400 to-gray-500';
    default: return 'from-green-500 to-emerald-600'; // open
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'featured': return <Star className="w-3 h-3 fill-white inline mr-1" />;
    case 'closing-soon': return <AlertCircle className="w-3 h-3 inline mr-1" />;
    case 'closed': return null;
    default: return <CheckCircle className="w-3 h-3 inline mr-1" />; // open
  }
}

function getPlatformIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case 'instagram': return <Instagram className="w-4 h-4" />;
    case 'youtube': return <Youtube className="w-4 h-4" />;
    case 'twitter': return <Twitter className="w-4 h-4" />;
    case 'facebook': return <Facebook className="w-4 h-4" />;
    default: return null;
  }
}

function CampaignGrid({ campaigns, setCampaigns }: CampaignGridProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<ApiCampaign | null>(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  const handleStatusChange = async (campaign: ApiCampaign, newStatus: string) => {
    setStatusUpdating(campaign.id);
    try {
      const updated = await updateCampaign(campaign.id, {
        status: newStatus as UpdateCampaignPayload['status'],
      });
      if (updated) {
        setCampaigns((prev) =>
          prev.map((c) => (c.id === campaign.id ? { ...c, status: updated.status } : c))
        );
      }
    } catch {
      // revert is automatic — state unchanged on error
    } finally {
      setStatusUpdating(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((campaign) => {
          return (
            <motion.div
              key={campaign.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[rgb(var(--color-background-secondary))] rounded-2xl border border-[rgb(var(--color-border-light))] overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Card header */}
              <div className="p-6 border-b border-[rgb(var(--color-border-light))]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center text-2xl">
                      🎯
                    </div>
                    <div>
                      <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">
                        {campaign.brand?.brandName ?? 'Brand'}
                      </h3>
                      <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                        {campaign.category ?? ''}
                      </p>
                    </div>
                  </div>

                  {/* Status dropdown with gradient styling */}
                  <div className="relative flex items-center">
                    {/* Icon overlay — positioned left of select text */}
                    <div className="pointer-events-none absolute left-2 z-10 flex items-center text-white">
                      {getStatusIcon(campaign.status)}
                    </div>
                    <select
                      value={campaign.status}
                      disabled={statusUpdating === campaign.id}
                      onChange={(e) => handleStatusChange(campaign, e.target.value)}
                      className={`appearance-none text-xs font-semibold pl-7 pr-7 py-1.5 rounded-full border-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 text-white bg-gradient-to-r ${getStatusGradient(campaign.status)} focus:outline-none`}
                    >
                      <option value="open">Open</option>
                      <option value="closing-soon">Closing Soon</option>
                      <option value="featured">Featured</option>
                      <option value="closed">Closed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                      <ChevronDown className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
                <h4 className="font-semibold text-[rgb(var(--color-text-primary))] mb-2">
                  {campaign.title}
                </h4>
                <p className="text-[rgb(var(--color-text-secondary))] text-sm line-clamp-2">
                  {campaign.description}
                </p>
              </div>

              {/* Card body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-[rgb(var(--color-text-secondary))]">Budget:</span>
                    <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                      {campaign.budget ?? '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-[rgb(var(--color-text-secondary))]">Duration:</span>
                    <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                      {campaign.duration ?? '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span className="text-[rgb(var(--color-text-secondary))]">Location:</span>
                    <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                      {campaign.location ?? 'Remote'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-[rgb(var(--color-text-secondary))]">Applicants:</span>
                    <span className="font-semibold text-[rgb(var(--color-text-primary))]">
                      {campaign.applicantsCount}
                    </span>
                  </div>
                </div>

                {/* Platforms */}
                {(campaign.platforms?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {campaign.platforms!.map((p) => (
                      <span key={p.platform} className="px-3 py-1.5 bg-[rgb(var(--color-background-tertiary))] border border-[rgb(var(--color-border-light))] rounded-lg flex items-center gap-1.5 text-sm text-[rgb(var(--color-text-primary))] capitalize">
                        {getPlatformIcon(p.platform)}
                        {p.platform}
                      </span>
                    ))}
                  </div>
                )}

                {/* Requirements tags */}
                <div className="flex flex-wrap gap-2">
                  {campaign.minFollowers && (
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs">
                      {campaign.minFollowers} followers
                    </span>
                  )}
                  {campaign.niche && (
                    <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg text-xs">
                      {campaign.niche}
                    </span>
                  )}
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-secondary))] pt-4 border-t border-[rgb(var(--color-border-light))]">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Deadline:{' '}
                    {campaign.deadline
                      ? new Date(campaign.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '—'}
                  </span>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-6 py-4 bg-[rgb(var(--color-background-tertiary))] flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCampaign(campaign);
                    setShowEditDrawer(true);
                  }}
                  className="flex-1 py-2.5 bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-xl hover:bg-[rgb(var(--color-background-primary))] transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit Campaign
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCampaign(campaign);
                    setShowApplicationsModal(true);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <Users className="w-4 h-4" />
                  View Applications ({campaign.applicantsCount})
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal/drawer — placeholders replaced in Tasks 5 & 6 */}
      <AnimatePresence>
        {showApplicationsModal && selectedCampaign && (
          <ApplicationsModal
            key="apps-modal"
            campaign={selectedCampaign}
            onClose={() => {
              setShowApplicationsModal(false);
              setSelectedCampaign(null);
            }}
            onApplicationStatusChange={() => {}}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditDrawer && selectedCampaign && (
          <EditCampaignDrawer
            key="edit-drawer"
            campaign={selectedCampaign}
            onClose={() => {
              setShowEditDrawer(false);
              setSelectedCampaign(null);
            }}
            onSaved={(updated) => {
              setCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
              setShowEditDrawer(false);
              setSelectedCampaign(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ApplicationsModal({ campaign, onClose, onApplicationStatusChange }: {
  campaign: ApiCampaign;
  onClose: () => void;
  onApplicationStatusChange: (appId: string, status: string) => void;
}) {
  const [applications, setApplications] = useState<ApiApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchApplications = () => {
    setLoading(true);
    setError(null);
    getCampaignApplications(campaign.id)
      .then((data) => setApplications(data.items ?? []))
      .catch(() => setError('Failed to load applications. Please try again.'))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchApplications(); }, [campaign.id]);

  const handleAction = async (app: ApiApplication, status: 'accepted' | 'rejected') => {
    setActionLoading(app.id);
    try {
      await updateApplicationStatus(campaign.id, app.id, status);
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status } : a));
      onApplicationStatusChange(app.id, status);
    } catch {
      // keep existing status on error
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadgeClass = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      accepted: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      expired: 'bg-[rgb(var(--color-background-tertiary))] text-[rgb(var(--color-text-tertiary))]',
    };
    return map[status] ?? map['expired'];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[rgb(var(--color-background-secondary))] rounded-2xl border border-[rgb(var(--color-border-light))] w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Modal header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-5 z-10 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="font-bold text-white text-lg">Applications — {campaign.title}</h2>
            <p className="text-white/70 text-sm">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          {loading && (
            <div className="text-center py-12 text-[rgb(var(--color-text-secondary))]">
              Loading applications...
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>
              <motion.button
                onClick={fetchApplications}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium"
              >
                Retry
              </motion.button>
            </div>
          )}

          {!loading && !error && applications.length === 0 && (
            <div className="text-center py-12 text-[rgb(var(--color-text-secondary))]">
              No applications yet.
            </div>
          )}

          {!loading && !error && applications.map((app) => (
            <div
              key={app.id}
              className="flex items-start gap-4 p-4 bg-[rgb(var(--color-background-primary))] rounded-xl border border-[rgb(var(--color-border-light))]"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[rgb(var(--color-text-primary))] text-sm">
                  @{app.influencer?.username}
                </p>
                <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                  {app.influencer?.totalFollowers != null ? `${app.influencer.totalFollowers} followers` : ''}
                  {app.influencer?.platforms?.[0]?.platform ? ` · ${app.influencer.platforms[0].platform}` : ''}
                </p>
                {app.coverLetter && (
                  <p className="text-xs text-[rgb(var(--color-text-tertiary))] mt-1 italic line-clamp-1">
                    "{app.coverLetter}"
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusBadgeClass(app.status)}`}>
                  {app.status}
                </span>
                {app.status === 'pending' && (
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      disabled={actionLoading === app.id}
                      onClick={() => handleAction(app, 'accepted')}
                      className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 px-3 py-1.5 rounded-lg font-semibold disabled:opacity-60 transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Accept
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      disabled={actionLoading === app.id}
                      onClick={() => handleAction(app, 'rejected')}
                      className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 px-3 py-1.5 rounded-lg font-semibold disabled:opacity-60 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Reject
                    </motion.button>
                  </div>
                )}
                {app.status === 'accepted' && app.influencer?.id && (
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      window.history.pushState({}, '', `/influencer-profile/${app.influencer!.id}`);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="text-xs bg-[rgb(var(--color-background-secondary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-background-tertiary))] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    View Profile
                  </motion.button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function EditCampaignDrawer({ campaign, onClose, onSaved }: {
  campaign: ApiCampaign;
  onClose: () => void;
  onSaved: (updated: ApiCampaign) => void;
}) {
  const PLATFORM_OPTIONS = ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'Facebook', 'LinkedIn'];

  const [form, setForm] = useState({
    title: campaign.title ?? '',
    description: campaign.description ?? '',
    niche: campaign.niche ?? '',
    budget: campaign.budget ?? '',
    location: campaign.location ?? '',
    minFollowers: campaign.minFollowers ?? '',
    maxFollowers: campaign.maxFollowers ?? '',
    targetAudience: campaign.targetAudience ?? '',
    requirements: campaign.requirements ?? '',
    startDate: campaign.startDate ? String(campaign.startDate).slice(0, 10) : '',
    endDate: campaign.endDate ? String(campaign.endDate).slice(0, 10) : '',
    platforms: campaign.platforms?.map((p) => p.platform) ?? [] as string[],
    deliverables: ((campaign.deliverables?.map((d) => d.description) ?? []).join('\n')),
    contentType: (campaign as any).contentTypes?.[0]?.contentType ?? '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePlatform = (p: string) => {
    setForm(f => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter(x => x !== p) : [...f.platforms, p],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: UpdateCampaignPayload = {};

      if (form.title !== (campaign.title ?? '')) payload.title = form.title;
      if (form.description !== (campaign.description ?? '')) payload.description = form.description;
      if (form.niche !== (campaign.niche ?? '')) payload.niche = form.niche;
      if (form.budget !== (campaign.budget ?? '')) payload.budget = form.budget;
      if (form.location !== (campaign.location ?? '')) payload.location = form.location;
      if (form.minFollowers !== (campaign.minFollowers ?? '')) payload.minFollowers = form.minFollowers;
      if (form.maxFollowers !== (campaign.maxFollowers ?? '')) payload.maxFollowers = form.maxFollowers;
      if (form.targetAudience !== (campaign.targetAudience ?? '')) payload.targetAudience = form.targetAudience;
      if (form.requirements !== (campaign.requirements ?? '')) payload.requirements = form.requirements;

      const origStart = campaign.startDate ? String(campaign.startDate).slice(0, 10) : '';
      const origEnd = campaign.endDate ? String(campaign.endDate).slice(0, 10) : '';
      if (form.startDate !== origStart) payload.startDate = form.startDate;
      if (form.endDate !== origEnd) payload.endDate = form.endDate;

      // platforms
      const origPlatforms = ((campaign.platforms?.map((p) => p.platform) ?? []).slice().sort().join(','));
      const newPlatforms = form.platforms.slice().sort().join(',');
      if (origPlatforms !== newPlatforms) payload.platforms = form.platforms;

      // deliverables
      const newDeliverables = form.deliverables.split('\n').map((s: string) => s.trim()).filter(Boolean);
      const origDeliverables = (campaign.deliverables?.map((d) => d.description) ?? []);
      if (JSON.stringify(newDeliverables) !== JSON.stringify(origDeliverables)) payload.deliverables = newDeliverables;

      // contentType
      const origContentType = (campaign as any).contentTypes?.[0]?.contentType ?? '';
      if (form.contentType !== origContentType) payload.contentType = form.contentType;

      const updated = await updateCampaign(campaign.id, payload);
      if (updated) onSaved(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full px-4 py-2 bg-[rgb(var(--color-background-primary))] border border-[rgb(var(--color-border-light))] text-[rgb(var(--color-text-primary))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[rgb(var(--color-text-tertiary))] text-sm";
  const labelCls = "block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2";

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 w-full max-w-xl bg-[rgb(var(--color-background-secondary))] border-l border-[rgb(var(--color-border-light))] z-50 flex flex-col"
      >
        {/* Drawer header */}
        <div className="sticky top-0 bg-[rgb(var(--color-background-secondary))] border-b border-[rgb(var(--color-border-light))] px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[rgb(var(--color-text-primary))]">Edit Campaign</h2>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-[rgb(var(--color-background-tertiary))] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
          </motion.button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <div>
            <label className={labelCls}>Title</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className={`${inputCls} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Niche</label>
              <input type="text" value={form.niche} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Budget</label>
              <input type="text" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} className={inputCls} placeholder="e.g. $5,000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Min Followers</label>
              <input type="text" value={form.minFollowers} onChange={e => setForm(f => ({ ...f, minFollowers: e.target.value }))} className={inputCls} placeholder="e.g. 10K" />
            </div>
            <div>
              <label className={labelCls}>Max Followers</label>
              <input type="text" value={form.maxFollowers} onChange={e => setForm(f => ({ ...f, maxFollowers: e.target.value }))} className={inputCls} placeholder="e.g. 500K" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Location</label>
            <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className={inputCls} placeholder="Remote" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Target Audience</label>
            <input type="text" value={form.targetAudience} onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Requirements</label>
            <textarea value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} rows={3} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className={labelCls}>Content Type</label>
            <input type="text" value={form.contentType} onChange={e => setForm(f => ({ ...f, contentType: e.target.value }))} className={inputCls} placeholder="e.g. Reel, Story, Video" />
          </div>
          <div>
            <label className={labelCls}>Platforms</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    form.platforms.includes(p)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-[rgb(var(--color-background-primary))] text-[rgb(var(--color-text-secondary))] border-[rgb(var(--color-border-light))] hover:border-blue-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Deliverables <span className="font-normal text-[rgb(var(--color-text-tertiary))]">(one per line)</span></label>
            <textarea
              value={form.deliverables}
              onChange={e => setForm(f => ({ ...f, deliverables: e.target.value }))}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder={"3 Instagram posts\n2 Stories\n1 Reel"}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* Drawer footer */}
        <div className="border-t border-[rgb(var(--color-border-light))] px-6 py-4 flex gap-3 bg-[rgb(var(--color-background-secondary))]">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 py-3 bg-[rgb(var(--color-background-tertiary))] text-[rgb(var(--color-text-primary))] rounded-xl font-medium hover:bg-[rgb(var(--color-background-primary))] transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
