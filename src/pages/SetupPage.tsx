import { useState, FormEvent } from 'react';
import { Shield, Server, Mail, Lock, User, Settings } from 'lucide-react';

interface SetupPageProps {
  onComplete: () => void;
}

export default function SetupPage({ onComplete }: SetupPageProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    siteName: 'NetForge',
    adminEmail: '',
    adminPassword: '',
    adminPasswordConfirm: '',
    adminFullName: '',
    allowSignup: true,
    sessionTimeout: 86400
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.adminPassword !== formData.adminPasswordConfirm) {
      setError('Passwords do not match');
      return;
    }

    if (formData.adminPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/setup/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName: formData.siteName,
          adminEmail: formData.adminEmail,
          adminPassword: formData.adminPassword,
          adminFullName: formData.adminFullName,
          allowSignup: formData.allowSignup,
          sessionTimeout: formData.sessionTimeout
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Installation failed');
      }

      onComplete();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-4">
            <Server className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to NetForge</h1>
          <p className="text-slate-400">Let's set up your IT infrastructure management system</p>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
          <div className="flex items-center justify-between mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {s}
                </div>
                {s < 2 && <div className={`flex-1 h-1 mx-4 ${step > s ? 'bg-blue-600' : 'bg-slate-700'}`} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Settings
                </h2>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="NetForge"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      name="allowSignup"
                      checked={formData.allowSignup}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">Allow user registration</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Session Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    name="sessionTimeout"
                    value={formData.sessionTimeout}
                    onChange={handleChange}
                    required
                    min="3600"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-slate-400">Default: 86400 seconds (24 hours)</p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Administrator Account
                </h2>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="adminFullName"
                    value={formData.adminFullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Administrator"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Password
                  </label>
                  <input
                    type="password"
                    name="adminPassword"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Min. 8 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="adminPasswordConfirm"
                    value={formData.adminPasswordConfirm}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Re-enter password"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Installing...' : 'Complete Setup'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          <p>Your data will be stored locally in a SQLite database</p>
        </div>
      </div>
    </div>
  );
}
