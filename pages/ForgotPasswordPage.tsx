import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { forgotPassword } from '../src/api/auth';
import { ApiError } from '../src/api/http';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!email.trim()) {
      setSubmitError('Please enter your email address.');
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await forgotPassword({ email: email.trim() });
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : err instanceof Error ? err.message : 'Request failed.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToAuth = () => {
    window.history.pushState({}, '', '/auth');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[rgb(var(--color-background-primary))]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 blur-3xl"
        />
      </div>

      <div className="w-full flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div
          className="w-full max-w-md glass-card rounded-2xl p-8 lg:p-10 border border-[rgb(var(--color-border-light))] shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <motion.a
              href="/auth"
              onClick={(e) => {
                e.preventDefault();
                navigateToAuth();
              }}
              className="inline-flex items-center gap-2 text-sm text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-primary))] transition-colors mb-6"
              whileHover={{ x: -4 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </motion.a>
            <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))]">
              Forgot password?
            </h1>
            <p className="mt-2 text-[rgb(var(--color-text-secondary))]">
              {submitSuccess
                ? "We've sent you an email with a link to reset your password."
                : "Enter your email and we'll send you a reset link."}
            </p>
          </div>

          {submitSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-[rgb(var(--color-text-secondary))] mb-6">
                Check your inbox for <strong>{email}</strong>. If you don't see it, check your spam folder.
              </p>
              <motion.button
                onClick={navigateToAuth}
                className="text-[rgb(var(--color-primary))] font-medium hover:underline inline-flex items-center gap-2"
                whileHover={{ x: 4 }}
              >
                Return to sign in
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-tertiary))]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full pl-12"
                    placeholder="email@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {submitError && (
                <div
                  className="rounded-xl px-4 py-3 text-sm border bg-red-500/10 text-red-600 border-red-500/20"
                  role="alert"
                >
                  {submitError}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl gradient-primary text-white font-bold hover:shadow-primary-glow-hover transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Sending...' : 'Send reset link'}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
