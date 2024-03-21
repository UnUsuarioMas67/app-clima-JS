const weatherIconsPath = `images\\modern_weather_icons\\weather_icons_dovora_interactive\\SVG`;
const weatherIconsMap = {
	"01d": "day_clear",
	"01n": "night_full_moon_clear",
	"02d": "day_partial_cloud",
	"02n": "night_full_moon_partial_cloud",
	"03d": "cloudy",
	"03n": "cloudy",
	"04d": "overcast",
	"04n": "overcast",
	"09d": "rain",
	"09n": "rain",
	"10d": "day_rain",
	"10n": "night_full_moon_rain",
	"11d": "thunder",
	"11n": "thunder",
	"13d": "day_snow",
	"13n": "night_full_moon_snow",
	"50d": "mist",
	"50n": "mist",
};

window.onload = showWeatherByCurrentLocation;

const currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.onclick = showWeatherByCurrentLocation;

function showWeatherByCurrentLocation() {
	if (!navigator.geolocation) return;

	navigator.geolocation.getCurrentPosition((pos) => {
		let lon = pos.coords.longitude;
		let lat = pos.coords.latitude;

		// llamada a API para obtener informacion sobre el clima
		let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=3906978a86a4df9902b2c193df046746&lang=es&units=metric`;
		getWeatherData(weatherUrl).then((weatherData) => updateWeather(weatherData));

		// llamada a API para obtener nombre de ubicacion
		let locationUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=3906978a86a4df9902b2c193df046746`;
		findLocationName(locationUrl).then((results) => updateLocation(results));
	});
}

function getWeatherData(url) {
	return fetch(url).then(
		(response) => response.json(),
		(error) => console.log(error)
	);
}

function updateWeather(weatherData) {
	let data = {
		description: weatherData.weather[0].description,
		temperature: weatherData.main.temp /* en grados Celsius */,
		humidity: weatherData.main.humidity,
		windSpeed: weatherData.wind.speed * 3.6 /* Convertido de m/s a km/h */,
		icon: weatherData.weather[0].icon,
	};

	const description = document.querySelector("#description");
	const temperature = document.querySelector("#temp");
	const humidity = document.querySelector("#humidity .amount");
	const windSpeed = document.querySelector("#wind-speed .amount");
	const icon = document.querySelector("#weather-icon");

	console.log(data);
	console.log(weatherIconsPath + "\\" + weatherIconsMap[data.icon] + ".svg");

	description.textContent = data.description;
	temperature.textContent = Math.round(data.temperature) + "°c";
	humidity.textContent = data.humidity + "%";
	windSpeed.textContent = Math.round(data.windSpeed) + " km/h";
	icon.src = weatherIconsPath + "\\" + weatherIconsMap[data.icon] + ".svg";
	icon.alt = "icono de " + data.description;
}

function findLocationName(url) {
	return fetch(url).then(
		(response) => response.json(),
		(error) => console.log(error)
	);
}

function updateLocation(results) {
	let city = "es" in results[0].local_names ? results[0].local_names.es : results[0].name;
	let country = results[0].country;

	const location = document.querySelector("#location");
	location.textContent = `${city}, ${country}`;
}
