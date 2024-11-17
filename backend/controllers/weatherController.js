const { fetchWeather } = require('../services/weatherService');

exports.getWeather = async (req, res) => {
  try {
    const { pincode, for_date } = req.query;

    if (!pincode || !for_date) {
      return res.status(400).json({ error: 'Pincode and for_date are required' });
    }

    const weather = await fetchWeather(pincode, for_date);
    res.json(weather);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};
