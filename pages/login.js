import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error('Please enter both username and password');
      return;
    }

    setLoading(true);

    // Simple authentication (in production, this should be server-side)
    // Default credentials: username: admin, password: admin123
    if (formData.username === 'admin' && formData.password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', formData.username);
      toast.success('Login successful! 🎉');
      router.push('/');
    } else {
      toast.error('Invalid username or password 😢');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dental-pattern flex items-center justify-center p-4" style={{ position: 'relative', zIndex: 1 }}>
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8 fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-6xl tooth-sparkle">😁</span>
            <span className="text-6xl tooth-sparkle" style={{ animationDelay: '0.5s' }}>🦷</span>
          </div>
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">Smile Tracker</h1>
          <p className="text-gray-700 text-lg font-medium">Dr. Indhu Deepika</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 rainbow-border fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">Login to Continue</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="mb-6">
              <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="username">
                Username 👤
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="mb-8">
              <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="password">
                Password 🔒
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Logging in...' : '🔑 Login'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          🔒 Secure access to patient records
        </p>
      </div>
    </div>
  );
}
