import logoImg from './icons/weather-logo-200px.png';
import logoSearch from './icons/icons8-google-web-search-64.png';

export const initWeatherBlock = (function () {
  document.body.innerHTML = `
    <header>
      <div class="logo">
        
      </div>
      <form id="weather">\
        <input
          type="text"
          id="place"
          name="place"
          pattern="([a-zA-Zа-яА-Яа-яА-Я їЇєЄ']+)"
          placeholder="Enter place"
          required
        />
        <button id="submit" type="submit">
          
        </button>
        <fieldset id="select-temperature">
          <legend>Select units:</legend>
          <div>
            <input type="radio" name="metric" id="metric" checked />
            <label for="metric">Celsius</label>
          </div>
          <div>
            <input type="radio" name="metric" id="imperial" />
            <label for="imperial">Fahrenheit</label>
          </div>
        </fieldset>
      </form>
      <p id="currentPlace" style="display: none"></p>
    </header>

    <div class="dates" style="display: none"></div>
    <div class="weather-info" style="display: none"></div>
    <div class="loader">
      <div class="spinner"></div>
      <div class="load-text">Loading weather data...</div>
    </div>`;

  let imgS = new Image(30, 30);
  let imgL = new Image(120, 120);
  imgS.src = logoSearch;
  imgL.src = logoImg;
  document.querySelector('#submit').appendChild(imgS);
  document.querySelector('.logo').appendChild(imgL);
 
    })();