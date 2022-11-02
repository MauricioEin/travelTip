import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onUserAns = onUserAns

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
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function checkAddMarker(pos) {
    if(infoWindow) infoWindow.close()
    infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: pos,
    });

    // const id = utils.makeId()
    const inputForm =
    `Name:  <input type="text" class="info-window-input" size="31" maxlength="31" value=""/>
    <button class="add-marker-btn" onclick="onUserAns(true,${pos.lat},${pos.lng})">Submit</button>
    <button class="cancel-marker-btn" onclick="onUserAns(false)">cancel</button>`

    infoWindow.setContent(inputForm);
    infoWindow.open(mapService.getGmap(), pos);
}

function onUserAns(isAddMarker,lat =null,lng = null){
    if(isAddMarker) {
        const name = document.querySelector('.info-window-input').value
        mapService.addMarker(name,{lat,lng},'weather','createdAt','updatedAt')
    }
    
    infoWindow.close() 

}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
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
function onPanTo() {
    console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}