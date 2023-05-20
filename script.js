// constants
const errorMsg = document.querySelector(".error-msg p");
const apiKey = `67bdd90da84c496084bdf98a060d5604`;
const address = document.getElementById("address");
const submitBtn = document.getElementById("btn");
// add eventlistener on Window object
window.addEventListener("load", () => {
  // check if the Geolocation API is supported
  if (!navigator.geolocation) {
    alert(`Your browser doesn't support Geolocation.`);
  } else fetchCurrentCoordinates();
});
// get the current coordinates
function fetchCurrentCoordinates() {
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
// handle success case
function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  fetchCurrentTimeZoneByCoordinates(latitude, longitude);
}
// handle error case
function onError(err) {
  console.log(err);
  alert(`Failed to get your location!`);
}
// get your current time zone by coordinates
async function fetchCurrentTimeZoneByCoordinates(lat, long) {
  const apiURL = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&format=json&apiKey=${apiKey}`;
  const response = await fetch(apiURL);
  const data = await response.json();
  const subContainer1 = document.querySelector(".sub-container-1");
  subContainer1.innerHTML = `<h2>Your Current Time Zone:</h2>
    <p>Name Of Time Zone:  ${data.results[0].timezone.name}</p>
    <div class="lat-long">
      <p>Latitude: ${lat}</p>
      <p>Longitude: ${long}</p>
    </div>
    <p>Offset STD: ${data.results[0].timezone.offset_STD}</p>
    <p>Offset STD Seconds: ${data.results[0].timezone.offset_STD_seconds}</p>
    <p>Offset DST: ${data.results[0].timezone.offset_DST}</p>
    <p>Offset DST Seconds: ${data.results[0].timezone.offset_DST_seconds}</p>
    <p>Country: ${data.results[0].country}</p>
    <p>Postcode: ${data.results[0].postcode}</p>
    <p>City: ${data.results[0].city}</p>`;
}
// add eventlistener on submit button
submitBtn.addEventListener("click", () => fetchTimeZoneByAddress(address));
// get time zone by address
async function fetchTimeZoneByAddress(address) {
  if (address.value === "") {
    document.querySelector(".error-msg").style.display = "block";
    errorMsg.innerText = `Please enter an address!`;
    document.querySelector(".sub-container-2").style.display = "none";
  } else {
    // handle error cases using Try/Catch
    try {
      document.querySelector(".error-msg").style.display = "none";
      const apiURL = `https://api.geoapify.com/v1/geocode/search?text=${address.value}&format=json&apiKey=${apiKey}`;
      const response = await fetch(apiURL);
      const data = await response.json();
      const subContainer2 = document.querySelector(".sub-container-2");
      subContainer2.innerHTML = `<p>Name Of Time Zone: ${data.results[0].timezone.name}</p>
            <div class="lat-long">
            <p>Latitude: ${data.results[0].lat}</p>
            <p>Longitude: ${data.results[0].lon}</p>
          </div>
          <p>Offset STD: ${data.results[0].timezone.offset_STD}</p>
          <p>Offset STD Seconds: ${data.results[0].timezone.offset_STD_seconds}</p>
          <p>Offset DST: ${data.results[0].timezone.offset_DST}</p>
          <p>Offset DST Seconds: ${data.results[0].timezone.offset_DST_seconds}</p>
          <p>Country: ${data.results[0].country}</p>
          <p>Postcode: ${data.results[0].postcode}</p>
          <p>City: ${data.results[0].city}</p>`;
      document.getElementById("result-msg").style.display = "block";
      subContainer2.style.display = "flex";
    } catch (error) {
      console.log(error);
      document.querySelector(".sub-container-2").style.display = "none";
      document.querySelector(".error-msg").style.display = "block";
      errorMsg.innerText = `Time Zone could not be found!`;
    }
  }
}
