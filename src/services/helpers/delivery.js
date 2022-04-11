const axios = require('axios');

const {
  apiKeyDelivery: { apiKey, entryPoint },
} = require('../../config');

async function getCity(city) {
  try {
    const response = await axios.post(entryPoint, {
      apiKey,
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: {
        Page: '1',
        FindByString: city,
        Limit: '20',
      },
    });

    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function getPrice(req) {
  const { CitySender, CityRecipient, Weight, Cost } = req;
  try {
    const response = await axios.post(entryPoint, {
      apiKey,
      modelName: 'InternetDocument',
      calledMethod: 'getDocumentPrice',
      methodProperties: {
        CitySender,
        CityRecipient,
        Weight,
        ServiceType: 'WarehouseWarehouse',
        Cost,
        CargoType: 'Parcel',
        SeatsAmount: '1',
      },
    });

    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
}

module.exports = {
  getCity,
  getPrice,
};
