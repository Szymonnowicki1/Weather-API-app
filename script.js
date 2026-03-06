const unitsAbsolute = document.querySelector(".units-absolute")
const suggestions = document.querySelector(".suggestions")
const days = document.querySelector(".days")
const activeToogle = document.querySelectorAll(".active")
const unitsBtn = document.querySelector(".units-btn")
const weekBtn = document.querySelector(".week-btn")
const input = document.querySelector(".single-input")
const searchBtn = document.querySelector(".search-btn")
const cityAndCountry = document.querySelector(".city-country")
const dateDiv = document.querySelector(".date")
const numberTemperature = document.querySelector(".number")
const mainIcon = document.querySelector(".main-icon")
const spantemp = document.querySelector(".temp")
const feels = document.querySelector(".feels")
const columnContainer = document.querySelector(".column-container")
const hourlyIcon = document.querySelector(".hourly-icon")
const item3 = document.querySelector(".item3")
const wind = document.querySelector(".wind")
const precipitation = document.querySelector(".precipitation")
const humidity = document.querySelector(".humidity")
const celsius = document.querySelector(".celsius")
const fahrenheit = document.querySelector(".fahrenheit")
const kmh = document.querySelector(".kmh")
const mph = document.querySelector(".mph")
const switchBtn = document.querySelector(".switch")
const checkmark = document.querySelector(".checkmark")
const dayOptions = document.querySelectorAll(".day")

let currentUnit = "celsius"
let speedUnit = "kmh"
const toogleUnitsAbsolute = () => {
    unitsAbsolute.classList.toggle("active")
}

unitsBtn.addEventListener("click", toogleUnitsAbsolute)




const toogleWeekBtn = () => {
    days.classList.toggle("active")
}

weekBtn.addEventListener("click", toogleWeekBtn)



const showOptionsInput = () => {
    if (input.value.length >= 2) {
        suggestions.classList.add("active2")
        getSuggestion(input.value)
    }
    else {
        suggestions.classList.remove("active2")
        suggestions.innerHTML = ""

    }
}

