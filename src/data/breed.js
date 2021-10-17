import {toRefs, reactive} from "vue";
import {fewmanDB} from "./provider";
import {decodePersonality, genderByTokenId} from "./personality";
import web3 from 'web3/dist/web3.min.js'


const SEED = "We Like Fewmans"

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


function safeBreed(fewman1, fewman2) {
    let reason = ''

    let generation = Math.max(fewman1.generation, fewman2.generation)
    if(generation >= 13) {
        return {
            child: null,
            needGold: 0, outGold: 0,
            reason: `The fewman is too old: gen ${generation}`
        }
    }

    if(generation > 10) {
        if(fewman1.tier < 3 && fewman2.tier < 3) {
            return {
                child: null, needGold: 0, outGold: 0,
                reason: 'The rarest fewman is required'
            }
        }
    } else {
        const reqStars = STARS_REQUIRED[generation]
        if(!(fewman1.stars >= reqStars || fewman2.stars >= reqStars)) {
            return {
                child: null, needGold: 0, outGold: 0,
                reason: `Some more stars (${reqStars}⭐) are required for this breeding`
            }
        }
    }

    const needGold = PRICES[generation]
    let outGold = needGold * 2

    const newTokenId = +fewmanDB.totalFewmans

    let f1 = +fewman1.id
    let f2 = +fewman2.id

    if(f1 & 1 === 0) {
        let temp = f1
        f1 = f2
        f2 = temp

        temp = fewman1
        fewman1 = fewman2
        fewman2 = temp
    }

    const coitusHash = web3.utils.keccak256(web3.utils.encodePacked(
        {type: 'uint16', value: f1},
        {type: 'uint16', value: f2},
        {type: 'string', value: SEED},
    )) // returns string like "0x80..."

    let pseudoRandom = new web3.utils.BN(coitusHash.slice(2), 16)
    console.log(`f1 = ${f1}; f2 = ${f2}; pseudoRandom = ${pseudoRandom}`)

    const originalArr = []

    for(let i = 0; i < 8; i++) {
        let value = pseudoRandom.modn(256)
        pseudoRandom = pseudoRandom.divn(256)

        /*
           childPersonality[i] = genProb[f1Personality[i]][f2Personality[i]] <
                rValue
                ? f1Personality[i]
                : f2Personality[i];
         */
        const trait1 = fewman1.originalArr[i]
        const trait2 = fewman2.originalArr[i]

        originalArr.push(
            GEN_PROB[trait1][trait2] < value ? trait1 : trait2
        )
    }

    const child = decodePersonality(newTokenId, originalArr, '', generation + 1)

    return {child, needGold, outGold, reason}
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