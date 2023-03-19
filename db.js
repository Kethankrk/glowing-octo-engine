const maria = require("mariadb");

const pool = maria.createPool({
  host: "localhost",
  user: "kethankrk",
  password: "lolans12k",
  database: "freelancing_one",
});

module.exports = pool;
