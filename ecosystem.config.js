module.exports = {
  apps : [{
    name: 'personal-site-backend',
    script: 'node',
    interpreter: 'none',
    args: 'index.js',
    env: {
      NODE_ENV: 'development',
      HOME_URL: 'http://localhost:3000',
      API_URL: 'http://localhost:3001',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      HOME_URL: 'http://cyamonide.me',
      API_URL: 'http://api.cyamonide.me',
      PORT: 3001
    }
  }]
}
