import parse from 'date-fns/parse';
import format from 'date-fns/format';
import initWeatherBlock from './initialisation';
import {
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
} from './constants';

const weather = function () {
    let weatherObjects = [];//keeps weather forecast fo 40 hours
    let curWeatherObject = null;//keeps current weather info
//fetching weather data
    async function getInfo(baseStr, place, metric) {
        let url = `${baseStr}${place}&appid=${apik}&units=`;
        url += metric ? 'metric' : 'imperial';
        try {
            
            let response = await fetch(url, { mode: "cors" });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            let object = await response.json();
            return object;
        } catch (error) {
            currentPlace.textContent = displayError(error.message);
            currentPlace.style.display = 'block';
            currentPlace.classList.add('show');
            spinner.style.display = 'none';

        }
    }
//brush up API object
    function objectProcessing(obj) {
        if (obj.dt_txt === undefined) {
            obj.dt_txt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        }
        return {
            clouds: obj.clouds.all,
            feels_like: obj.main.feels_like,
            humidity: obj.main.humidity,
            pressure: obj.main.pressure,
            temp: obj.main.temp,
            wind_deg: obj.wind.deg,
            wind_gust: obj.wind.gust,
            wind_speed: obj.wind.speed,
            description: obj.weather[0].description,
            main: obj.weather[0].main,
            icon: obj.weather[0].icon,
            id: obj.weather[0].id,
            date: splitDate(obj.dt_txt).date,
            time: splitDate(obj.dt_txt).time
        }
    }
//find min and max temperature in separate date
    function findMinMax(key,date) {
        let array = getWetherObjArrayByDate(date);
        array.sort((a, b) => {
            return a[key] - b[key];
        });
        return {
            min: array[0][key],
            max: array[array.length-1][key]
        }
    }
//returns the frequentiest icon per a day
    function findAverageIcon(date) {
        let arr = getWetherObjArrayByDate(date);
        let res = null;
        arr.reduce((count, gElem, ind, array) => {
            let lc = 0;
            array.forEach(lElem => {
                if (gElem.icon === lElem.icon) {
                    lc += 1;
                }
            });
            if (lc > count) {
                count = lc;
                res = gElem.icon;
            }
            return count;
        }, 0);
        return res;
    }
//gets weather forecast for particular date
    function getWetherObjArrayByDate(date) {
        if(weatherObjects.length) {
            return weatherObjects.reduce((arr, elem, ind) => {
                if (elem.date === date) {
                    arr.push(elem);
                }
                return arr;
            }, []);
        }
    }
//displays error connected to fetching data from API
    function displayError(str) {
        if (str === 'Not Found') {
            return 'Sorry. Place is not found';
        }
        return 'Request was not executed. Try again.'
    }
//checks input
    function checkInput() {
        if (!place.validity.valid) {
            showInputError();
            return false;
        }
        return true;
    }
//shows input errors 
    function showInputError() {
        let errStr = '';

        if (place.validity.valueMissing) {
            errStr = 'Please. Enter the place.'
        }
        else if (place.validity.patternMismatch) {
            errStr = 'Please. Enter the place in proper format.'
        }
        currentPlace.textContent = errStr;
        currentPlace.classList.add('show');
        currentPlace.style.display = 'block';
    }
//gets and shows data
    function getWeather() {
        spinner.style.display = 'block';
        currentPlace.style.display = 'none';
        currentPlace.classList.remove('show');
        datesDiv.style.display = 'none';
        weatherInfo.style.display = 'none';
        let place = placeInput.value;
        let metric = metricInput.checked;
        getInfo(curWeather, place, metric)
            .then(obj => {
                curWeatherObject = objectProcessing(obj);
            });

        getInfo(forecastWeather, place, metric)
            .then(obj => {
                let list = obj.list.map(elem => objectProcessing(elem));
                weatherObjects = list;
                let dates = createDates(list);
                createDatesDivs(dates);
                displayCurrentPlace();
                createWeatherDiv(dates[0], list)
                createTable(dates[0], list);
            });
    }
//displays in header infor about place
    function displayCurrentPlace() {
        currentPlace.textContent = '';
        currentPlace.textContent = `Weather forecast for ${placeInput.value}`;
        currentPlace.style.display = 'block';
        currentPlace.classList.add('show');
    }
//splits API date string to proper format
    function splitDate(dateStr) {
        let re = /(\d{4})-(\d{1,2})-(\d{1,2}).+(\d{2}):(\d{2}).+/;
        let d = dateStr.replace(re, "$3-$2-$1");
        let t = dateStr.replace(re, "$4:$5");
        return {
            date: d,
            time: t,
        }
    }

//Event handlers 
    findBtn.addEventListener('click', (e) => {
        if(checkInput()){
            getWeather();
        }
        e.preventDefault();
    });
    
    selectTemp.addEventListener('change', (e) => {
        if(checkInput()){
            getWeather();
        }
        e.preventDefault();
    })
//creates an array of dates
    function createDates(weatherList) {
        return weatherList.reduce((dates, obj, index) => {
            if (index === 0 ||
                dates[dates.length - 1] !== obj.date) {
                dates.push(obj.date)
            }
            return dates;
        }, []);
    }
//creates 'date blocks'
    function createDatesDivs(dates) {
        datesDiv.innerHTML = '';
        dates.forEach((elem, index) => {
            let div = document.createElement('div');
            if (!index) {
                div.classList.add('activeDate')
            }
            let a = document.createElement('a');
            a.textContent = setFullDate(elem);//!!!!
            let icon = new Image(40, 40);
            icon.src = `http://openweathermap.org/img/wn/${findAverageIcon(elem)}@2x.png`;
            a.appendChild(icon);
            let p = document.createElement('p');
            p.innerHTML = `<span class='fontBlue'>
                                min: ${findMinMax('temp', elem).min}&deg;
                            </span><br>
                            <span class='fontRed'>
                                max: ${findMinMax('temp', elem).max}&deg;
                            </span>`;
            
            a.appendChild(p);
            a.setAttribute('href', '#');
            div.appendChild(a);
            div.setAttribute('date', elem);
            datesDiv.appendChild(div);
            datesDiv.style.display = 'flex';
            div.addEventListener('click', function (e) {
                let d = this.getAttribute('date');
                createWeatherDiv(d, weatherObjects);
                createTable(d, weatherObjects);
                toggleActive(this);
            });
        })
    }
//Sets date string with a week day name
    function setFullDate(str) {
        let d = parse(str, 'dd-MM-yyyy', new Date());
        return format(d, 'do MMMM EEEE');
    }
//applies for chosen date div
    function toggleActive(dateDiv) {
        let divs = Array.from(document.querySelectorAll('.dates div'));
        divs.forEach(elem => {
            if (elem.getAttribute('class') === 'activeDate') {
                elem.removeAttribute('class');
            }
            if (elem === dateDiv) {
                dateDiv.classList.add('activeDate');
            }
        })
    }
//changes measure units
    function setUnits() {
        if (metricInput.checked) {
            return {
                temp: 'C',
                speed: 'meter/sec'
            }
        }
        return {
                temp: 'F',
                speed: 'miles/h'
            }
    }
//common block for weather info
    function createWeatherDiv(date, list) {
        weatherInfo.style.display = 'flex';
        weatherInfo.innerHTML = '';
        let lBlock = document.createElement('div');
        lBlock.classList.add('lBlock');
        weatherInfo.appendChild(lBlock);
        let infoDate = document.createElement('div');
        infoDate.classList.add('infoDate');
        infoDate.textContent = setFullDate(date);
        lBlock.appendChild(infoDate);
        lBlock.appendChild(createCurrentWeatherDiv());
        let titles = document.createElement('div');
        titles.classList.add('titles');
        let titleNames = [
            'Description: ',
            `Temperature, ${setUnits().temp}<span>&deg;</span>: `,
            `Feels like: ${setUnits().temp}<span>&deg;</span>: `,
            'Clouds, %: ',
            'Humidity, %: ',
            'Pressure, hPa: ',
            `Wind speed, ${setUnits().speed}: `,
            `Wiind gust, ${setUnits().speed}: `,
            'Wind direction, deg.:',
        ]
        titleNames.forEach((name, index) => {
            if (index) {
                let p = document.createElement('p');
                p.innerHTML = name;
                titles.appendChild(p);
            }    
        })
        weatherInfo.appendChild(titles);
    }
//block for current weather
    function createCurrentWeatherDiv() {
        let div = document.createElement('div');
        div.classList.add('curWeather');
        let header = document.createElement('p');
        header.textContent = 'Current weather';
        let time = document.createElement('p');
        time.textContent = `time: ${curWeatherObject.time}`;
        let temp = document.createElement('p');
        temp.textContent = `temperature: ${curWeatherObject.temp}`;
        let feels_like = document.createElement('p');
        feels_like.textContent = `feels like: ${curWeatherObject.feels_like}`;
        let description = document.createElement('p');
        description.textContent = `${curWeatherObject.description}`;
        let icon = new Image(100, 100);
        icon.src = `http://openweathermap.org/img/wn/${curWeatherObject.icon}@2x.png`;
        div.appendChild(header);
        div.appendChild(time);
        div.appendChild(temp);
        div.appendChild(feels_like);
        div.appendChild(icon);
        div.appendChild(description);
        return div;
    }
//forecast table
    function createTable(date, list) {
        let table = document.createElement('table');
        weatherInfo.appendChild(table);
        let newList = list.reduce((arr, elem, ind) => {
            if (elem.date === date) {
                arr.push(elem);
            }
            return arr;
        }, []);
        let time = document.createElement('tr');
        let description = document.createElement('tr');
        description.classList.add('higher');
        let temperature = document.createElement('tr');
        let feels_like = document.createElement('tr');
        let clouds = document.createElement('tr');
        let humidity = document.createElement('tr');
        let pressure = document.createElement('tr');
        let wind_speed = document.createElement('tr');
        let wind_gust = document.createElement('tr');
        let wind_direction = document.createElement('tr');
        let icon = document.createElement('tr');
        newList.forEach(obj => {
            let _time = document.createElement('td');
            _time.textContent = obj.time;
            time.appendChild(_time);
            let _description = document.createElement('td');
            _description.textContent = obj.description;
            description.appendChild(_description);
            let _temperature = document.createElement('td');
            _temperature.textContent = obj.temp;
            temperature.appendChild(_temperature);
            let _feels_like = document.createElement('td');
            _feels_like.textContent = obj.feels_like;
            feels_like.appendChild(_feels_like);
            let _clouds = document.createElement('td');
            _clouds.textContent = obj.clouds;
            clouds.appendChild(_clouds);
            let _humidity = document.createElement('td');
            _humidity.textContent = obj.humidity;
            humidity.appendChild(_humidity);
            let _pressure = document.createElement('td');
            _pressure.textContent = obj.pressure;
            pressure.appendChild(_pressure);
            let _wind_speed = document.createElement('td');
            _wind_speed.textContent = obj.wind_speed;
            wind_speed.appendChild(_wind_speed);
            let _wind_gust = document.createElement('td');
            _wind_gust.textContent = obj.wind_gust;
            wind_gust.appendChild(_wind_gust);
            let _wind_direction = document.createElement('td');
            _wind_direction.textContent = obj.wind_deg;
            wind_direction.appendChild(_wind_direction);
            let _icon = document.createElement('td');
            let pic = new Image(50, 50);
            pic.src = `http://openweathermap.org/img/wn/${obj.icon}@2x.png`;
            _icon.appendChild(pic);
            icon.appendChild(_icon);
        });
        table.appendChild(time);
        table.appendChild(icon);
        table.appendChild(description);
        table.appendChild(temperature);
        table.appendChild(feels_like);
        table.appendChild(clouds);
        table.appendChild(humidity);
        table.appendChild(pressure);
        table.appendChild(wind_speed);
        table.appendChild(wind_gust);
        table.appendChild(wind_direction);
    }
}

export default weather;
