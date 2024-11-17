const db = require('../config/db');

const createWeatherTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS Weather (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pincode VARCHAR(10) NOT NULL,
      for_date DATE NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL,
      weather_data JSON NOT NULL,
      UNIQUE(pincode, for_date)
    );
  `);
};

const saveWeather = async (pincode, for_date, latitude, longitude, weather_data) => {
  await db.query(
    `INSERT INTO Weather (pincode, for_date, latitude, longitude, weather_data)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE weather_data = VALUES(weather_data);`,
    [pincode, for_date, latitude, longitude, JSON.stringify(weather_data)]
  );
};

const getWeather = async (pincode, for_date) => {
  const [rows] = await db.query(
    `SELECT * FROM Weather WHERE pincode = ? AND for_date = ?`,
    [pincode, for_date]
  );
  return rows[0];
};

module.exports = { createWeatherTable, saveWeather, getWeather };
