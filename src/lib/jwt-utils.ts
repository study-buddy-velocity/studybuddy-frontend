export const getTokenSub = (): string | null => {
  if (typeof window === 'undefined') {
    console.error('localStorage is not available on the server');
    return null;
  }

  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error('No token found in localStorage');
    return null;
  }

  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      throw new Error('Invalid token format');
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(base64);
    const payload: { sub?: string } = JSON.parse(decodedPayload);

    return payload?.sub || null;
  } catch (error) {
    console.error('Error decoding token:', (error as Error).message);
    return null;
  }
};
