import data from '../data/db/fewmans.json'

for (let k of Object.keys(data.db)) {
    const fewman = data.db[k]
    const p = fewman.p
    const stars = [p[2], p[4], p[6], p[8], p[10], p[12], p[14], p[16]]
    fewman.tier = Math.max(...stars)
    fewman.stars = stars.reduce((a, x) => a + x, 0)
}

export class FewmanDB {
    static findById(id) {
        return data.db[id]
    }

    static asList() {
        return Object.values(data.db)
    }

    static rarity(fewman) {
        const rariryTable = data.stars

    }

}
