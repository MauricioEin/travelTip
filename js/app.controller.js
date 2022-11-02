import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { utils } from './services/util.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = updateLocsMenu
window.onGetUserPos = onGetUserPos
window.onAddLocation = onAddLocation
window.onDeleteLoc = onDeleteLoc

var gInfoWindow
var gMarkers

function onInit() {
    mapService.initMap()
        .then((gMap) => {
            console.log('Map is ready')
            renderMarkers(gMap)
            gMap.addListener("click", ({ latLng }) => {
                onAddMarker({ lat: latLng.lat(), lng: latLng.lng() })
            })

        })
        .catch(() => console.log('Error: cannot init map'))
    updateLocsMenu()
    panByUrlParams()
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker(pos) {
    getWeather(pos).then(res => {
        if (gInfoWindow) gInfoWindow.close()

        const inputForm =
            `
            <div style="display:flex;flex-direction:column;align-items:center;">
                <img src="https://openweathermap.org/img/w/${res.weather[0].icon}.png" style="width:65px;height:65px;"></img>
                <h2>${res.weather[0].description}</h2>
                <h2>${(res.main.temp - 273.15).toFixed(1)}℃</h2>
                <span>Name:</span>  <input type="text" class="info-window-input" size="31" maxlength="31" value=""/>
                <div>
                    <button class="add-marker-btn" onclick="onAddLocation(${pos.lat},${pos.lng})">Submit</button>
                    <button class="add-marker-btn" onclick="closeInfoWindow()">cancel</button>
                </div>               
            </div>`

        gInfoWindow = new google.maps.InfoWindow({
            content: inputForm,
            position: pos,
        });

        gInfoWindow.setContent(inputForm);
        gInfoWindow.open(mapService.getMap(), pos);
    })
}

function onAddLocation(lat, lng) {
    const name = document.querySelector('.info-window-input').value
    const id = utils.makeId()
    gMarkers.push(mapService.addMarker(name, { lat, lng }, id))
    locService.saveLoc(name, { lat, lng }, id)

    // addInfoWindow(name, lat, lng)

    closeInfoWindow()
    locService.getLocs()
        .then(renderLocs)

}

function addInfoWindow(name, lat, lng) {
    let markerInfo = new google.maps.InfoWindow({
        content: name,
        position: { lat, lng },
    });
    markerInfo.open(mapService.getMap(), { lat, lng })
    infoWindow.close()
    updateLocsMenu()

}

function closeInfoWindow() {
    gInfoWindow.close()

}

function updateLocsMenu() {
    locService.getLocs()
        .then(renderLocs)
}

function onGetUserPos() {
    getPosition()
        .then(({ coords }) => {
            console.log('User position is:', coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${coords.latitude} - Longitude: ${coords.longitude}`
            onPanTo(coords.latitude, coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat = 35.6895, lng = 139.6917) {
    console.log('Panning the Map')
    // mapService.panTo(35.6895, 139.6917)
    mapService.panTo(lat, lng)
    updateUrlParams(lat, lng)


}

function renderLocs(locs) {
    // console.log('locs', locs)
    const strHTMLs = locs.map(loc => `
    <article class="loc" data-id="${loc.id}">
        <h3 class="loc-name">${loc.name}</h3>
        <p class="coords">(${loc.lat},${loc.lng})</p>
        <div class="weather"></div>
        <p class="updated">updated at ${loc.updatedAt || loc.createdAt}</p>
        <button onclick="onPanTo(${loc.lat},${loc.lng})">Go</button>
        <button onclick="onDeleteLoc('${loc.id}')">Delete</button>
    </article>
`)
    document.querySelector('.locs').innerHTML = strHTMLs.join('')
}

function onDeleteLoc(id) {
    console.log('deleting', id)
    deleteMarker(id)
    locService.deleteLoc(id)
    locService.getLocs()
        .then(renderLocs)
}

function deleteMarker(id) {
    console.log(id);
    console.log(gMarkers);
    gMarkers.find((marker) => marker.id === id).setMap(null)
}

function renderMarkers(map = mapService.getMap()) {
    locService.getLocs().then(locs => {
        gMarkers = locs.map((loc) => {
            // addInfoWindow(loc.name, loc.lat, loc.lng)
            return new google.maps.Marker({
                id: loc.id,
                position: { lat: loc.lat, lng: loc.lng },
                map,
                title: loc.name
            })
        })
    })
}


function getWeather({ lat, lng }) {
    const API_KEY = '9cc0e7fc796283a38fee03bf115264d5'
    const LINK = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${API_KEY}`
    return axios.get(LINK).then(res => res.data)
    updateLocsMenu()
}

function panByUrlParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const lat = queryStringParams.get('lat')
    const lng = queryStringParams.get('lng')
    if (!lat || !lng) return
    onPanTo(lat, lng)
}

function updateUrlParams(lat, lng) {
    const queryStr = `?lat=${lat}&lng=${lng}`
    const newUrl = window.location.protocol + "//" + window.location.host
        + window.location.pathname + queryStr
    window.history.pushState({ path: newUrl }, '', newUrl)


}