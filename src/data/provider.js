import axios from "axios";
import {agoTS, compare, nowTS, wait} from "../helpers/util.js";
import {breed, decodePersonality} from "./personality";
import {Config} from "./config";

const PRICE_API_URL = 'https://fewmans.xyz/fewpi/opensea/'
const TOKEN_ID_API_URL = 'https://fewmans.xyz/fewpi/tokenids/'
const ADDRESS_TOKENS_API_URL = 'https://fewmans.xyz/fewpi/address/'


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

        this._maxId = 0

        this.tokenIdLastTS = 0
    }

    get totalFewmans() {
        return this._tokensAsList.length
    }

    get nextId() {
        return this._maxId + 1
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
        try {
            return this._countToPercent(this._counters[COUNTER_STARS][fewman.stars])
        } catch (e) {
            return 0.0
        }
    }

    rarityByGender(fewman) {
        return this._countToPercent(this._counters[COUNTER_GENDER][fewman.gender])
    }

    _countToPercent(n) {
        return (n ?? 0) / this.totalFewmans * 100.0
    }

    get isItTimeToUpdate() {
        return nowTS() - this.lastTimeLoaded > Config.DB_REFRESH_TIME
    }

    async updateIfNeeded() {
        try {
            if(!this._loadFromLocalStorage()) {
                if (!this._tokensAsList.length || this.isItTimeToUpdate) {
                    await this._loadAll()
                }
            } else {
                await wait(1)
            }
            return true
        } catch (e) {
            console.error(`Error! ${e}`)
            // throw e  // fixme!
            return false
        }
    }

    bestMatch(fewman, maxStars) {
        maxStars = maxStars || 9999

        const results = []
        const candidates = this.tokens.filter(f => f.gender !== fewman.gender && f.stars <= maxStars)  // only f + m
        for (const candidate of candidates) {
            if (candidate.id !== fewman.id) {
                const result = breed(candidate, fewman)
                if (result) {
                    results.push({candidate, result})
                }
            }
        }
        results.sort((a, b) => b.result.stars - a.result.stars)
        return results.slice(0, Config.MAX_MATCHES)
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

        this._maxId = 0

        this.tokenIdLastTS = +data.lastUpdatedTS
        this._counters = {}

        console.log(`_parseTokenIds: total = ${data.total}`)

        this._idToFewman = {}
        this._tokensAsList = []
        for (const [ident, personalityStr, owner, generation] of Object.values(data['ids'])) {
            const fewman = decodePersonality(ident, personalityStr, owner, generation)
            this._idToFewman[ident] = fewman
            this._tokensAsList.push(fewman)
            this._maxId = Math.max(this._maxId, ident)

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
            if(!fewman) {
                continue
            }

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

    _saveToLocalStorage(tokenIdResults, priceResults) {
        if(localStorage && tokenIdResults && priceResults) {
            const data = JSON.stringify({
                lastLoadTS: this.lastTimeLoaded,
                tokenDB: tokenIdResults,
                priceDB: priceResults
            })
            localStorage.setItem('FEWDATA', data);
            console.info(`Saved data to the local storage. ${data.length / 1024} Kb written.`)
        }
    }

    _loadFromLocalStorage() {
        if(localStorage) {
            try {
                const {lastLoadTS, tokenDB, priceDB} = JSON.parse(localStorage.getItem('FEWDATA'));
                console.info(`There is data in local storage dated ${agoTS(lastLoadTS)}.`)
                this.lastTimeLoaded = lastLoadTS

                if(!lastLoadTS || !tokenDB || !priceDB) {
                    console.warn('Invalid data!')
                    return false
                }

                if(!this.isItTimeToUpdate) {
                    console.info('Parsing DB from the local storage...')
                    this._parseTokenIds(tokenDB)
                    this._parsePriceData(priceDB)
                    console.info(`Success! ${this.totalFewmans} fewmans!`)
                    return true
                } else {
                    console.warn('Data in the local storage is outdated!')
                    return false
                }
            } catch (e) {
                console.error(`Error! When loading local storage! ${e}`)
                return false
            }
        }
        return false
    }

    async _loadAll() {
        console.log('Loading data from API...')
        const [priceResults, tokenIdResults] = await Promise.all([
            axios.get(PRICE_API_URL),
            axios.get(TOKEN_ID_API_URL)
        ])
        this._parseTokenIds(tokenIdResults.data)
        this._parsePriceData(priceResults.data)
        this.lastTimeLoaded = nowTS()
        this._saveToLocalStorage(tokenIdResults.data, priceResults.data)
    }

    async loadTokensOfAddress(address) {
        if(!address.startsWith('0x') || address.length < 40) {
            return []
        }
        const url = ADDRESS_TOKENS_API_URL + address
        const result = await axios.get(url)
        return result.data['tokensIds']
    }
}

export const fewmanDB = new FewmanDBv2()
