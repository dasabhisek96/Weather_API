Weather Information REST API
------------------------------
This project provides a RESTful API to fetch weather information for a specific day and pincode. The application uses OpenWeather APIs for weather data and geocoding and stores the information in a MySQL database to optimize future API calls.



Features
--------
Fetches weather information for a specific pincode and date.
Optimizes API calls by caching data in a MySQL database.
Stores latitude and longitude for pincodes separately in the database.
Handles edge cases like missing or invalid inputs.
Implements test-driven development (TDD) with Mocha, Chai, and Supertest.
Fully structured and modular codebase for maintainability.


Prerequisites
--------------
Node.js: Version 14 or above.
MySQL: Installed and running.
OpenWeather API Key: Get it from OpenWeather.




API Endpoints
---------------
1. GET /api/weather
Fetch weather information for a specific pincode and date.

Query Parameters:
pincode (string, required): Pincode for the location.
for_date (string, required): Date in YYYY-MM-DD format.

Example Request:
----------------
GET /api/weather?pincode=411014&for_date=2020-10-15

