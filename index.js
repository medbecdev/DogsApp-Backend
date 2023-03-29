const axios = require("axios");
const { Breed, Temperament, BreedTemperament } = require("./src/db");


const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const { getApiData } = require("./src/seeder");

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  getApiData();
  server.listen(3001, () => {
    console.log("%s listening at 3001"); // eslint-disable-line no-console

