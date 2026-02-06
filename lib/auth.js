// Simple authentication utility
// In production, this should use proper backend authentication

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const getUsername = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('username');
};

export const logout = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('username');
};

export const requireAuth = (router) => {
  if (!isAuthenticated()) {
    router.push('/login');
    return false;
  }
  return true;
};
