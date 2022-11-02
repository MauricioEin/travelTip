import { storageService } from './storage.service.js'


export const locService = {
    getLocs, saveLoc, deleteLoc
}

const STORAGE_KEY = 'savedLocs'

const gLocs = storageService.load(STORAGE_KEY) || _createLocs()


function getLocs() {
    console.log('gLocs:', gLocs)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs)
        }, 1000)
    })
}

function saveLoc(name, { lat, lng },id) {
    const date = new Date()
    const formatedDate = date.toLocaleDateString('fr') + ' ' + date.toLocaleTimeString('fr')

    const loc = {
        id,
        name,
        lat,
        lng,
        createdAt: formatedDate
    }

    gLocs.unshift(loc)
    saveLocsToStorage()
}

function deleteLoc(id) {
    // gLocs = gLocs.filter(loc = > loc.id !== id)
    gLocs.splice(gLocs.findIndex(loc => loc.id === id), 1)
    saveLocsToStorage()
}

function saveLocsToStorage() {
    storageService.save(STORAGE_KEY, gLocs)
}

function _createLocs() {
    return [
        { id: 1, name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
        { id: 2, name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
    ]
}