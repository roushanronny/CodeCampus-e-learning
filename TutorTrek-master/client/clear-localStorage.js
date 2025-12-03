// Run this script in browser console to clear corrupted localStorage data
// Copy and paste this entire code into browser console and press Enter

(function() {
  console.log('🧹 Clearing potentially corrupted localStorage data...');
  
  const keys = Object.keys(localStorage);
  let cleared = 0;
  
  keys.forEach(key => {
    // Check for chat-related keys that might have corrupted data
    if (key.includes('chat_') || key.includes('course_chat_') || key.includes('student_chat_') || key.includes('instructor_chat_')) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const parsed = JSON.parse(value);
          // If it's not a valid array, clear it
          if (!Array.isArray(parsed)) {
            localStorage.removeItem(key);
            cleared++;
            console.log(`✅ Cleared corrupted key: ${key}`);
          }
        }
      } catch (e) {
        // If parsing fails, clear it
        localStorage.removeItem(key);
        cleared++;
        console.log(`✅ Cleared unparseable key: ${key}`);
      }
    }
  });
  
  console.log(`✨ Cleared ${cleared} potentially corrupted localStorage entries.`);
  console.log('🔄 Please refresh the page now.');
})();

