import {isNormalInteger} from "../helpers/util";
import {fewmanDB} from "./provider";
import {Config} from "./config";

function makeError(i) {
    return {
        isError: true,
        batch: [],
        allLoaded: false,
        nextIndex: i
    }
}

export function semanticSearch(q, startIndex) {
    startIndex = startIndex || 0

    let words = q.match(/\b(\w+)\b/g) || []

    let desiredGender = null
    const desiredTiers = new Set()
    const desiredStars = new Set()
    const desiredGeneration = new Set()
    const desiredOwners = new Set()

    const fems = new Set(['f', 'fe', 'fem', 'female', 'femal', 'woman', 'girl'])
    const males = new Set(['m', 'ma', 'mal', 'male', 'man', 'boy'])

    let buy = false
    let price = false

    let attribWords = []
    for (let i = 0; i < words.length; ++i) {
        const last = i === words.length - 1
        const w = words[i].toLowerCase()
        if (w === 'buy') {
            buy = true
        } else if (w === 'price') {
            price = true
        } else if (fems.has(w)) {
            if (desiredGender) {
                return makeError()
            } else {
                desiredGender = 'Female'
            }
        } else if (males.has(w)) {
            if (desiredGender) {
                return makeError()
            } else {
                desiredGender = 'Male'
            }
        } else if(w.substr(0, 2) === '0x') {
            // this is owner address
            desiredOwners.add(w)
        } else if (w === 'tier' || w === 't') {
            if (last) {
                return makeError()
            } else {
                ++i
                const next = words[i]
                if (isNormalInteger(next)) {
                    const t = parseInt(next)
                    if (t > MAX_TIER) {
                        return makeError()
                    }
                    desiredTiers.add(t)
                }
            }
        } else if (w === 'stars' || w === 'star' || w === 'st') {
            if (last) {
                return makeError()
            } else {
                ++i
                const next = words[i]
                if (isNormalInteger(next)) {
                    desiredStars.add(parseInt(next))
                }
            }
        } else if (w === 'gen' || w === 'g' || w === 'generation') {
            if (last) {
                return makeError()
            } else {
                ++i
                const next = words[i]
                if (isNormalInteger(next)) {
                    desiredGeneration.add(parseInt(next))
                }
            }
        } else {
            attribWords.push(w)
        }
    }

    console.log(`Search: gender = "${desiredGender}", ` +
        `tiers = [${Array.from(desiredTiers).join(', ')}]` +
        ` stars = [${Array.from(desiredStars).join(', ')}], ` +
        ` gen = [${Array.from(desiredGeneration).join(', ')}], ` +
        ` owner = [${Array.from(desiredOwners).join(', ')}], ` +
        `words = "${attribWords}`)

    function isGood(item) {
        if (q === '') {
            return true
        }

        if (buy && (!item.priceInfo || !item.priceInfo.buyNow)) {
            return false
        }
        if (price && (!item.priceInfo)) {
            return false
        }

        const [
            gender,
            hair, hair_star,
            eyes, eyes_star,
            body, body_star,
            sex, sex_star,
            intel, intel_star,
            career, career_star,
            curse, curse_star,
            gift, gift_star
        ] = item.p

        if (desiredTiers.size > 0) {
            if (!desiredTiers.has(item.tier)) {
                return false
            }
        }

        if (desiredStars.size > 0) {
            if (!desiredStars.has(item.stars)) {
                return false
            }
        }

        if (desiredOwners.size > 0) {
            if (!item.owner || !desiredOwners.has(item.owner.toLowerCase())) {
                return false
            }
        }

        if(desiredGeneration.size > 0) {
            const gen = item.generation ? +item.generation : 0
            if(!desiredGeneration.has(gen)) {
                return false
            }
        }

        const genderMatch = desiredGender === null || desiredGender === gender
        if (!genderMatch) {
            return false
        }

        const attribs = [hair, eyes, body, sex, intel, career, curse, gift].map(w => w.toLowerCase())
        const text = attribs.join(' ')
        return attribWords && attribWords.every(w => text.includes(w))
    }

    let thisBatch = []
    let nextIndex = 0
    const data = buy ? fewmanDB.tokensPriceSorted : fewmanDB.tokens;
    for (let i = startIndex; i < data.length; ++i) {
        nextIndex = i + 1
        const el = data[i]
        if (typeof el === 'undefined') {
            break
        }
        if (isGood(el)) {
            thisBatch.push(el)
        }
        if (thisBatch.length >= Config.SEARCH_BATCH_SIZE) {
            break
        }
    }

    const allLoaded = thisBatch.length < Config.SEARCH_BATCH_SIZE

    return {
        batch: thisBatch,
        isError: false,
        allLoaded,
        nextIndex
    }
}
