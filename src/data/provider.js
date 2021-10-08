import axios from "axios";
import {compare, nowTS} from "../helpers/util.js";
import {decodePersonality} from "./personality";

const PRICE_API_URL = 'https://fewmans.xyz/fewpi/opensea/'
const TOKEN_ID_API_URL = 'https://fewmans.xyz/fewpi/tokenids/'
const UPDATE_TIME_SECONDS = 30

export const COUNTER_STARS = '_stars'
export const COUNTER_TIER = '_tier'
export const COUNTER_GENDER = '_gender'


export class FewmanDBv2 {
    constructor() {
        this.lastTimeLoaded = 0

        this._idToFewman = {}
        this._tokensAsList = []
        this._tokensAsListSortedByPrice = []
        this._counters = {}

        this._priceDB = {}
        this.priceBestTS = 0
        this.priceWorstTS = 0

        this.tokenIdLastTS = 0
    }

    get totalFewmans() {
        return this._tokensAsList.length
    }

    findById(id) {
        return this._idToFewman[id]
    }

    getPriceInfo(id) {
        return this._priceDB[id]
    }

    get tokens() {
        return this._tokensAsList
    }

    get tokensPriceSorted() {
        return this._tokensAsListSortedByPrice
    }

    rarityByStar(fewman) {
        return this._countToPercent(this._counters[COUNTER_STARS][fewman.stars])
    }

    rarityByGender(fewman) {
        return this._countToPercent(this._counters[COUNTER_GENDER][fewman.gender])
    }

    _countToPercent(n) {
        return (n ?? 0) / this.totalFewmans * 100.0
    }

    async updateIfNeeded() {
        // if (nowTS() - this.lastTimeLoaded > UPDATE_TIME_SECONDS) {
        //     await this._loadAll()
        //     this.lastTimeLoaded = nowTS()
        // }
        // return true  // fixme: debug

        try {
            if (!this._tokensAsList.length || nowTS() - this.lastTimeLoaded > UPDATE_TIME_SECONDS) {
                await this._loadAll()
                this.lastTimeLoaded = nowTS()
            }
            return true
        } catch (e) {
            return false
        }
    }

    bestMatch(fewman, maxStars) {
        maxStars = maxStars || 9999

        const results = []
        const candidates = this.tokens.filter(f => f.gender !== fewman.gender && f.stars <= maxStars)  // only f + m
        for (const candidate of candidates) {
            if (candidate.id !== fewman.id) {
                const result = this.breed(candidate, fewman)
                if (result) {
                    results.push({candidate, result})
                }
            }
        }
        results.sort((a, b) => b.result.stars - a.result.stars)
        return results.slice(0, 50)
    }

    breed(f1, f2) {
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

        return {
            id: -1, p: newP, tier, stars,
            gender: Math.random() > 0.5 ? f1.gender : f2.gender,
            traits: {}  // todo!!! breed!!!
        }
    }

    // Private:

    _incrementCounter(trait, value) {
        let subCounter = this._counters[trait]
        if (subCounter === undefined) {
            subCounter = this._counters[trait] = {}
        }

        subCounter[value] = 1 + (subCounter[value] ?? 0)
    }

    _parseTokenIds(tokenIdResults) {
        const data = tokenIdResults.db

        this.tokenIdLastTS = +data.lastUpdatedTS
        this._counters = {}

        console.log(`_parseTokenIds: total = ${data.total}`)

        this._idToFewman = {}
        this._tokensAsList = []
        for (const [ident, personalityStr] of Object.values(data['ids'])) {
            const fewman = decodePersonality(ident, personalityStr)
            this._idToFewman[ident] = fewman
            this._tokensAsList.push(fewman)

            // update stats
            this._incrementCounter(COUNTER_GENDER, fewman.gender)
            this._incrementCounter(COUNTER_TIER, fewman.tier)
            this._incrementCounter(COUNTER_STARS, fewman.stars)
            for (const [key, value] of Object.entries(fewman.traits)) {
                this._incrementCounter(key, value[0])
            }
        }

        console.info('Counters:', this._counters)
    }

    _sortPrice() {
        this._tokensAsListSortedByPrice = [...this.tokens]
        this._tokensAsListSortedByPrice.sort((a, b) => {
            const pa = a.priceInfo
            const pb = b.priceInfo

            if (pa && pb) {
                if (pa.buyNow && pb.buyNow) {
                    return compare(pa.price, pb.price)
                } else if (pa.buyNow) {
                    return -1
                } else if (pb.buyNow) {
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

    _parsePriceData(priceResults) {
        const now = nowTS()
        let priceBestTS = 0.0
        let priceWorstTS = now

        this._priceDB = priceResults.db

        for (let k of Object.keys(this._priceDB)) {
            const fewman = this.findById(k)

            fewman.priceInfo = this.getPriceInfo(k)
            if (fewman.priceInfo) {
                const lastTS = fewman.priceInfo.lastUpdateTS
                priceBestTS = Math.max(lastTS, priceBestTS)
                priceWorstTS = Math.min(lastTS, priceWorstTS)
            }
        }
        this.priceBestTS = priceBestTS
        this.priceWorstTS = priceWorstTS

        this._sortPrice()
    }

    async _loadAll() {
        console.log('Loading data from API...')
        const [priceResults, tokenIdResults] = await Promise.all([
            axios.get(PRICE_API_URL),
            axios.get(TOKEN_ID_API_URL)
        ])
        this._parseTokenIds(tokenIdResults.data)
        this._parsePriceData(priceResults.data)
    }
}

export const fewmanDB = new FewmanDBv2()
