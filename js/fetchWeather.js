const apiKey = "719ef5deeb910b0ac78f8c55c6da48c7";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=${getUserLanguage()}&q=`;

const searchBox = document.querySelector("#search input");
const searchBtn = document.querySelector("#search-btn");
const settingBtn = document.querySelector("#setting-btn");
const settingIcon = document.querySelector("#setting-btn i");
const settingContainer = document.querySelector("#setting");
const weatherContainer = document.querySelector("#weather-container");
const tempUnit = document.querySelector("#temp-unit");
const searchRecord = document.querySelector("#search-record");
const searchRecordBubbleTemplate = document.querySelector("#search-record-bubble");

const key = "searchRecord";
let searchItemArray = [];
let currentWeatherData = null;

// Copyright Year
const currentYearElement = document.querySelector("#current-year");
if (currentYearElement) currentYearElement.textContent = new Date().getFullYear();

// --- ユーティリティ関数 ---

// ユーザーの言語を取得
function getUserLanguage() {
  return (navigator.language || navigator.userLanguage).split('-')[0];
}

// 国名を取得
function getCountryName(countryCode) {
  try {
    const regionNames = new Intl.DisplayNames([getUserLanguage()], { type: 'region' });
    return regionNames.of(countryCode.toUpperCase());
  } catch (error) {
    console.error("国コードの変換エラー：", error);
    return countryCode;
  }
}

// 履歴の表示
function showRecordBubble(items) {
  searchRecord.textContent = "";
  items.forEach((item) => {
    const clone = searchRecordBubbleTemplate.content.cloneNode(true);
    const bubble = clone.querySelector("div");
    clone.querySelector(".record-text").textContent = item;

    // 履歴削除
    clone.querySelector("i").addEventListener("click", (e) => {
      e.stopPropagation();
      searchItemArray = searchItemArray.filter((i) => i !== item);
      localStorage.setItem(key, JSON.stringify(searchItemArray));
      showRecordBubble(searchItemArray);
    });

    // 履歴からの再検索
    bubble.addEventListener("click", () => {
      checkWeather(item);
      searchBox.value = item;
    });

    searchRecord.appendChild(clone);
  });
}

// 履歴の追加
function addToHistory(city) {
  if (!searchItemArray.includes(city)) { // 既に存在したら追加しない
    if (searchItemArray.length >= 3) { // Max 3件
      searchItemArray.shift();
    }
    searchItemArray.push(city);
    localStorage.setItem(key, JSON.stringify(searchItemArray));
    showRecordBubble(searchItemArray);
  }
}

// 温度表示の更新
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

// 天気UIの更新
function updateWeatherUI(data) {
  document.querySelector("#error").classList.add("hidden");
  weatherContainer.classList.remove("hidden");

  const cityLink = document.querySelector("#city-link");
  cityLink.textContent = data.name;
  cityLink.setAttribute('href', `https://maps.google.com/?q=${data.coord.lat},${data.coord.lon}`);

  document.querySelector("#country-name").textContent = getCountryName(data.sys.country);
  updateTempDisplay(data);

  document.querySelector("#humidity p").textContent = data.main.humidity + "%";
  document.querySelector("#wind p").textContent = parseFloat(data.wind.speed).toFixed(1) + "m/s";

  const weatherId = data.weather[0].id;
  const iconCode = data.weather[0].icon;
  const dayNightSuffix = iconCode.endsWith('d') ? "-day.svg" : "-night.svg";

  let iconName = "clear-day.svg";
  // --- 天気アイコン判定ロジック ---
  if (weatherId >= 200 && weatherId < 300) {
    if (weatherId >= 210 && weatherId <= 221) iconName = "isolated-thunderstorms" + dayNightSuffix;
    else if ([202, 212, 232].includes(weatherId)) iconName = "severe-thunderstorm.svg";
    else iconName = "scattered-thunderstorms" + dayNightSuffix;
  } else if (weatherId >= 300 && weatherId < 400) iconName = "rainy-1" + dayNightSuffix;
  else if (weatherId >= 500 && weatherId < 600) {
    if (weatherId === 500) iconName = "rainy-1" + dayNightSuffix;
    else if (weatherId === 501) iconName = "rainy-2" + dayNightSuffix;
    else if ([502, 503, 504].includes(weatherId)) iconName = "rainy-3" + dayNightSuffix;
    else if (weatherId === 511) iconName = "rain-and-sleet-mix.svg";
    else if (weatherId === 520) iconName = "rainy-1" + dayNightSuffix;
    else if (weatherId === 521) iconName = "rainy-2" + dayNightSuffix;
    else iconName = "rainy-3" + dayNightSuffix;
  } else if (weatherId >= 600 && weatherId < 700) {
    if ([600, 620].includes(weatherId)) iconName = "snowy-1" + dayNightSuffix;
    else if ([601, 621].includes(weatherId)) iconName = "snowy-2" + dayNightSuffix;
    else if ([602, 622].includes(weatherId)) iconName = "snowy-3" + dayNightSuffix;
    else if ([611, 612, 613].includes(weatherId)) iconName = "snow-and-sleet-mix.svg";
    else if ([615, 616].includes(weatherId)) iconName = "rain-and-snow-mix.svg";
  } else if (weatherId >= 700 && weatherId < 800) {
    if (weatherId === 701) iconName = "mist.svg";
    else if (weatherId === 711) iconName = "fog.svg";
    else if (weatherId === 721) iconName = "haze" + dayNightSuffix;
    else if ([731, 751, 761, 762].includes(weatherId)) iconName = "dust.svg";
    else if (weatherId === 741) iconName = "fog" + dayNightSuffix;
    else if (weatherId === 771) iconName = "wind.svg";
    else if (weatherId === 781) iconName = "tornado.svg";
    else iconName = "fog.svg";
  } else if (weatherId === 800) iconName = "clear" + dayNightSuffix;
  else if (weatherId > 800) {
    if (weatherId === 801) iconName = "cloudy-1" + dayNightSuffix;
    else if (weatherId === 802) iconName = "cloudy-2" + dayNightSuffix;
    else if (weatherId === 803) iconName = "cloudy-3" + dayNightSuffix;
    else iconName = "cloudy.svg";
  }

  const weatherIcon = document.querySelector("#weather-icon");
  if (weatherIcon) {
    weatherIcon.src = `./img/${iconName}`;
    weatherIcon.alt = data.weather[0].description;
  }
}

