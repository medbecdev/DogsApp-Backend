const { Breed, Temperament, BreedTemperament } = require("./db");
const axios = require("axios");

const getApiData = async () => {
  const apiURL = await axios.get("https://api.thedogapi.com/v1/breeds");

  for (let breed of apiURL.data) {
    let temps = breed.temperament;
    if (typeof temps === "string") {
      temps = temps.split(",").map((t) => t.trim());
    } else {
      temps = ["Not available"];
    }

    let currentBreed = {
      name: breed.name,
      height: breed.height.metric,
      weight: breed.weight.metric,
      life_span: breed.life_span,
      image: breed.image.url,
      createdInDb: false,
    };

    const savedBreed = await Breed.findOrCreate({
      where: currentBreed,
      raw: true,
    });

    // console.log(savedBreed[0].name);

    for (let temp of temps) {
      let currentTemp = await Temperament.findOrCreate({
        where: { name: temp },
        raw: true,
      });

      // console.log(currentTemp[0].id);
      BreedTemperament.findOrCreate({
        where: { breedId: savedBreed[0].id, temperamentId: currentTemp[0].id },
      });
    }
  }
};

module.exports = { getApiData };
