const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/app"); // Main server file
const sinon = require("sinon");
const weatherService = require("../src/services/weatherService");

chai.use(chaiHttp);
const { expect } = chai;

describe("Weather API Tests", () => {
  describe("GET /api/weather", () => {
    it("should return weather data for a valid pincode and date (cached)", async () => {
      const response = await chai.request(app)
        .get("/api/weather")
        .query({ pincode: "411014", for_date: "2020-10-15" });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("pincode", "411014");
      expect(response.body).to.have.property("for_date", "2020-10-15");
      expect(response.body).to.have.property("weatherData");
    });

    it("should fetch data from OpenWeather API for uncached data", async () => {
      // Stub the weather service API call
      const fetchWeatherStub = sinon.stub(weatherService, "fetchWeatherFromAPI").resolves({
        main: { temp: 300.15, humidity: 74 },
        weather: [{ description: "clear sky", icon: "01d" }],
      });

      const response = await chai.request(app)
        .get("/api/weather")
        .query({ pincode: "560001", for_date: "2022-12-01" });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("pincode", "560001");
      expect(response.body.weatherData.main).to.have.property("temp");
      expect(response.body.weatherData.weather[0]).to.have.property("description", "clear sky");

      fetchWeatherStub.restore();
    });

    it("should return 400 if pincode is missing", async () => {
      const response = await chai.request(app)
        .get("/api/weather")
        .query({ for_date: "2020-10-15" });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("error", "Pincode and for_date are required");
    });

    it("should return 400 if date is missing", async () => {
      const response = await chai.request(app)
        .get("/api/weather")
        .query({ pincode: "411014" });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("error", "Pincode and for_date are required");
    });

    it("should return 404 for invalid pincode", async () => {
      const response = await chai.request(app)
        .get("/api/weather")
        .query({ pincode: "999999", for_date: "2020-10-15" });

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property("error", "Invalid pincode or no weather data found for the provided date");
    });

    it("should return 400 for invalid date format", async () => {
      const response = await chai.request(app)
        .get("/api/weather")
        .query({ pincode: "411014", for_date: "15-10-2020" });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property("error", "Invalid date format. Use YYYY-MM-DD");
    });

    it("should return 500 for server errors", async () => {
      // Stub the weather service to throw an error
      const fetchWeatherStub = sinon.stub(weatherService, "fetchWeatherFromAPI").throws(new Error("Server Error"));

      const response = await chai.request(app)
        .get("/api/weather")
        .query({ pincode: "411014", for_date: "2020-10-15" });

      expect(response.status).to.equal(500);
      expect(response.body).to.have.property("error", "Failed to fetch weather data");

      fetchWeatherStub.restore();
    });
  });
});
