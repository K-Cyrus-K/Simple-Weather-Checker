const currentLocationBtn = document.getElementById("current-location-btn");

if (currentLocationBtn) {
  const icon = currentLocationBtn.querySelector("i");

  // アイコンの状態を切り替えるユーティリティ
  function setLocationIconState(state) {
    icon.classList.remove("text-red-600", "fa-shake", "fa-location-dot", "fa-spinner", "fa-spin", "fa-triangle-exclamation");

    switch (state) {
      case "loading":
        icon.classList.add("fa-spinner", "fa-spin");
        break;
      case "error":
        icon.classList.add("fa-triangle-exclamation", "fa-shake", "text-red-600");
        break;
      case "default":
      default:
        icon.classList.add("fa-location-dot");
        break;
    }
  }

  // 位置情報から都市名を取得し、天気をチェックする
  async function fetchCityAndCheckWeather(lat, lon) {
    try {
      const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("逆ジオコーディングに失敗しました");

      const data = await response.json();
      if (data.length === 0) throw new Error("場所が見つかりませんでした");

      const userLang = getUserLanguage();
      const cityName = (data[0].local_names && data[0].local_names[userLang])
        ? data[0].local_names[userLang]
        : data[0].name;

      checkWeather(cityName);
      setLocationIconState("default");
    } catch (err) {
      console.error(err);
      setLocationIconState("error");
    }
  }

  currentLocationBtn.addEventListener("click", () => {
    setLocationIconState("loading");

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchCityAndCheckWeather(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        setLocationIconState("error");
      },
      options
    );
  });
}