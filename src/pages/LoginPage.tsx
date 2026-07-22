import { useState } from 'react';
import { Waves, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { navigate } from '@/lib/router';

export function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2.5">
            <Waves className="text-teal-400" size={36} strokeWidth={2.5} />
            <span className="text-2xl font-bold tracking-wide text-white">
              AZURE <span className="font-light text-teal-300">BAY</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-stone-400">Sign in to manage your hotel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-stone-900 p-8 shadow-2xl">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-400">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-stone-800 py-3 pl-11 pr-3 text-sm text-white outline-none transition focus:border-teal-500"
                placeholder="admin@azurebay.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-stone-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-700 bg-stone-800 py-3 pl-11 pr-3 text-sm text-white outline-none transition focus:border-teal-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-stone-950 transition hover:bg-teal-400 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-stone-500">
          <a href="#/" className="transition hover:text-teal-400">← Back to website</a>
        </p>
      </div>
    </div>
  );
}
