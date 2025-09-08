// Configuration for API endpoints
// For Expo Go, you need to use your computer's IP address instead of localhost

// Get your computer's IP address by running: ipconfig (Windows) or ifconfig (Mac/Linux)
// Replace the IP address below with your actual computer's IP address
const DEV_API_BASE_URL = 'http://192.168.0.169:3001'; // Your computer's IP address
const PROD_API_BASE_URL = 'http://localhost:3001';

export const API_BASE_URL = __DEV__ ? DEV_API_BASE_URL : PROD_API_BASE_URL;

// Instructions for finding your IP address:
// Windows: Open Command Prompt and run "ipconfig"
// Mac/Linux: Open Terminal and run "ifconfig" or "ip addr show"
// Look for your local network IP (usually starts with 192.168.x.x or 10.x.x.x)
