module.exports = {
  apps : [{
    name: 'personal-site-backend',
    script: 'node',
    interpreter: 'none',
    args: 'index.js',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
