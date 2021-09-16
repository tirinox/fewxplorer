import data from '../data/db/fewmans.json'

for (let k of Object.keys(data.db)) {
    const fewman = data.db[k]
    const p = fewman.p
    const stars = [p[2], p[4], p[6], p[8], p[10], p[12], p[14], p[16]]
    fewman.tier = Math.max(...stars)
    fewman.stars = stars.reduce((a, x) => a + x, 0)
}

const LIST = Object.values(data.db)

export class FewmanDB {
    static findById(id) {
        return data.db[id]
    }

    static asList() {
        return LIST
    }

    static rarityByStar(fewman) {
        const rarityTable = data.stars
        const r = rarityTable[fewman.stars] || 0.0
        return r / LIST.length * 100.0
    }
}
