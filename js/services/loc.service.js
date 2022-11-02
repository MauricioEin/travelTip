import { storageService } from './storage.service.js'

export const locService = {
    getLocs, saveLoc, deleteLoc
}

const STORAGE_KEY = 'savedLocs'

const gLocs = storageService.load(STORAGE_KEY) || [
    { id: 1, name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { id: 2, name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
] 

function getLocs() {
    console.log('gLocs:',gLocs)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs)
        }, 1000)
    })
}

function saveLoc(loc) {
    gLocs.unshift(loc)
    saveLocsToStorage()
}

function deleteLoc(id) {
    gLocs.splice(gLocs.findIndex(loc => loc.id === id), 1)
    saveLocsToStorage()
}

function saveLocsToStorage() {
    storageService.save(STORAGE_KEY, gLocs)
}


