import data from '../data/db/fewmans.json'
import axios from "axios";

const PRICE_API_URL = 'https://fewmans.xyz/fewpi/opensea/'

export const TRAIT_NAMES = {
    'gender': 'Gender',
    'hair': 'Hair',
    'eyes': 'Eyes',
    'body': 'Body',
    'sex': 'Sexuality',
    'intel': 'Intelligence',
    'career': 'Career',
    'curse': 'Curse',
    'gift': "God's Gift",

    't': 'Tiers',
    'stars': 'Stars'
}

export const TRAIT_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8]
const TRAIT_LOCATIONS = TRAIT_IDS.map(x => x * 2)

for (let k of Object.keys(data.db)) {
    const fewman = data.db[k]
    const p = fewman.p
    const stars = TRAIT_LOCATIONS.slice(1).map(l => p[l])
    fewman.tier = Math.max(...stars)
    fewman.stars = stars.reduce((a, x) => a + x, 0)
    fewman.gender = p[0]
}


const LIST = [...Object.values(data.db)]
export const TOTAL_FEWMANS = LIST.length

let PRICE_SORTED_LIST = LIST

function compare(x, y) {
    if(x > y) {
        return 1
    } else if(x < y) {
        return -1
    } else {
        return 0
    }
}



function prepareRarityArr(dict, setStars) {
    const rarityComparator = (a, b) => compare(-a[1], -b[1])
    const arr = Object.entries(dict)
    arr.sort(rarityComparator)
    return arr.map(([name, count], i) => ([
        name,
        count,
        100 * count / TOTAL_FEWMANS,
        setStars ? i : 0
    ]))
}

export const STAR_RARITY = prepareRarityArr(data.stars, true)
// console.log('STAR_RARITY', STAR_RARITY)
export const TIER_RARITY = prepareRarityArr(data.tiers, true)

let PRICE_DB = {
    db: {}
}

import testPriceData from './test_prices'  // todo: debug!

export function nowTS() {
    return Math.floor(Date.now() / 1000)
}

export class FewmanDB {
    static totalFewmans() {
        return TOTAL_FEWMANS
    }

    static genderRarities() {
        return prepareRarityArr(data.attr_rarity.gender)
    }

    static attrRarities(attr) {
        if(attr === 'stars') {
            return STAR_RARITY
        } else if(attr === 't') {
            return TIER_RARITY
        } else if(attr === 'gender') {
            return FewmanDB.genderRarities()
        }

        let arr = prepareRarityArr(data.attr_rarity[attr])
        arr = arr.map(
            ([name, count, p, _]) => ([name, count, p, +data.attrs[attr][name]])
        )
        return arr
    }

    static async loadPrices() {
        try {
            const r = await axios.get(PRICE_API_URL)
            PRICE_DB = r.data
        } catch(e) {
            console.error('fall back to test_prices.json' + e)
            PRICE_DB = testPriceData
        }

        const now = nowTS()
        let priceBestTS = 0.0
        let priceWorstTS = now

        for (let k of Object.keys(data.db)) {
            const fewman = data.db[k]
            fewman.priceInfo = this.getPriceInfo(k)

            if(fewman.priceInfo) {
                const lastTS = fewman.priceInfo.lastUpdateTS
                priceBestTS = Math.max(lastTS, priceBestTS)
                priceWorstTS = Math.min(lastTS, priceWorstTS)
            }
        }
        this.priceBestTS = priceBestTS
        this.priceWorstTS = priceWorstTS

        this._sortPrice()

        return PRICE_DB
    }

    static _sortPrice() {
        PRICE_SORTED_LIST = [...LIST]
        PRICE_SORTED_LIST.sort((a, b) => {
            const pa = a.priceInfo
            const pb = b.priceInfo

            if (pa && pb) {
                if(pa.buyNow && pb.buyNow) {
                    return compare(pa.price, pb.price)
                } else if(pa.buyNow) {
                    return -1
                } else if(pb.buyNow) {
                    return 1
                } else {
                    return compare(pa.price, pb.price)
                }
            } else if (pa && !pb) {
                return -1
            } else if (!pa && pb) {
                return 1
            } else {
                return compare(a.id, b.id)
            }
        })
    }

    static getPriceInfo(id) {
        return PRICE_DB.db[id]
    }

    static findById(id) {
        return data.db[id]
    }

    static asList(sorted) {
        return sorted ? PRICE_SORTED_LIST : LIST
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

    static bestMatch(fewman, maxStars) {
        maxStars = maxStars || 9999
        const results = []
        const candidates = LIST.filter(f => f.gender !== fewman.gender && f.stars <= maxStars)  // only f + m
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
