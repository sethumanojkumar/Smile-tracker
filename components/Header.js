import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getUsername, logout } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function Header() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUsername(getUsername());
  }, []);

  const addNewPatient = () => {
    router.push('/patient/add');
  };

  const goHome = () => {
    router.push('/');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully! 👋');
    router.push('/login');
  };

  return (
    <header className="bg-white border-b-4 border-indigo-300 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo/Brand */}
          <button
            onClick={goHome}
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-3xl sm:text-4xl tooth-sparkle">😁</span>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-900">
                List of kids
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">
                Treated by Dr. Indhu Deepika
              </p>
            </div>
          </button>

          {/* Right Side - Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Username Display */}
            {username && (
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
                <span className="text-lg">👤</span>
                <span className="text-sm font-semibold text-indigo-900">{username}</span>
              </div>
            )}

            {/* Add Patient Button */}
            <button
              onClick={addNewPatient}
              className="btn-primary bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2 px-3 sm:py-3 sm:px-6 lg:py-3 lg:px-8 rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-xs sm:text-base lg:text-lg whitespace-nowrap"
            >
              <span className="hidden sm:inline">➕ Add Patient</span>
              <span className="sm:hidden">➕</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-3 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-xs sm:text-base whitespace-nowrap"
              title="Logout"
            >
              <span className="hidden sm:inline">🚪 Logout</span>
              <span className="sm:hidden">🚪</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
