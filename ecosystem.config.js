module.exports = {
  apps : [{
    name: "rocketmovies",
    script: "./src/server.js",
    istances: 'max',
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  },]
}