const getSuggestion = (query) => {
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5`)
        .then(response => response.json())
        .then(data => {

            suggestions.innerHTML = ""
            if (!data.results) {
                return
            }

            const filteredCity = data.results.filter(city => city.name.toLowerCase().startsWith(query.toLowerCase()))

            filteredCity.forEach(city => {
                const div = document.createElement("div")
                div.classList.add("suggestion-item")
                div.textContent = `${city.name}, ${city.country}`

                div.addEventListener("click", () => {
                    input.value = city.name
                    suggestions.classList.remove("active2")
                    suggestions.innerHTML = ""
                    showInput()
                })

                suggestions.appendChild(div)
            })
        })

}

input.addEventListener("input", showOptionsInput)
input.addEventListener("focus", showOptionsInput)
input.addEventListener("blur", () => {
    setTimeout(() => {
        suggestions.classList.remove("active2")
        suggestions.innerHTML = ""
    }, 100)
})
    let globalWeatherData = null
    
const getWeatherIcon = (code) => {

    if (code === 0) {
        return "./assets/images/icon-sunny.webp"
    }
    else if (code === 1) {
        return "assets/images/icon-sunny.webp"
    }
    else if (code === 2) {
        return "assets/images/icon-partly-cloudy.webp"
    }
    else if (code === 3) {
        return "./assets/images/icon-overcast.webp"
    }
    else if (code > 3 && code <= 45) {
        return "./assets/images/icon-fog.webp"
    }
    else if (code > 45 && code <= 51) {
        return "./assets/images/icon-drizzle.webp"
    }
    else if (code > 51 && code <= 61) {
        return "./assets/images/icon-rain.webp"
    }
    else if (code > 61 && code <= 71) {
        return "./assets/images/icon-snow.webp"
    }
    else if (code > 91 && code <= 100) {
        return "./assets/images/icon-storm.webp"
    }
    return "./assets/images/icon-sunny.webp"
}
const showInput = () => {

    let inputValue = input.value

    const date = new Date();
    const options = {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    }

    const arrayDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const weekDay = date.getDay()
    const weekBtnName = arrayDays[weekDay]
    const shiftedDays = arrayDays.slice(weekDay).concat(arrayDays.slice(0,weekDay))
    const formattedDate = date.toLocaleDateString("en-US", options)


    if (inputValue != "") {
        fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}`)
            .then(response => response.json()
            .then(data => {
                    const city = data.results[0].name
                    const country = data.results[0].country
                    const latitude = data.results[0].latitude
                    const longitude = data.results[0].longitude


                    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weathercode&hourly=temperature_2m,weathercode,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,precipitation_sum,weathercode&temperature_unit=${currentUnit}&wind_speed_unit=${speedUnit}&timezone=Europe/Warsaw`)
                        .then(response => response.json()
                        .then(weatherData => {
                                const temperature = weatherData.current.temperature_2m
                                const temperatureUnit = weatherData.current_units.temperature_2m
                                const weatherCode = weatherData.current.weathercode;
                                const feelsLike = weatherData.current.apparent_temperature;
                                const times = weatherData.hourly.time
                                const hourlyWeatherCode = weatherData.hourly.weathercode
                                const hourlyTemperatures = weatherData.hourly.temperature_2m
                                const dailyTime = weatherData.daily.time
                                const dailyWeatherCode = weatherData.daily.weathercode
                                const dailyMaxTemperature = weatherData.daily.temperature_2m_max
                                const dailyMinTemperature = weatherData.daily.temperature_2m_min
                                const dailyWind = weatherData.current.wind_speed_10m
                                const dailyPrecipitation = weatherData.daily.precipitation_sum[0]
                                const currentHumidity = weatherData.current.relative_humidity_2m
                                const oUnit = temperatureUnit
                                const windUnitFromApi = weatherData.current_units.wind_speed_10m
                                globalWeatherData = weatherData


                                cityAndCountry.innerHTML = city + ", " + country
                                spantemp.innerHTML = Math.round(temperature) + oUnit
                                dateDiv.innerHTML = formattedDate
                                mainIcon.src = getWeatherIcon(weatherCode)
                                feels.innerHTML = Math.round(feelsLike) + oUnit
                                wind.textContent = Math.round(dailyWind) + " " + windUnitFromApi
                                precipitation.textContent = Math.round(dailyPrecipitation) + " mm"
                                humidity.textContent = currentHumidity + "%"
                                weekBtn.innerHTML=weekBtnName + `<img src="./assets/images/icon-dropdown.svg" alt=""/>`

                                columnContainer.innerHTML = ""

                                for (let i = 0; i < 24; i++) {
                                    const hour = times[i].split("T")[1]
                                    const temperatures = Math.round(hourlyTemperatures[i])
                                    const weatherCode = hourlyWeatherCode[i]

                                    const newDiv = document.createElement("div")
                                    newDiv.classList.add("item4-element")

                                    newDiv.innerHTML = `
                                        <div class="image-number"><img class="hourly-icon" src="${getWeatherIcon(weatherCode)}"> ${hour}</div>
                                        <div"> ${temperatures} ${oUnit}</div>
                                    `

                                    columnContainer.appendChild(newDiv)
                                }


                                item3.innerHTML = ""

                                for (let i = 0; i < 7; i++) {
                                    const date = dailyTime[i]
                                    const roundMax = Math.round(dailyMaxTemperature[i])
                                    const roundMin = Math.round(dailyMinTemperature[i])
                                    const dayTime = new Date(date).toLocaleDateString("en-US", { weekday: "short" })
                                    const dailyCode = dailyWeatherCode[i]
                                    const newDiv = document.createElement("div")
                                    newDiv.classList.add("week-square")

                                    newDiv.innerHTML = `
                                        <div class="item3-day">${dayTime}</div>
                                            <div class="item3-img">
                                                <img src="${getWeatherIcon(dailyCode)}" alt="">
                                            </div>
                                            <div class="item3-last">
                                                <div class="item3-day">${roundMax}${oUnit}</div>
                                                <div class="item3-day">${roundMin}${oUnit}</div>
                                        </div>
                                    `
                                    item3.appendChild(newDiv)
                                }

                                for(let i = 0; i < dayOptions.length; i++){
                                    dayOptions[i].textContent=shiftedDays[i]
                                }
                            }))
                }))
    }
    else {
        console.log("Brak danych");
    }
}

searchBtn.addEventListener("click", showInput)

celsius.addEventListener("click", () => {
    currentUnit = "celsius"
    celsius.classList.add("checked")
    fahrenheit.classList.remove("checked",)
    showInput()
})
fahrenheit.addEventListener("click", () => {
    currentUnit = "fahrenheit"
    celsius.classList.remove("checked")
    fahrenheit.classList.add("checked")
    showInput()
})

kmh.addEventListener("click", () => {
    speedUnit = "kmh"
    kmh.classList.add("checked")
    mph.classList.remove("checked")
    showInput()
})
mph.addEventListener("click", () => {
    speedUnit = "mph"
    mph.classList.add("checked")
    kmh.classList.remove("checked")
    showInput()
})
switchBtn.addEventListener("click", () => {
    currentUnit = "fahrenheit"
    speedUnit = "mph"
    celsius.classList.remove("checked")
    fahrenheit.classList.add("checked")
    mph.classList.add("checked")
    kmh.classList.remove("checked")
    showInput()
})

const showHourlyForDay = (selectedDate) => {

    const times = globalWeatherData.hourly.time
    const temps = globalWeatherData.hourly.temperature_2m
    const codes = globalWeatherData.hourly.weathercode
    const unit = globalWeatherData.current_units.temperature_2m

    columnContainer.innerHTML = ""

    for (let i = 0; i < times.length; i++) {

        if (times[i].startsWith(selectedDate)) {

            const hour = times[i].split("T")[1]
            const temp = Math.round(temps[i])
            const code = codes[i]

            const div = document.createElement("div")
            div.classList.add("item4-element")

            div.innerHTML = `
                <div class="image-number">
                    <img class="hourly-icon" src="${getWeatherIcon(code)}">
                    ${hour}
                </div>
                <div>${temp}${unit}</div>
            `

            columnContainer.appendChild(div)
        }
    }
}

dayOptions.forEach((day, index) => {
    day.addEventListener("click", () => {

        const selectedDate = globalWeatherData.daily.time[index]

        showHourlyForDay(selectedDate)

        weekBtn.innerHTML = day.textContent + `<img src="./assets/images/icon-dropdown.svg">`
        days.classList.add("active")
    })
})


window.addEventListener("DOMContentLoaded", () => {
    const defaultCity = "Berlin"
    input.value = defaultCity
    kmh.classList.add("checked")
    celsius.classList.add("checked")
    showInput()
})