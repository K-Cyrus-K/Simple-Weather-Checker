// 現在地を取得
const currentLocationBtn = document.getElementById("current-location-btn");

if (currentLocationBtn) {
  currentLocationBtn.addEventListener("click", () => {
    currentLocationBtn.querySelector("i").classList.remove("text-red-600", "fa-shake");
    currentLocationBtn.querySelector("i").classList.remove("fa-location-dot");
    currentLocationBtn.querySelector("i").classList.add("fa-spinner", "fa-spin");
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 60000,
    };

    function success(pos) {
      const crd = pos.coords;
      let latitude = crd.latitude;
      let longitude = crd.longitude;

      alert(`Lat: ${latitude}, Lon: ${longitude}`);

      getCurrentLocation(latitude, longitude);
    }

    function error(err) {
      currentLocationBtn.querySelector("i").classList.remove("fa-spinner", "fa-spin");
      currentLocationBtn.querySelector("i").classList.add("fa-triangle-exclamation", "fa-shake", "text-red-600");

      alert(`ERROR(${err.code}): ${err.message}`);
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  });

  async function getCurrentLocation(latitude, longitude) {
    const reverseLocationApiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&&appid=${apiKey}`;
    const currentLocation = await fetch(reverseLocationApiUrl);

    alert(currentLocation);
    if (currentLocation.ok) {
      const data = await currentLocation.json();
      const userLanguage = navigator.language || navigator.userLanguage; // ユーザーの言語を取得
      checkWeather(data[0].local_names[userLanguage]);
    }

    currentLocationBtn.querySelector("i").classList.remove("text-red-600", "fa-shake");
    currentLocationBtn.querySelector("i").classList.remove("fa-spinner", "fa-spin");
    currentLocationBtn.querySelector("i").classList.add("fa-location-dot");
  }
}