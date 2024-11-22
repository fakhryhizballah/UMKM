// https://emsifa.github.io/api-wilayah-indonesia/api/regency/{regencyId}.json

const axios = require("axios");
async function getGeoid(type, id) {
    let config = {
        method: 'get',
        url: `https://emsifa.github.io/api-wilayah-indonesia/api/${type}/${id}.json`,
        headers: {}
    };

    let response = await axios.request(config);
    return response.data
}
module.exports = { getGeoid }