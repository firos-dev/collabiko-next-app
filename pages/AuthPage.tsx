import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, Users, Building2, Check, Instagram, Music, Camera, Star, TrendingUp, Briefcase, Target, FileText, BarChart3, Handshake } from 'lucide-react';
import { registerInfluencerOrBrand, googleLogin, login } from '../src/api/auth';
import { setToken, setUserType as setStoredUserType, INTENDED_PATH_KEY } from '../src/api/auth-storage';
import { getAccess, dashboardForUserType } from '../src/routing';
import { ApiError } from '../src/api/http';

function extractToken(res: unknown): string | undefined {
  if (!res || typeof res !== 'object') return undefined;
  const o = res as Record<string, unknown>;
  return (o.accessToken as string) ?? (o.token as string);
}

type UserType = 'influencer' | 'brand';
type AuthMode = 'login' | 'register';

function safeSessionGet(key: string): string | null {
  try { return sessionStorage.getItem(key); } catch { return null; }
}
function safeSessionRemove(key: string): void {
  try { sessionStorage.removeItem(key); } catch { /* ignore */ }
}

export function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [userType, setUserType] = useState<UserType>('influencer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    brandName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const redirectToDashboard = (type: UserType) => {
    // Write to localStorage BEFORE dispatching popstate so resolveRoute sees the correct userType
    setStoredUserType(type);

    const intendedPath = safeSessionGet(INTENDED_PATH_KEY);
    safeSessionRemove(INTENDED_PATH_KEY); // always clear immediately

    if (intendedPath !== null) {
      const access = getAccess(intendedPath);
      if (
        (type === 'brand' && access === 'brand-only') ||
        (type === 'influencer' && access === 'influencer-only')
      ) {
        window.history.pushState({}, '', intendedPath);
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }
      // Intended path doesn't match user type (stale value) — fall through to default
    }

    const defaultPath = dashboardForUserType(type);
    window.history.pushState({}, '', defaultPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (isSubmitting) return;

    if (authMode === 'login') {
      const identifier = (formData.phone || formData.email).trim();
      if (!identifier || !formData.password) {
        setSubmitError('Please enter your email and password.');
        return;
      }
      setIsSubmitting(true);
      try {
        const res = await login({
          email: identifier,
          password: formData.password,
        });

        const user = (res as { user?: { userType?: string } }).user;
        const backendUserType = user?.userType;

        if (backendUserType === 'admin') {
          setSubmitError('This page is for influencers and brands only. Please use the admin portal.');
          return;
        }

        const token = extractToken(res);
        if (token) {
          setToken(token);
          const targetType: UserType =
            backendUserType === 'brand' || backendUserType === 'influencer'
              ? backendUserType
              : userType;
          redirectToDashboard(targetType);
        } else {
          redirectToDashboard(userType);
        }
      } catch (err) {
        setSubmitError(
          err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Login failed.'
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Parameters<typeof registerInfluencerOrBrand>[0] = {
        email: formData.email.trim(),
        password: formData.password,
        userType,
      };
      if (userType === 'brand') {
        if (formData.fullName?.trim()) payload.fullName = formData.fullName.trim();
        if (formData.brandName?.trim()) payload.brandName = formData.brandName.trim();
      } else {
        if (formData.firstName?.trim()) payload.firstName = formData.firstName.trim();
        if (formData.lastName?.trim()) payload.lastName = formData.lastName.trim();
      }
      const res = await registerInfluencerOrBrand(payload);

      const token = extractToken(res);
      if (token) {
        const regUser = (res as { user?: { userType?: string } }).user;
        const regBackendType = regUser?.userType;

        if (regBackendType === 'admin') {
          setSubmitError('This page is for influencers and brands only. Please use the admin portal.');
          return;
        }

        setToken(token);
        redirectToDashboard(userType);
        return;
      }
      const message =
        typeof res === 'object' && res !== null && 'message' in res && typeof (res as { message?: unknown }).message === 'string'
          ? (res as { message: string }).message
          : 'Account created successfully. Please sign in.';

      setSubmitSuccess(message);
      setAuthMode('login');
      setFormData((prev) => ({
        ...prev,
        phone: prev.email || prev.phone,
        password: '',
        confirmPassword: '',
      }));
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err.message);
      } else if (err instanceof Error) {
        setSubmitError(err.message || 'Registration failed.');
      } else {
        setSubmitError('Registration failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;
    if (!idToken) return;
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const res = await googleLogin({ idToken, userType });
      const user = (res as { user?: { userType?: string } }).user;
      const backendUserType = user?.userType;

      if (backendUserType === 'admin') {
        setSubmitError('This page is for influencers and brands only. Please use the admin portal.');
        return;
      }

      const token = extractToken(res);
      if (token) setToken(token);
      const targetType: UserType =
        backendUserType === 'brand' || backendUserType === 'influencer' ? backendUserType : userType;
      redirectToDashboard(targetType);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Google sign-in failed.');
    }
  };

  const features = {
    influencer: [
      'Connect with top brands',
      'Monetize your content',
      'Grow your audience',
      'Track your earnings'
    ],
    brand: [
      'Find perfect influencers',
      'Manage campaigns easily',
      'Track ROI and metrics',
      'Scale your reach'
    ]
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[rgb(var(--color-background-primary))]">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 blur-3xl"
        />
      </div>

      {/* Left Side - Modern Banner */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        initial={false}
      >
        <AnimatePresence mode="wait">
          {/* INFLUENCER Background */}
          {userType === 'influencer' && (
            <motion.div
              key="influencer-bg"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.4),transparent)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_80%,rgba(236,72,153,0.5),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_20%_20%,rgba(139,92,246,0.5),transparent_50%)]" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E')] opacity-60" />
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full blur-3xl bg-white/20"
                  style={{
                    width: 200 + i * 80,
                    height: 200 + i * 80,
                    left: `${15 + i * 15}%`,
                    top: `${10 + i * 15}%`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* BRAND Background */}
          {userType === 'brand' && (
            <motion.div
              key="brand-bg"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(56,189,248,0.25),transparent)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_80%_100%,rgba(59,130,246,0.3),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_10%_10%,rgba(14,165,233,0.2),transparent_50%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E')]" />
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm"
                  style={{
                    width: 120 + i * 60,
                    height: 120 + i * 60,
                    left: `${20 + i * 25}%`,
                    top: `${20 + i * 20}%`,
                    transform: `rotate(${i * 15}deg)`,
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.5,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Icon Orbs */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {userType === 'influencer' && (
              <motion.div
                key="influencer-icons"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[
                  { Icon: Instagram, pos: { top: '18%', left: '18%' }, color: '#E1306C' },
                  { Icon: Music, pos: { top: '28%', right: '12%' }, color: '#A855F7' },
                  { Icon: Camera, pos: { top: '55%', left: '8%' }, color: '#EC4899' },
                  { Icon: Star, pos: { bottom: '30%', right: '18%' }, color: '#FBBF24' },
                  { Icon: Users, pos: { bottom: '22%', left: '22%' }, color: '#60A5FA' },
                ].map(({ Icon, pos, color }, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/30"
                    style={pos}
                    animate={{
                      y: [0, -12, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3.5,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Icon className="w-7 h-7 text-white" style={{ color }} />
                  </motion.div>
                ))}
              </motion.div>
            )}
            {userType === 'brand' && (
              <motion.div
                key="brand-icons"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[
                  { Icon: BarChart3, pos: { top: '20%', left: '15%' }, color: '#38BDF8' },
                  { Icon: Target, pos: { top: '30%', right: '15%' }, color: '#60A5FA' },
                  { Icon: Briefcase, pos: { top: '55%', left: '10%' }, color: '#818CF8' },
                  { Icon: TrendingUp, pos: { bottom: '32%', right: '20%' }, color: '#22D3EE' },
                  { Icon: Handshake, pos: { bottom: '24%', left: '20%' }, color: '#3B82F6' },
                  { Icon: FileText, pos: { bottom: '45%', right: '12%' }, color: '#6366F1' },
                ].map(({ Icon, pos, color }, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20"
                    style={pos}
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 4,
                      delay: i * 0.25,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" style={{ color }} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12">
          {/* Logo */}
          <motion.a 
            href="/" 
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30 group-hover:bg-white/30 transition-colors">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <span className="text-2xl font-bold text-white drop-shadow-sm">Collabiko</span>
          </motion.a>

          {/* Content */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={userType}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    userType === 'influencer' 
                      ? 'bg-white/20 backdrop-blur-md border border-white/30' 
                      : 'bg-white/15 backdrop-blur-md border border-white/25'
                  }`}>
                    {userType === 'influencer' ? (
                      <Sparkles className="w-8 h-8 text-white" />
                    ) : (
                      <Building2 className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md tracking-tight">
                    {userType === 'influencer' ? 'For Creators' : 'For Brands'}
                  </h1>
                </div>
                
                <p className="text-lg md:text-xl mb-8 text-white/90 max-w-md leading-relaxed">
                  {userType === 'influencer' 
                    ? 'Join thousands of creators turning their influence into meaningful brand partnerships.'
                    : 'Connect with authentic voices to amplify your brand and reach real audiences.'
                  }
                </p>

                <div className="space-y-4">
                  {features[userType].map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 + 0.25, ease: 'easeOut' }}
                      className="flex items-center gap-4"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        userType === 'influencer' 
                          ? 'bg-white/25 backdrop-blur-sm border border-white/40' 
                          : 'bg-white/20 backdrop-blur-sm border border-white/30'
                      }`}>
                        <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-lg text-white font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stats */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={userType}
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {userType === 'influencer' ? (
                <>
                  {[
                    { value: '100K+', label: 'Creators' },
                    { value: '12.5%', label: 'Avg. Engagement' },
                    { value: '250+', label: 'Campaigns' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="rounded-2xl p-4 bg-white/15 backdrop-blur-md border border-white/25"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { value: '100K+', label: 'Clients' },
                    { value: '12.5%', label: 'Avg. ROI' },
                    { value: '250+', label: 'Projects' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="rounded-2xl p-4 bg-white/10 backdrop-blur-md border border-white/20"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/75 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div 
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* User Type Toggle - Influencer/Brand */}
          <motion.div 
            className="glass-card p-1.5 rounded-2xl mb-6 relative overflow-hidden border border-[rgb(var(--color-border-light))]"
            layout
          >
            {/* Animated Background Glow */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: userType === 'influencer' 
                  ? ['linear-gradient(90deg, rgba(0,0,255,0.4) 0%, rgba(139,92,246,0.4) 100%)', 'linear-gradient(90deg, rgba(139,92,246,0.4) 0%, rgba(236,72,153,0.4) 100%)', 'linear-gradient(90deg, rgba(0,0,255,0.4) 0%, rgba(139,92,246,0.4) 100%)']
                  : ['linear-gradient(90deg, rgba(139,92,246,0.4) 0%, rgba(236,72,153,0.4) 100%)', 'linear-gradient(90deg, rgba(236,72,153,0.4) 0%, rgba(249,115,22,0.4) 100%)', 'linear-gradient(90deg, rgba(139,92,246,0.4) 0%, rgba(236,72,153,0.4) 100%)']
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <div className="grid grid-cols-2 gap-2 relative">
              {/* Animated Slider */}
              <motion.div
                className="absolute inset-y-1.5 w-[calc(50%-4px)] rounded-xl shadow-2xl overflow-hidden"
                animate={{
                  x: userType === 'influencer' ? 6 : 'calc(100% + 2px)'
                }}
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              >
                <motion.div
                  className="w-full h-full"
                  animate={{
                    background: userType === 'influencer'
                      ? ['linear-gradient(135deg, #0000ff 0%, #8b5cf6 50%, #ec4899 100%)', 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #0000ff 100%)', 'linear-gradient(135deg, #0000ff 0%, #8b5cf6 50%, #ec4899 100%)']
                      : ['linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)', 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)', 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)']
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    boxShadow: userType === 'influencer'
                      ? ['0 0 25px rgba(0,0,255,0.6), 0 0 45px rgba(139,92,246,0.4)', '0 0 35px rgba(139,92,246,0.6), 0 0 55px rgba(236,72,153,0.4)', '0 0 25px rgba(0,0,255,0.6), 0 0 45px rgba(139,92,246,0.4)']
                      : ['0 0 25px rgba(139,92,246,0.6), 0 0 45px rgba(236,72,153,0.4)', '0 0 35px rgba(236,72,153,0.6), 0 0 55px rgba(249,115,22,0.4)', '0 0 25px rgba(139,92,246,0.6), 0 0 45px rgba(236,72,153,0.4)']
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              
              {/* Influencer Button */}
              <motion.button
                onClick={() => setUserType('influencer')}
                className={`relative z-10 py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                  userType === 'influencer' ? 'text-white' : 'text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-secondary))]'
                }`}
                whileHover={{ scale: userType === 'influencer' ? 1.02 : 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="flex items-center justify-center gap-2.5"
                  animate={userType === 'influencer' ? {
                    scale: [1, 1.05, 1],
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles 
                    className={`w-5 h-5 ${userType === 'influencer' ? 'animate-pulse' : ''}`}
                  />
                  <span>Influencer</span>
                </motion.div>
              </motion.button>
              
              {/* Brand Button */}
              <motion.button
                onClick={() => setUserType('brand')}
                className={`relative z-10 py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                  userType === 'brand' ? 'text-white' : 'text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-secondary))]'
                }`}
                whileHover={{ scale: userType === 'brand' ? 1.02 : 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="flex items-center justify-center gap-2.5"
                  animate={userType === 'brand' ? {
                    scale: [1, 1.05, 1],
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Building2 
                    className={`w-5 h-5 ${userType === 'brand' ? 'animate-pulse' : ''}`}
                  />
                  <span>Brand</span>
                </motion.div>
              </motion.button>
            </div>
          </motion.div>

          {/* Auth Mode Toggle - Login/Register */}
          <div className="text-center mb-8">
            <AnimatePresence mode="wait">
              <motion.h2 
                key={authMode}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-6"
              >
                {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
              </motion.h2>
            </AnimatePresence>
            
            {/* Vibrant Toggle Switch */}
            <motion.div 
              className="inline-flex items-center glass-card p-1.5 rounded-full shadow-lg border border-[rgb(var(--color-border-light))] relative overflow-hidden"
              layout
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    'linear-gradient(90deg, rgba(0,0,255,0.3) 0%, rgba(139,92,246,0.3) 100%)',
                    'linear-gradient(90deg, rgba(139,92,246,0.3) 0%, rgba(236,72,153,0.3) 100%)',
                    'linear-gradient(90deg, rgba(236,72,153,0.3) 0%, rgba(0,0,255,0.3) 100%)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Animated Slider */}
              <motion.div
                className="absolute top-1.5 bottom-1.5 rounded-full overflow-hidden"
                style={{
                  width: 'calc(50% - 6px)',
                }}
                animate={{
                  left: authMode === 'login' ? '6px' : 'calc(50% + 0px)'
                }}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              >
                <motion.div
                  className="w-full h-full"
                  animate={{
                    background: [
                      'linear-gradient(135deg, #0000ff 0%, #8b5cf6 50%, #ec4899 100%)',
                      'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
                      'linear-gradient(135deg, #ec4899 0%, #0000ff 50%, #8b5cf6 100%)',
                      'linear-gradient(135deg, #0000ff 0%, #8b5cf6 50%, #ec4899 100%)'
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(0,0,255,0.5), 0 0 35px rgba(139,92,246,0.3)',
                      '0 0 25px rgba(139,92,246,0.5), 0 0 40px rgba(236,72,153,0.3)',
                      '0 0 30px rgba(236,72,153,0.5), 0 0 45px rgba(0,0,255,0.3)',
                      '0 0 20px rgba(0,0,255,0.5), 0 0 35px rgba(139,92,246,0.3)'
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              
              <motion.button
                onClick={() => setAuthMode('login')}
                className={`relative z-10 px-12 py-3 rounded-full font-bold transition-all duration-300 flex-1 ${
                  authMode === 'login' ? 'text-white' : 'text-[rgb(var(--color-text-tertiary))]'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="block text-center"
                  animate={authMode === 'login' ? {
                    scale: [1, 1.05, 1],
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  Login
                </motion.span>
              </motion.button>
              
              <motion.button
                onClick={() => setAuthMode('register')}
                className={`relative z-10 px-12 py-3 rounded-full font-bold transition-all duration-300 flex-1 ${
                  authMode === 'register' ? 'text-white' : 'text-[rgb(var(--color-text-tertiary))]'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="block text-center"
                  animate={authMode === 'register' ? {
                    scale: [1, 1.05, 1],
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  Register
                </motion.span>
              </motion.button>
            </motion.div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={authMode}
                initial={{ opacity: 0, scale: 0.9, rotateX: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.1, rotateX: -20, filter: "blur(10px)" }}
                transition={{ 
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="space-y-6"
              >
                {authMode === 'register' && userType === 'brand' && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                        Full Name
                      </label>
                      <div className="relative group">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))] z-10" />
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="input-field w-full pl-12 relative z-10"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                        Brand Name
                      </label>
                      <div className="relative group">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        />
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))] z-10" />
                        <input
                          type="text"
                          value={formData.brandName}
                          onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                          className="input-field w-full pl-12 relative z-10"
                          placeholder="Your company or brand"
                          required
                        />
                      </div>
                    </motion.div>
                  </>
                )}
                {authMode === 'register' && userType === 'influencer' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="grid grid-cols-2 gap-4 overflow-hidden"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -30, rotateY: -45 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                        First Name
                      </label>
                      <div className="relative group">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))] z-10" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="input-field w-full pl-12 relative z-10"
                          placeholder="John"
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 30, rotateY: 45 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                        Last Name
                      </label>
                      <div className="relative group">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))] z-10" />
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="input-field w-full pl-12 relative z-10"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Email / Phone */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: authMode === 'register' ? 0.25 : 0.15 }}
                >
                  <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                    {authMode === 'login' ? 'Email or Phone Number' : 'Email'}
                  </label>
                  <div className="relative group">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))] z-10" />
                    <input
                      type={authMode === 'login' ? 'text' : 'email'}
                      value={authMode === 'login' ? formData.phone || formData.email : formData.email}
                      onChange={(e) => {
                        if (authMode === 'login') {
                          setFormData({ ...formData, phone: e.target.value });
                        } else {
                          setFormData({ ...formData, email: e.target.value });
                        }
                      }}
                      className="input-field w-full pl-12 relative z-10"
                      placeholder={authMode === 'login' ? 'email@example.com or +1234567890' : 'email@example.com'}
                      required
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: authMode === 'register' ? 0.3 : 0.2 }}
                >
                  <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))] z-10" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input-field w-full pl-12 pr-12 relative z-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-secondary))] transition-colors z-10"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                {/* Confirm Password */}
                {authMode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity"
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))] z-10" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="input-field w-full pl-12 pr-12 relative z-10"
                          placeholder="••••••••"
                          required={authMode === 'register'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-secondary))] transition-colors z-10"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Forgot Password */}
                {authMode === 'login' && (
                  <motion.div 
                    className="flex justify-end"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <a
                      href="/forgot-password"
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.pushState({}, '', '/forgot-password');
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }}
                      className="text-sm text-[rgb(var(--color-primary))] hover:underline"
                    >
                      Forgot password?
                    </a>
                  </motion.div>
                )}

                {/* Spacer for consistent layout */}
                <div className="h-2" />

                {(submitError || submitSuccess) && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm border ${
                      submitError
                        ? 'bg-red-500/10 text-red-600 border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    }`}
                    role={submitError ? 'alert' : 'status'}
                  >
                    {submitError ?? submitSuccess}
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl gradient-primary text-white font-bold hover:shadow-primary-glow-hover transition-all duration-200 flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: authMode === 'register' ? 0.4 : 0.25 }}
                >
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  {/* Particle effects on hover */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -30, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                    />
                  ))}
                  <span className="relative z-10">
                    {isSubmitting ? (authMode === 'login' ? 'Signing In...' : 'Creating Account...') : authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </motion.button>

                {/* Terms */}
                {authMode === 'register' && (
                  <motion.p 
                    className="text-xs text-center text-[rgb(var(--color-text-tertiary))]"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: 0.45 }}
                  >
                    By creating an account, you agree to our{' '}
                    <a href="#terms" className="text-[rgb(var(--color-primary))] hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#privacy" className="text-[rgb(var(--color-primary))] hover:underline">
                      Privacy Policy
                    </a>
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgb(var(--color-border-light))]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[rgb(var(--color-background-primary))] text-[rgb(var(--color-text-tertiary))]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <motion.div className="relative group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  type="button"
                  tabIndex={-1}
                  className="w-full py-3 px-4 rounded-xl border border-[rgb(var(--color-border-medium))] group-hover:border-[rgb(var(--color-primary))] transition-all duration-200 font-medium text-[rgb(var(--color-text-secondary))] group-hover:text-[rgb(var(--color-text-primary))] glass"
                >
                  Google
                </button>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 cursor-pointer">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setSubmitError('Google sign-in was cancelled or failed.')}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                    width={320}
                  />
                </div>
              </motion.div>
              {['Facebook', 'Apple'].map((provider) => (
                <motion.button
                  key={provider}
                  type="button"
                  disabled
                  className="py-3 px-4 rounded-xl border border-[rgb(var(--color-border-medium))] transition-all duration-200 font-medium text-[rgb(var(--color-text-tertiary))] opacity-60 cursor-not-allowed glass"
                >
                  {provider}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}