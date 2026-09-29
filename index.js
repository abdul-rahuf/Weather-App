const themeBtn = document.getElementById("themeBtn")

themeBtn.addEventListener("click", function() {
    document.body.classList.toggle("darkmode")

if(document.body.classList.contains("darkmode")){
    themeBtn.textContent = "☀️ Light"
}else {
    themeBtn.textContent = "🌙 Dark"
}
})

const cityInput = document.getElementById("cityInput")
const searchBtn = document.getElementById("searchBtn")
const errormessage = document.querySelector(".errormessage")
const weatherdisplay = document.querySelector(".weatherdisplay")
const favoritelist = document.querySelector(".favoritelist")




const API_KEY = '554eddb17fd591355fe9fbb734be146e'

async function getweather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url)

    if(!response.ok){
        if(response.status === 404){
            throw new Error("city not found")
        }
        throw new Error("Unable to fetch weather")
    }

    const data = await response.json();
console.log(data)
    return {
        city : data.name,
        temp : Math.round(data.main.temp),
        feelslike : Math.round(data.main.feels_like),
        description : data.weather[0].description,
        humidity : data.main.humidity,
        windspeed : data.wind.speed
    };
}

async function searchweather(city){

    city = city.trim();

    if(!city){
        weatherdisplay.style.display = "none";
        showError(
            "please enter a city name..."
        );
        return;
    }
    showError("")

    try{
        const weather = await getweather(city)


        displayweather(weather)
    }
    catch( error){
        console.error(error);
        weatherdisplay.style.display = "none";

        showError(error.message)

    }
}
function showError(message){

    errormessage.textContent = message;

    errormessage.style.display =
        message ? "flex" : "none";

}
function displayweather(weather){
    weatherdisplay.style.display = "block";
            weatherdisplay.innerHTML = `

                <div class="weather-top">

                    <div>

                        <div class="cityname">
                            ${weather.city}
                        </div>

                        <div class="temperature">
                            ${weather.temp}°C
                        </div>

                        <p class="description">
                            ${weather.description}
                        </p>

                    </div>

                </div>


                <div class="weather-details">

                    <div class="detail">

                        <strong>
                            💧 Humidity
                        </strong>

                        <p>
                            ${weather.humidity}%
                        </p>

                    </div>


                    <div class="detail">

                        <strong>
                            💨 Wind Speed
                        </strong>

                        <p>
                            ${weather.windspeed} m/s
                        </p>

                    </div>


                    <div class="detail">

                        <strong>
                            🌡️ Feels Like
                        </strong>

                        <p>
                            ${weather.feelslike}°C
                        </p>

                    </div>

                </div>
                <div>

                    <br>

                    <button
                        class="favorite-btn"
                        onclick="addfavorite('${weather.city}')"
                    >
                        ⭐ Add Favorite
                    </button>

                </div>

            `;
}


function addfavorite(city){
    let favorite = JSON.parse(localStorage.getItem("favorite")) || [];

    favorite.push(city);

    localStorage.setItem("favorite",JSON.stringify(favorite));

    loadfavorite()
}



function loadfavorite(){
    const favorite = JSON.parse(localStorage.getItem("favorite")) || [];

    favoritelist.innerHTML = "";

    favorite.forEach(city => {

        const item =
            document.createElement("div");


        item.className =
            "favorite-item";


        item.innerHTML = `

            <span
                class="favorite-city"
                onclick="searchweather('${city}')"
            >
                 ${city}
            </span>


            <button
                class="remove-btn"
                onclick="removefavorite('${city}')"
            >
                ✕
            </button>

        `;


        favoritelist.appendChild(item);

    }); 
}

function removefavorite(city) {

    let favorite =
        JSON.parse(
            localStorage.getItem("favorite")
        ) || [];


    favorite =
        favorite.filter(
            favorite =>
                favorite.toLowerCase() !==
                city.toLowerCase()
        );


    localStorage.setItem(
        "favorite",
        JSON.stringify(favorite)
    );


    loadfavorite();

}
searchBtn.addEventListener(
    "click",
    function () {

        searchweather(
            cityInput.value
        );

    }
);


cityInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchweather(
                cityInput.value
            );

        }

    }
);

loadfavorite();


window.searchweather =
    searchweather;


window.addfavorite =
    addfavorite;


window.removefavorite =
    removefavorite;