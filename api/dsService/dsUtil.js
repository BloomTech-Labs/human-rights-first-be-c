const axios = require('axios')

// model imports
const incidentsModel = require('../incidents/incidentsModel')

const dsURL = process.env.DS_API_URL;

module.exports = {
    dsFetch
}

function dsFetch() {
    return axios
    .get(`${dsURL}/getdata/`)
    .then((response) => {
      response.data.forEach((element) => {
        incidentsModel.createIncident(element);
      });
    })
    .catch((err) => {
      console.log('Server Error');
    });
}