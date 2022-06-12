export const initWeatherBlock = (function () {
  document.body.innerHTML = `
    <header>
      <div class="logo">
        <img src="../src/icons/weather-logo-200px.png">
      </div>
      <form id="weather">\
        <input
          type="text"
          id="place"
          name="place"
          pattern="([a-zA-Zа-яА-Яа-яА-Я-\n]+)"
          placeholder="Enter place"
          required
        />
        <button id="submit" type="submit">
          <img src="../src/icons/icons8-google-web-search-64.png" />
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
    })();