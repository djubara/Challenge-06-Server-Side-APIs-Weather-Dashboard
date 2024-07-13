// Creating elements with jQuery
const citySearchInputEl = $('#city-name-input')
const selectedCityNameEl = $('#selected-city-name')
const searchBtn = $('#search-button')

const todaysDateEl = $('#todays-date')
const todaysWeatherIconEl = $('.todays-weather-icon')
const todaysTempsEl = $('#todays-temps')
const todaysWindEl = $('#todays-wind')
const todaysHumidityEl = $('#todays-humidity')

const errorModal = new bootstrap.Modal('#error-modal')
const errorModalTrace = $('#error-modal-trace')
const errorModalActionSuggestion = $('#error-modal-action-suggestion')

const searchHistoryEntriesEl = $('#search-history-entries')

const forecastCardContainerEl = $('#forecast-cards-container')

// creating default city

const defaultCity = 'Edina, MN'

// creating search history buttons

const searchHistory = JSON.parse(localStorage.getItem('searchHistory'))


const urlParams = new URLSearchParams(window.location.search);
const currentSearchParam = urlParams.get('search-city-name')

// Parsing the URL search params

if (currentSearchParam !== null) {
    citySearchInputEl.val(currentSearchParam)
    selectedCityNameEl.text(currentSearchParam)
}

// Adding search history to local storage

function addSearchToHistory(query) {
    if (searchHistory && searchHistory[0] === query) return
    localStorage.setItem('searchHistory', JSON.stringify([query, ...searchHistory.slice(0, 9)]))
}


// Creating search history

function initializeSearchHistory() {
    localStorage.setItem('searchHistory', JSON.stringify([]))
}

// Adding search to history
function search(query) {
    if (searchHistory === null) initializeSearchHistory()
    addSearchToHistory(query)

    urlParams.set('search-city-name', query)
    history.replaceState(null, '', `${window.location.pathname}?${urlParams.toString()}`);
    window.location.reload()
}

// Creating search entry button
searchBtn.on('click', () => search(citySearchInputEl.val()))

function renderSearchHistory() {
    for (const currentEntry of searchHistory) {
        const component = getSearchEntryButton(currentEntry)
        searchHistoryEntriesEl.append(component)
    }
}

// add each day to the forecast card
function renderForecastCards(forecastDays) {
    let prevDay = dayjs.unix(forecastDays[0].dt)
    let dayMax = forecastDays[0].main.temp
    let dayMin = forecastDays[0].main.temp

    console.log(forecastDays)

    // loop through each day

    for (let i = 0; i < forecastDays.length; i++) {
        const currentForecastDay = forecastDays[i]

        dayMax = Math.max(dayMax, currentForecastDay.main.temp)
        dayMin = Math.min(dayMin, currentForecastDay.main.temp)

        if (prevDay.format('MM-DD-YYYY') !== dayjs.unix(currentForecastDay.dt).format('MM-DD-YYYY')) {
            const tempH = parseInt(dayMax)
            const tempL = parseInt(dayMin)
            const wind = parseInt(currentForecastDay.wind.speed)
            const humidity = currentForecastDay.main.humidity
            const iconId = currentForecastDay.weather[0].icon
            const unixTimestamp = currentForecastDay.dt

            const el = $('<div>')
            el.addClass('card')
            el.html(getForecastCard(tempH, tempL, wind, humidity, iconId, unixTimestamp))

            forecastCardContainerEl.append(el)

            dayMax = currentForecastDay.main.temp
            dayMin = currentForecastDay.main.temp
        }

        prevDay = dayjs.unix(currentForecastDay.dt)
    }
}

// get today's forecast card

function renderTodaysWeather(forecast) {
    todaysDateEl.text(dayjs().format("ddd M/D/YY"))
    todaysWeatherIconEl.attr('src', `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`)
    todaysTempsEl.text(`${parseInt(forecast.main.temp)}°`)
    todaysWindEl.text(`Wind: ${parseInt(forecast.wind.speed)} MPH`)
    todaysHumidityEl.text(`Humidity: ${parseInt(forecast.main.humidity)}%`)
}

openWeather.getCityByName(currentSearchParam).then(citySearchData => {
    openWeather.getForecast(citySearchData.lat.toFixed(2), citySearchData.lon.toFixed(2)).then(forecastData => {
        renderForecastCards(forecastData.list)
        renderTodaysWeather(forecastData.list[0])
    })

}).catch(error => {
    console.log(error)
    errorModalTrace.text(error)
    errorModalActionSuggestion.text('Please try to search for another city')
    errorModal.show()
})

renderSearchHistory()