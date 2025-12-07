const CONFIG_KEYS = {
  GOOGLE_AUTH_CLIENT_ID: process.env.REACT_APP_CLIENT_ID as string,
  STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string,
  REDIRECT_URI: process.env.REACT_APP_REDIRECT_URI as string,
  // Fallback to local backend if env var is not set (helps local development)
  // Remove trailing /api to prevent double /api/api/ in URLs
  API_BASE_URL: (() => {
    const baseUrl = (process.env.REACT_APP_API_BASE_URL && process.env.REACT_APP_API_BASE_URL.trim() !== '') 
      ? process.env.REACT_APP_API_BASE_URL.trim()
      : 'http://localhost:4000';
    // Remove trailing /api if present (endpoints already have api/ prefix)
    return baseUrl.replace(/\/api\/?$/, '');
  })(),
};
export default CONFIG_KEYS;
