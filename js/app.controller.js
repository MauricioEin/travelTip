import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = updateLocsMenu
window.onGetUserPos = onGetUserPos
window.onUserAns = onUserAns
window.onDeleteLoc = onDeleteLoc

var infoWindow

function onInit() {
    mapService.initMap()
        .then((gMap) => {
            console.log('Map is ready')
            gMap.addListener("click", (mapsMouseEvent) => {
                checkAddMarker({ lat: mapsMouseEvent.latLng.lat(), lng: mapsMouseEvent.latLng.lng() })
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

function checkAddMarker(pos) {
    if (infoWindow) infoWindow.close()
    infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: pos,
    });

    // const id = utils.makeId()
    const inputForm =
        `Name:  <input type="text" class="info-window-input" size="31" maxlength="31" value=""/>
    <button class="add-marker-btn" onclick="onUserAns(true,${pos.lat},${pos.lng})">Submit</button>
    <button class="add-marker-btn" onclick="onUserAns(false)">cancel</button>`
    // Create title field and submit button


    infoWindow.setContent(inputForm);
    infoWindow.open(mapService.getGmap(), pos);
}

function onUserAns(isAddMarker, lat = null, lng = null) {
    if (isAddMarker) {
        const name = document.querySelector('.info-window-input').value
        mapService.addMarker(name,{lat,lng},'weather','createdAt','updatedAt')
         markerInfo = new google.maps.InfoWindow({
        content: name,
        position: {lat,lng},
    });
    }

    infoWindow.close()
    updateLocsMenu()

}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
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
    mapService.panTo(lat, lng)
    updateUrlParams(lat, lng)


}

function renderLocsOnMap(){
    
}

function renderLocs(locs) {
    console.log('locs', locs)
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
    locService.deleteLoc(id)
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