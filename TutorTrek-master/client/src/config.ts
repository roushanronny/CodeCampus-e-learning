const CONFIG_KEYS = {
  GOOGLE_AUTH_CLIENT_ID: process.env.REACT_APP_CLIENT_ID as string,
  STRIPE_PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string,
  REDIRECT_URI: process.env.REACT_APP_REDIRECT_URI as string,
  // Fallback to local backend if env var is not set (helps local development)
  API_BASE_URL:
    (process.env.REACT_APP_API_BASE_URL && process.env.REACT_APP_API_BASE_URL.trim() !== '') 
      ? process.env.REACT_APP_API_BASE_URL 
      : 'http://localhost:4000',
};
export default CONFIG_KEYS;
