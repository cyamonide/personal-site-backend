module.exports = {
  apps : [{
    name: 'personal-site-backend',
    script: 'node',
    interpreter: 'none',
    args: 'index.js',
    env_production: {
      NODE_ENV: 'production',
      HOME_URL: 'http://cyamonide.me',
      API_URL: 'http://api.cyamonide.me',
      PORT: 3001
    }
  }]
}
