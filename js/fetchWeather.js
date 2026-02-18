const apiKey = "719ef5deeb910b0ac78f8c55c6da48c7";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=${getUserLanguage()}&q=`;

const searchBox = document.querySelector("#search input");
const searchBtn = document.querySelector("#search-btn");
const settingBtn = document.querySelector("#setting-btn");
const settingIcon = document.querySelector("#setting-btn i");
const settingContainer = document.querySelector("#setting");

const weatherContainer = document.querySelector("#weatherContainer");

if (searchBox && searchBtn && settingBtn) {
  searchBox.addEventListener("keyup", (e) => {
    e.preventDefault();

    // Enterキーを押されたとき
    if (e.keyCode === 13 && searchBox.value.length !== 0) {
      checkWeather(searchBox.value);
    }
  });

  searchBtn.addEventListener("click", () => {
    if (searchBox.value.length !== 0) {
      checkWeather(searchBox.value);
    }
  });

  // 設定アイコンの処理
  settingBtn.addEventListener("click", () => {
    settingIcon.classList.add("animate-spin");
    setTimeout(() => {
      settingIcon.classList.remove("animate-spin");
    }, 500);

    if (settingContainer.classList.contains("hidden")) {
      settingContainer.classList.remove("hidden");
      settingContainer.classList.remove("slideout");
      settingContainer.classList.add("slidein");
    } else {
      settingContainer.classList.remove("slidein");
      settingContainer.classList.add("slideout");
      settingContainer.addEventListener('animationend', () => {
        if (settingContainer.classList.contains("slideout")) {
          settingContainer.classList.add("hidden");
        }
      });
    }
  });
}

let currentWeatherData = null;

const tempUnit = document.querySelector("#temp-unit");
if (tempUnit) {
  tempUnit.addEventListener("change", () => {
    if (currentWeatherData) {
      updateTempDisplay(currentWeatherData);
    }
  });
}

function updateTempDisplay(data) {
  const isFahrenheit = tempUnit.checked;
  const formatTemp = (temp) => {
    const value = isFahrenheit ? (temp * 9 / 5) + 32 : temp;
    return parseFloat(value).toFixed(1) + (isFahrenheit ? "°F" : "°C");
  };

  document.querySelector("#main-temp").textContent = formatTemp(data.main.temp);
  document.querySelector("#temp-feels").textContent = `体感温度：${formatTemp(data.main.feels_like)}`;
  document.querySelector("#temp-max").textContent = `↑ 最高：${formatTemp(data.main.temp_max)}`;
  document.querySelector("#temp-min").textContent = `↓ 最低：${formatTemp(data.main.temp_min)}`;
}

// エラーメッセージの表示処理
function showErrorMessage() {
  document.querySelector("#error").classList.remove("hidden");
  document.querySelector("#weatherContainer").classList.add("hidden");
}

// 天気検索の処理
async function checkWeather(city) {
  alert(city);
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status !== 200) {
    document.querySelector("#error").classList.remove("hidden");
    document.querySelector("#weatherContainer").classList.add("hidden");
  } else {
    document.querySelector("#error").classList.add("hidden");
    document.querySelector("#weatherContainer").classList.remove("hidden");

    let data = await response.json();
    currentWeatherData = data;

    console.log(data);

    const cityLink = document.querySelector("#city-link");
    cityLink.textContent = data.name;
    cityLink.setAttribute('href', `https://maps.google.com/?q=${data.coord.lat},${data.coord.lon}`);


    function getCountryName(countryCode) {
      try {
        // Create an instance of Intl.DisplayNames for the 'region' type
        const regionNames = new Intl.DisplayNames([getUserLanguage()], { type: 'region' });
        // Use the 'of' method to get the name
        return regionNames.of(countryCode.toUpperCase()); // Use uppercase for reliability
      } catch (error) {
        console.error("Error converting country code:", error);
        return countryCode; // Fallback to the code if conversion fails
      }
    }

    const countryName = document.querySelector("#country-name");
    countryName.textContent = getCountryName(data.sys.country);

    updateTempDisplay(data);

    document.querySelector("#humidity p").textContent = data.main.humidity + "%";
    document.querySelector("#wind p").textContent =
      parseFloat(data.wind.speed).toFixed(1) + "m/s";


    // ----------------- 天気アイコンの適用 ----------------- (AI での整理)
    // OpenWeatherMap Condition Codes
    // https://openweathermap.org/weather-conditions/
    const weatherId = data.weather[0].id; // 天気IDを取得
    const iconCode = data.weather[0].icon; // 昼夜判定
    const dayNightSuffix = iconCode.endsWith('d') ? "-day.svg" : "-night.svg";

    let iconName = "clear-day.svg"; // デフォルトアイコン

    if (weatherId >= 200 && weatherId < 300) {
      // --- 2xx: Thunderstorm (雷雨) ---
      if (weatherId >= 210 && weatherId <= 221) {
        // 210-221: 雷のみ、または弱い雷雨 -> isolated (孤立した雷雲)
        iconName = "isolated-thunderstorms" + dayNightSuffix;
      } else if (weatherId === 202 || weatherId === 212 || weatherId === 232) {
        // 202, 212, 232: 激しい雷雨 -> severe
        iconName = "severe-thunderstorm.svg";
      } else {
        // その他 (200, 201, 230, 231): 普通の雷雨 -> scattered (散在する雷雲)
        iconName = "scattered-thunderstorms" + dayNightSuffix;
      }

    } else if (weatherId >= 300 && weatherId < 400) {
      // --- 3xx: Drizzle (霧雨) ---
      // アイコンパックに霧雨専用がないため、一番弱い雨(rainy-1)で代用
      iconName = "rainy-1" + dayNightSuffix;

    } else if (weatherId >= 500 && weatherId < 600) {
      // --- 5xx: Rain (雨) ---
      switch (weatherId) {
        case 500: // Light rain
          iconName = "rainy-1" + dayNightSuffix;
          break;
        case 501: // Moderate rain
          iconName = "rainy-2" + dayNightSuffix;
          break;
        case 502: // Heavy intensity rain
        case 503: // Very heavy rain
        case 504: // Extreme rain
          iconName = "rainy-3" + dayNightSuffix;
          break;
        case 511: // Freezing rain (雨氷) -> 雨とあられ/雪のミックスで表現
          iconName = "rain-and-sleet-mix.svg";
          break;
        default:
          // 520-531: Shower rain (にわか雨)
          // 強度に合わせて分岐
          if (weatherId === 520) {
            iconName = "rainy-1" + dayNightSuffix;
          } else if (weatherId === 521) {
            iconName = "rainy-2" + dayNightSuffix;
          } else {
            // 522, 531 (Heavy shower)
            iconName = "rainy-3" + dayNightSuffix;
          }
          break;
      }

    } else if (weatherId >= 600 && weatherId < 700) {
      // --- 6xx: Snow (雪) ---
      switch (weatherId) {
        case 600: // Light snow
        case 620: // Light shower snow
          iconName = "snowy-1" + dayNightSuffix;
          break;
        case 601: // Snow
        case 621: // Shower snow
          iconName = "snowy-2" + dayNightSuffix;
          break;
        case 602: // Heavy snow
        case 622: // Heavy shower snow
          iconName = "snowy-3" + dayNightSuffix;
          break;
        case 611: // Sleet (みぞれ)
        case 612: // Light shower sleet
        case 613: // Shower sleet
          iconName = "snow-and-sleet-mix.svg";
          break;
        case 615: // Light rain and snow
        case 616: // Rain and snow
          iconName = "rain-and-snow-mix.svg";
          break;
        default:
          iconName = "snowy-1" + dayNightSuffix;
      }

    } else if (weatherId >= 700 && weatherId < 800) {
      // --- 7xx: Atmosphere (大気現象) ---
      switch (weatherId) {
        case 701: // Mist
          iconName = "mist.svg";
          break;
        case 711: // Smoke
          iconName = "fog.svg"; // SmokeがないためFogで代用
          break;
        case 721: // Haze
          iconName = "haze" + dayNightSuffix;
          break;
        case 731: // Sand/dust whirls
        case 751: // Sand
        case 761: // Dust
        case 762: // Volcanic ash
          iconName = "dust.svg";
          break;
        case 741: // Fog
          iconName = "fog" + dayNightSuffix;
          break;
        case 771: // Squalls (突風)
          iconName = "wind.svg";
          break;
        case 781: // Tornado (竜巻)
          iconName = "tornado.svg";
          break;
        default:
          iconName = "fog.svg";
      }

    } else if (weatherId === 800) {
      // --- 800: Clear (快晴) ---
      iconName = "clear" + dayNightSuffix;

    } else if (weatherId > 800) {
      // --- 80x: Clouds (雲) ---
      switch (weatherId) {
        case 801: // Few clouds (11-25%)
          iconName = "cloudy-1" + dayNightSuffix;
          break;
        case 802: // Scattered clouds (25-50%)
          iconName = "cloudy-2" + dayNightSuffix;
          break;
        case 803: // Broken clouds (51-84%)
          iconName = "cloudy-3" + dayNightSuffix;
          break;
        case 804: // Overcast clouds (85-100%)
          // 完全に曇っている場合は昼夜の区別がない "cloudy.svg" を使用
          iconName = "cloudy.svg";
          break;
      }
    }

    const weatherIcon = document.querySelector("#weather-icon");
    if (weatherIcon) {
      weatherIcon.src = `./img/${iconName}`;
      weatherIcon.alt = data.weather[0].description;
    }
  }
}


// 現在時刻を取得
function getCurrentTime() {
  const now = new Date();
  const timeString = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
  document.querySelector("#current-time").textContent = timeString;
}
setInterval(getCurrentTime, 1000);
getCurrentTime();