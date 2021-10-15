import {toRefs, reactive} from "vue";
import {fewmanDB} from "./provider";
import {genderByTokenId} from "./personality";

const GEN_PROB = [
    [128, 0x0, 0x0,  0x0, 0x0,  0x0],
    [255, 0x0,  32,   32,  32,   32],
    [255, 224, 0x0,   64,  64,   64],
    [255, 224, 192,  0x0, 128,  128],
    [255, 224, 192,  128, 0x0,  128],
    [255, 224, 192,  128, 128,  0x0]
];

const STARS_REQUIRED = [0, 1, 2, 3, 4, 5, 6, 6, 7, 8, 8];

const PRICES = [
    0,
    1,
    3,
    9,
    27,
    81,
    243,
    729,
    2187,
    6561,
    19683,
    59049,
    177147
]

const state = reactive({
    f1TokenId: null,
    f2TokenId: null
});


function safeBreed(f1, f2) {
    let reason = ''

    let totalStars = 0
    let tier = 0

    let generation = Math.max(f1.generation, f2.generation)
    if(generation >= 13) {
        return {
            child: null,
            needGold: 0, outGold: 0,
            reason: `The fewman is too old: gen ${generation}`
        }
    }

    if(generation > 10) {
        if(f1.tier < 3 || f2.tier < 3) {
            return {
                child: null, needGold: 0, outGold: 0,
                reason: 'The rarest fewman is required'
            }
        }
    } else {
        const reqStars = STARS_REQUIRED[generation]
        if(!(f1.stars >= reqStars || f2.stars >= reqStars)) {
            return {
                child: null, needGold: 0, outGold: 0,
                reason: `Some more stars (${reqStars}⭐) are required for this breeding`
            }
        }
    }

    const needGold = PRICES[generation]
    let outGold = PRICES[generation + 1]
    
    const tokenId = +fewmanDB.totalFewmans

    let child = {
        traits: {},
        gender: genderByTokenId(tokenId),
        id: tokenId,
        p: [],
        owner: null,
        generation: (generation + 1),
    }

    child.p.push(child.gender)

    // todo: iterate
    const originalArr = []

    // fixme: debug
    child.traits = f1.traits
    child.p = f1.p
    // fixme: debug

    child.stars = totalStars
    child.tier = tier
    child.originalArr = originalArr

    return {child, needGold, outGold, reason}

    /*
        const traitDesc = TRAIT_MAP[index]

        const stars = VALUE_TO_STARS[traitValue]
        totalStars += stars
        tier = Math.max(tier, stars)

        const traitValueStr = traitDesc.values[+traitValue]
        fewman.traits[traitDesc.name] = [traitValueStr, stars]
        fewman.p.push(traitValueStr, stars)
     */
}


function breed(f1, f2) {
    let reason = ''
    let child = null
    let needGold = 0
    let outGold = 0

    if (!f1) {
        reason = 'Parent F1 is not set.'
    } else if (!f2) {
        reason = 'Parent F2 is not set.'
    } else if (f1.id === f2.id) {
        reason = 'One cannot breed with self.'
    } else if (f1.gender === f2.gender) {
        reason = 'One must be a man and the other must be a woman.'
    } else {
        return  safeBreed(f1, f2)
    }

    return {reason, child, needGold, outGold}
}

export default function useBreedingState() {
    const setF1 = (f1) => {
        state.f1TokenId = f1
    }
    const setF2 = (f2) => {
        state.f2TokenId = f2
    }
    return {
        ...toRefs(state),
        setF1, setF2,
        breed
    }
}