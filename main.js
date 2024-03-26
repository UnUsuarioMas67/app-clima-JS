const weatherIconsPath = `images\\modern_weather_icons\\weather_icons_dovora_interactive\\SVG`;
const weatherIconsMap = {
	'01d': 'day_clear',
	'01n': 'night_full_moon_clear',
	'02d': 'day_partial_cloud',
	'02n': 'night_full_moon_partial_cloud',
	'03d': 'cloudy',
	'03n': 'cloudy',
	'04d': 'overcast',
	'04n': 'overcast',
	'09d': 'rain',
	'09n': 'rain',
	'10d': 'day_rain',
	'10n': 'night_full_moon_rain',
	'11d': 'thunder',
	'11n': 'thunder',
	'13d': 'day_snow',
	'13n': 'night_full_moon_snow',
	'50d': 'mist',
	'50n': 'mist',
};

// referencias a elementos HTML
const locationName = document.querySelector('#location');
const description = document.querySelector('#description');
const temperature = document.querySelector('#temp .temp-value');
const humidity = document.querySelector('#humidity .amount');
const windSpeed = document.querySelector('#wind-speed .amount');
const icon = document.querySelector('#weather-icon');

const currentLocationButton = document.querySelector('#current-location-button');
currentLocationButton.onclick = showWeatherByCurrentLocation;

const searchBar = document.querySelector('#search-bar');
const searchButton = document.querySelector('#search-button');
searchButton.onclick = () => showWeatherBySearch(searchBar.value);

window.onload = showWeatherByCurrentLocation;

function unsetValues() {
	locationName.textContent = '--';
	description.textContent = '--';
	temperature.textContent = '--';
	humidity.textContent = '0%';
	windSpeed.textContent = '0 km/h';
}

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
		findLocationName(locationUrl).then((results) => updateLocation(results[0]));
	});
}

function showWeatherBySearch(textInput) {
	if (textInput === '') return;

	searchUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${textInput}&limit=5&appid=3906978a86a4df9902b2c193df046746`;
	fetch(searchUrl)
		.then(
			(response) => response.json(),
			(error) => console.log(error)
		)
		.then((results) => {
			console.log(results, results.length);
			if (results.length == 0) return;

			// tomar las coordenadas del primer resultado
			let lon = results[0].lon;
			let lat = results[0].lat;

			// llamada a API para obtener informacion sobre el clima
			let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=3906978a86a4df9902b2c193df046746&lang=es&units=metric`;
			getWeatherData(weatherUrl).then((weatherData) => updateWeather(weatherData));

			// actualizar el nombre de la ubicación
			updateLocation(results[0]);
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

	console.log(data);
	console.log(weatherIconsPath + '\\' + weatherIconsMap[data.icon] + '.svg');

	description.textContent = data.description;
	temperature.textContent = Math.round(data.temperature);
	humidity.textContent = data.humidity + '%';
	windSpeed.textContent = Math.round(data.windSpeed) + ' km/h';
	icon.src = weatherIconsPath + '\\' + weatherIconsMap[data.icon] + '.svg';
	icon.alt = 'icono de ' + data.description;
}

function findLocationName(url) {
	return fetch(url).then(
		(response) => response.json(),
		(error) => console.log(error)
	);
}

function updateLocation(locationData) {
	let city = 'es' in locationData.local_names ? locationData.local_names.es : locationData.name;
	let country = locationData.country;

	locationName.textContent = `${city}, ${country}`;
}
