module.exports = {
  apps: [
    {
      name: "discordbot-honyaku-jpkr",
      script: "./src/index.js",
      cwd: __dirname,
      watch: false,
      autorestart: true
    }
  ]
};
