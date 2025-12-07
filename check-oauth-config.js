// Quick script to check OAuth configuration
// Run: node check-oauth-config.js

console.log('🔍 Google OAuth Configuration Check\n');

console.log('📋 Required Environment Variables:\n');

console.log('Frontend (Vercel):');
console.log('  REACT_APP_CLIENT_ID = 868341844656-jr4d6pb4gro123nbet4d3th7cvogpbpq.apps.googleusercontent.com');
console.log('  REACT_APP_REDIRECT_URI = https://code-campus-e-learning.vercel.app');
console.log('  REACT_APP_API_BASE_URL = https://codecampus-e-learning-production.up.railway.app\n');

console.log('Backend (Railway):');
console.log('  GOOGLE_CLIENT_ID = 868341844656-jr4d6pb4gro123nbet4d3th7cvogpbpq.apps.googleusercontent.com');
console.log('  GOOGLE_CLIENT_SECRET = (from Google Console)');
console.log('  ORIGIN_PORT = https://code-campus-e-learning.vercel.app\n');

console.log('🌐 Google Cloud Console Settings:\n');

console.log('Authorized JavaScript origins:');
console.log('  ✓ https://code-campus-e-learning.vercel.app');
console.log('  ✓ http://localhost:3000\n');

console.log('Authorized redirect URIs:');
console.log('  ✓ https://code-campus-e-learning.vercel.app');
console.log('  ✓ https://code-campus-e-learning.vercel.app/login');
console.log('  ✓ https://code-campus-e-learning.vercel.app/register');
console.log('  ✓ http://localhost:3000');
console.log('  ✓ http://localhost:3000/login');
console.log('  ✓ http://localhost:3000/register\n');

console.log('✅ Checklist:\n');
console.log('  [ ] Google Console: Production URL in authorized origins');
console.log('  [ ] Google Console: Production URL in authorized redirect URIs');
console.log('  [ ] Vercel: REACT_APP_CLIENT_ID set (exact match)');
console.log('  [ ] Vercel: REACT_APP_REDIRECT_URI set (exact match)');
console.log('  [ ] Railway: GOOGLE_CLIENT_ID set (exact match)');
console.log('  [ ] Railway: GOOGLE_CLIENT_SECRET set');
console.log('  [ ] Railway: ORIGIN_PORT set');
console.log('  [ ] Vercel: Redeployed');
console.log('  [ ] Railway: Redeployed');
console.log('  [ ] Browser: Cache cleared or incognito mode\n');

console.log('🔧 If still not working:\n');
console.log('1. Verify Client ID is EXACT (no spaces, no extra characters)');
console.log('2. Verify production URL is EXACT in Google Console');
console.log('3. Save Google Console settings');
console.log('4. Redeploy Vercel');
console.log('5. Redeploy Railway');
console.log('6. Test in incognito mode\n');

