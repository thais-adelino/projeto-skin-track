const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return 'localhost';
}

const ip = getLocalIP();
console.log(`\n🌐 Your computer's IP address is: ${ip}`);
console.log(`📱 Update constants/Config.ts with this IP address:`);
console.log(`   const DEV_API_BASE_URL = 'http://${ip}:3001';\n`);
