module.exports = {
  apps: [
    {
      name: "personal-site-backend",
      script: "node",
      interpreter: "none",
      args: "index.js",
      env: {
        NODE_ENV: "development",
        HOME_URL: "http://localhost:3002",
        API_URL: "http://localhost:3001",
        NOTES_URL: "http://localhost:3003",
        RESUME_URL: "http://localhost:3004",
        PORT: 3001
      },
      env_production: {
        NODE_ENV: "production",
        HOME_URL: "https://cyamonide.me/",
        API_URL: "https://api.cyamonide.me/",
        NOTES_URL: "https://notes.cyamonide.me/",
        RESUME_URL: "https://resume.cyamonide.me/",
        PORT: 3001
      }
    }
  ]
};
