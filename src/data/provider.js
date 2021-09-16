import data from '../data/db/fewmans.json'

for (let k of Object.keys(data.db)) {
    const fewman = data.db[k]
    const p = fewman.p
    const stars = [p[2], p[4], p[6], p[8], p[10], p[12], p[14], p[16]]
    fewman.tier = Math.max(...stars)
    fewman.stars = stars.reduce((a, x) => a + x, 0)
    fewman.gender = p[0]
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

    static breed(f1, f2) {
        if (f1.gender === f2.gender) {
            return null
        }

        const newP = [f1.gender]
        let tier = 0
        let stars = 0
        for (let i = 1; i <= 16; i += 2) {
            const s1 = f1.p[i + 1]
            const s2 = f2.p[i + 1]
            const a1 = f1.p[i]
            const a2 = f2.p[i]
            let newA = a1
            let newS = 0
            if (a1 === a2) {
                // same Attr
                if (s1 === 0) {
                    newS = 1
                } else {
                    newS = s1 + s2
                }
            } else {
                // different attrs
                newS = Math.max(s1, s2)
                newA = newS === s1 ? a1 : a2
            }
            tier = Math.max(tier, newS)
            stars += newS
            newP.push(...[newA, newS])
        }

        // console.log('f1', f1, 'f2', f2, 'newP =', newP )

        return {
            id: -1, p: newP, tier, stars,
            gender: Math.random() > 0.5 ? f1.gender : f2.gender
        }
    }

    static bestMatch(fewman) {
        const results = []
        const candidates = LIST.filter(f => f.gender !== fewman.gender)  // only f + m
        for (const candidate of candidates) {
            if(candidate.id !== fewman.id) {
                const result = this.breed(candidate, fewman)
                if(result) {
                    results.push({candidate, result})
                }
            }
        }
        results.sort((a, b) => b.result.stars - a.result.stars)
        return results.slice(0, 50)
    }
}
