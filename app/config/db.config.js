module.exports = {
  HOST: "127.0.0.1",
  USER: "newuser",
  PASSWORD: "password",
  DB: "findcher",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
