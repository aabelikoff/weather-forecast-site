const apik = 'e0b35fe9d0ab118bcfc3a2cc17485106';
const curWeather = 'https://api.openweathermap.org/data/2.5/weather?q=';
const forecastWeather = 'https://api.openweathermap.org/data/2.5/forecast?q=';
const findBtn = document.querySelector('#weather button');
const placeInput = document.querySelector('#place');
const metricInput = document.querySelector('#metric');
const datesDiv = document.querySelector('div.dates');
const weatherInfo = document.querySelector('.weather-info');
const currentPlace = document.querySelector('#currentPlace');
const spinner = document.querySelector('.loader');
const radios = Array.from(document.querySelectorAll('input[name="metric"]'));
const selectTemp = document.querySelector('#select-temperature');

export {
    apik,
    curWeather,
    forecastWeather,
    findBtn,
    placeInput,
    metricInput,
    datesDiv,
    weatherInfo,
    currentPlace,
    spinner,
    radios,
    selectTemp
}