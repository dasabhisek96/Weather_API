const axios = require('axios');
const { saveWeather, getWeather } = require('../models/Weather');

const getLatLongFromPincode = async (pincode) => {
  const response = await axios.get(`http://api.openweathermap.org/geo/1.0/zip`, {
    params: { zip: `${pincode},IN`, appid: process.env.OPENWEATHER_API_KEY },
  });
  return response.data;
};

const getWeatherFromLatLong = async (lat, lon) => {
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
    params: { lat, lon, appid: process.env.OPENWEATHER_API_KEY },
  });
  return response.data;
};

const fetchWeather = async (pincode, for_date) => {
  const cachedWeather = await getWeather(pincode, for_date);

  if (cachedWeather) return cachedWeather;

  const { lat, lon } = await getLatLongFromPincode(pincode);
  const weatherData = await getWeatherFromLatLong(lat, lon);

  await saveWeather(pincode, for_date, lat, lon, weatherData);

  return { pincode, for_date, lat, lon, weatherData };
};

module.exports = { fetchWeather };
