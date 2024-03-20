window.onload = () => {
	showWeatherByCurrentLocation();
};

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
		temperature: weatherData.main.temp, /* en grados Celsius */
		humidity: weatherData.main.humidity,
		windSpeed: weatherData.wind.speed * 3.6, /* Convertido de m/s a km/h */
	};

	const description = document.querySelector("#description");
	const temperature = document.querySelector("#temp");
	const humidity = document.querySelector("#humidity .amount");
	const windSpeed = document.querySelector("#wind-speed .amount");

	console.log(data);

	description.textContent = data.description;
	temperature.textContent = Math.round(data.temperature) + "°c";
	humidity.textContent = data.humidity + "%";
	windSpeed.textContent = Math.round(data.windSpeed) + " km/h";
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