// エラー表示
function showErrorMessage() {
  document.querySelector("#error").classList.remove("hidden");
  weatherContainer.classList.add("hidden");
}

// 天気検索の処理
async function checkWeather(city) {
  if (document.querySelector("#city-link").textContent === city) return;
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status !== 200) {
    showErrorMessage();
    return;
  }

  const data = await response.json();
  console.log(data);
  currentWeatherData = data;

  updateWeatherUI(data);
  addToHistory(city);
}

// --- イベントリスナー ---

if (searchBox && searchBtn && settingBtn) {
  searchBox.addEventListener("keyup", (e) => {
    if (e.keyCode === 13 && searchBox.value.length !== 0) {
      checkWeather(searchBox.value);
    }
  });

  searchBtn.addEventListener("click", () => {
    if (searchBox.value.length !== 0) {
      checkWeather(searchBox.value);
    }
  });

  settingBtn.addEventListener("click", () => {
    settingIcon.classList.add("animate-spin");
    setTimeout(() => settingIcon.classList.remove("animate-spin"), 500);

    if (settingContainer.classList.contains("hidden")) {
      settingContainer.classList.remove("hidden", "slideout");
      settingContainer.classList.add("slidein");
    } else {
      settingContainer.classList.remove("slidein");
      settingContainer.classList.add("slideout");
      settingContainer.addEventListener('animationend', function handler() {
        if (settingContainer.classList.contains("slideout")) {
          settingContainer.classList.add("hidden");
        }
        settingContainer.removeEventListener('animationend', handler);
      });
    }
  });
}

if (tempUnit) {
  tempUnit.addEventListener("change", () => {
    if (currentWeatherData) updateTempDisplay(currentWeatherData);
  });
}

// 初期化
if (localStorage.getItem(key)) {
  try {
    searchItemArray = JSON.parse(localStorage.getItem(key));
    showRecordBubble(searchItemArray);
  } catch (e) {
    searchItemArray = [];
  }
}

// 時刻更新
function updateTime() {
  const now = new Date();
  const timeString = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
  document.querySelector("#current-time").textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();