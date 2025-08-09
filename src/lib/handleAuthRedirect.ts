export function handleAuthRedirect(status: number): boolean {
  if (status === 401 || status === 403) {
    try {
      if (typeof window !== 'undefined') {
        // Clear local/session storage
        try { localStorage.clear(); } catch {}
        try { sessionStorage.clear(); } catch {}

        // Decide where to redirect based on current path
        const path = window.location.pathname || '';
        const isAdminContext = path.startsWith('/admin');
        const target = isAdminContext ? '/admin-login' : '/intro';

        // Hard redirect to ensure a clean state
        window.location.href = target;
      }
    } catch (e) {
      // noop
    }
    return true;
  }
  return false;
}

