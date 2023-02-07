const axios = require("axios");
const { Breed, Temperament, BreedTemperament } = require("./src/db");

const getApiData = async () => {
  const apiURL = await axios.get("https://api.thedogapi.com/v1/breeds");

  // console.log(
  //   apiURL.data[0].temperament
  //     .toString()
  //     .split(",")
  //     .map((t) => t.trim())
  // );

  // const apiData = await apiURL.data.map((i) => ({
  //   name: i.name,
  //   height: i.height.metric,
  //   weight: i.weight.metric,
  //   life_span: i.life_span,
  //   image: i.image.url,
  //   temperament: i.temperament,
  // }));
  // console.log(apiData[0]);

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

//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require("./src/app.js");
const { conn } = require("./src/db.js");
require("dotenv").config();
const PORT = process.env.PORT || 4000;
// Syncing all the models at once.
conn
  .sync({ force: true })
  .then(() => getApiData())
  .then(() => {
    server.listen(PORT, () => {
      console.log(PORT); // eslint-disable-line no-console
    });
  });
