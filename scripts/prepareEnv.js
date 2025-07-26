const fs = require('fs');
const path = require('path');

const services = ['backend', 'frontend', 'bot-service'];

services.forEach(dir => {
  const envPath = path.join(__dirname, '..', dir, '.env');
  const examplePath = path.join(__dirname, '..', dir, '.env.example');

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(examplePath)) {
      fs.copyFileSync(examplePath, envPath);
      console.log(`✅ Created ${dir}/.env from .env.example`);
    } else {
      console.warn(`⚠️ Missing ${dir}/.env.example — skipping`);
    }
  } else {
    console.log(`ℹ️ ${dir}/.env already exists — skipping`);
  }
});
