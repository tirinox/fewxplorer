export const TRAIT_MAP = {
    0: {
        name: 'Hair',
        values: {
            '0': 'Albino',  // ***
            '1': 'Bold',  // **
            '2': 'Red',  // *
            '3': 'Brown',
            '4': 'Blonde',
            '5': 'Black',
        }
    },
    1: {
        name: 'Eyes',
        values: {
            '0': 'Heterochromic',  // ***
            '1': 'Red',  // **
            '2': 'Violet',  // *
            '3': 'Brown',
            '4': 'Green',
            '5': 'Blue',
        }
    },
    2: {
        name: 'Body',
        values: {
            '0': 'Giant',  // ***
            '1': 'Midget',  // **
            '2': 'Anorexic',  // *
            '3': 'Regular',
            '4': 'Fat',
            '5': 'Athletic',
        }
    },
    3: {
        name: 'Sexuality',
        values: {
            '0': 'Virgin',  // ***
            '1': 'Whore',  // **
            '2': 'Pervert',  // *
            '3': 'Hetero',
            '4': 'Bisexual',
            '5': 'Gay/Lesbian',  // todo: detect by gender
        }
    },
    4: {
        name: 'Intelligence',
        values: {
            '0': 'Degen',  // ***
            '1': 'Genius',  // **
            '2': 'Psycho',  // *
            '3': 'Average',
            '4': 'Smart',
            '5': 'Stupid',
        }
    },
    5: {
        name: 'Career',
        values: {
            '0': 'President',  // ***
            '1': 'Sex Worker',  // **
            '2': 'Scientist',  // *
            '3': 'Worker',
            '4': 'Medic',
            '5': 'Clerk',
        }
    },
    6: {
        name: 'Curse',
        values: {
            '0': 'Pyromania',  // ***
            '1': 'Blindness',  // **
            '2': 'Impotence',  // *
            '3': 'Alcoholic',
            '4': 'Drug Addict',
            '5': 'Porn Addict',
        }
    },
    7: {
        name: "God's gift",
        values: {
            '0': 'FOMO',  // ***
            '1': 'Luck',  // **
            '2': 'Longevity',  // *
            '3': 'Empathy',
            '4': 'Not gifted',
            '5': 'Leadership',
        }
    },
}

export function genderByTokenId(tokenId) {
    tokenId = +tokenId
    if (tokenId % 2 === 0) {
        return 'Female'
    } else {
        return 'Male'
    }
}

export const VALUE_TO_STARS = {
    0: 3,
    1: 2,
    2: 1,
    3: 0,
    4: 0,
    5: 0
}

export function decodePersonality(tokenId, traitArr) {
    if(traitArr instanceof String) {
        traitArr = traitArr.split('')
    }

    let fewman = {
        traits: []
    }
    let index = 0
    let totalStars = 0
    let tier = 0
    for (const traitValue of traitArr) {
        const traitDesc = TRAIT_MAP[index]

        const stars = VALUE_TO_STARS[traitValue]
        totalStars += stars
        tier = Math.max(tier, stars)

        fewman.traits.push({
            key: traitDesc.name,
            value: traitDesc.values[+traitValue],
            stars
        })
        ++index
    }
    fewman.gender = genderByTokenId(tokenId)
    fewman.stars = totalStars
    fewman.tier = tier
    fewman.tokenId = tokenId
    return fewman
}
