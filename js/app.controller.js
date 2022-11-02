import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLoc = onDeleteLoc
window.onMyLoc = onMyLoc

function onInit() {
    mapService.initMap()
        .then((gMap) => {
            console.log('Map is ready')
            gMap.addListener("click", (mapsMouseEvent) => {
                checkAddMarker({ lat: mapsMouseEvent.latLng.lat(), lng: mapsMouseEvent.latLng.lng() })
            })

        })
        .catch(() => console.log('Error: cannot init map'))
    onGetLocs()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function checkAddMarker(pos) {


    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: pos,
    });

    // Create title field and submit button
    const inputForm = 
    `Name:  <input type="text" id="nameinput" size="31" maxlength="31" value=""/>
    <button class="add-marker-btn" onclick="onUserAns(true)">Submit</button>
    <button class="cancel-marker-btn" onclick="onUserAns(false)">cancel</button>`

    // Set infowindow content
    infoWindow.setContent(inputForm);
    infoWindow.open(mapService.getGmap(), pos);
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 }).title("Marker")
}

function onGetLocs() {
    locService.getLocs()
        .then(renderLocs)
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat = 35.6895, lng = 139.6917) {
    console.log('Panning the Map')
    mapService.panTo(lat, lng)
}

function onMyLoc() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            mapService.panTo(position.coords.latitude, position.coords.longitude)
        })
    }
}


function renderLocs(locs) {
    console.log('locs', locs)
    const strHTMLs = locs.map(loc => `
<article class="loc" data-id="${loc.id}">
<h3 class="loc-name">${loc.name}</h3>
<p class="coords">(${loc.lat},${loc.lng})</p>
<div class="weather"></div>
<p class="updated">updated at ${loc.updatedAt || loc.createdAt}</p>
<button onclick="onGoToLoc('${loc.id}')">Go</button>
<button onclick="onDeleteLoc('${loc.id}')">Delete</button>
</article>
`)
    document.querySelector('.locs').innerHTML = strHTMLs.join('')
}

function onDeleteLoc(id) {
    console.log('deleting', id)
    locService.deleteLoc(id)
    locService.getLocs()
        .then(renderLocs)
}