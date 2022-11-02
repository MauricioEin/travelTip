
export const mapService = {
    initMap,
    addMarker,
    panTo,
    getGmap
}


// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap)
            return gMap
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })

    // let infoWindow = new google.maps.InfoWindow({
    //     content: "Click the map to get Lat/Lng!",
    //     position: loc,
    // });

    //  // Create title field and submit button
    //  const inputForm = 'Name:  <input type="text" id="nameinput" size="31" maxlength="31" value=""/>' + '<button id="inputButton" data-id="w">Submit</button>';

    //  // Set infowindow content
    //  infoWindow.setContent(inputForm);
    //  infoWindow.open(gMap, marker);


    // saveLocation({id:'',name:'',lat:loc.lat,lng:lat.lng,weather:'', createdAt:'', updatedAt:''})

    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDWwJhW2rT_JMvzcZs4BQONHjgACK-Mfbs'
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getGmap(){
    return gMap
}