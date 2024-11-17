const express = require('express');
const weatherRoutes = require('./routes/weatherRoutes');
const { createWeatherTable } = require('./models/Weather');

const app = express();
require('dotenv').config();

app.use(express.json());
app.use('/api', weatherRoutes);

const PORT = process.env.PORT || 3000;

createWeatherTable().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('Failed to create table:', err));
