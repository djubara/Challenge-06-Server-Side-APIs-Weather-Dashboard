// Dependencies: dayjs

function getForecastCard(tempH, tempL, wind, humidity, iconId, unixTimestamp) {
    const date = dayjs.unix(unixTimestamp)
    return `
    <div class="card-body">
        <h5 class="card-title w-100">${date.format('ddd')} ${date.format('DD')}</h5>

        <img src="https://openweathermap.org/img/wn/${iconId.substring(0, 2)}d@2x.png" style="width: 100px;"></img>

        <span class="d-block fs-3" style="margin-bottom: -10px;">${tempH}° / ${tempL}°</span>
        <span class="d-block fs-6 text-body-secondary">H/L</span>
        <div>Wind: ${wind} MPH</div>
        <div>Humidity: ${humidity}%</div>
    </div>`
}
// passing in the query to the search entry
function getSearchEntryButton(query) {
    const el = $('<a>')
    el.attr('href', `?search-city-name=${query}`)
    el.addClass("btn btn-sm btn-secondary w-100 mt-1")
    el.text(query)

    return el
}