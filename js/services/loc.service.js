import { storageService } from './storage.service.js'

export const locService = {
    getLocs, saveLoc
}

const STORAGE_KEY = 'savedLocs'

const gLocs = storageService.load(STORAGE_KEY) || []
const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function saveLoc(loc) {
    gLocs.unshift(loc)
    saveLocsToStorage()
}

function saveLocsToStorage() {
    storageService.save(STORAGE_KEY, gLocs)
}

