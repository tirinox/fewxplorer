export const TEST = false

export const Config = {
    // db
    DB_REFRESH_TIME: TEST ? 999999: 60,

    // breed em
    BREED_MAINTENANCE: false,

    AUTO_UPDATE_TIME: 2000, // ms

    FEWVULATION_AUTO_UPDATE_TIME: 30, // secs
    FEWVULATION_CHILD_UPDATE_TIME: 3, // secs
    FEWVULATION_TICK_TIME: 1000, // ms

    // explorer
    SEARCH_BATCH_SIZE: 42,

    // match
    MAX_TIER: 3,
    MAX_STARS: 12,
    MAX_MATCHES: 50,

    // contrats
    FEWMANS_CONTRACT: '0xad5f6cdda157694439ef9f6dd409424321c74628',
    FEWMANS_BREED_CONTRACT: '0x7977eb2Ba4bE7CC4Bb747baF2eE9177CAdc96a02',
    FEWMANS_CONTRACT_TEST: '0xB1E8EBA3613e0195eAA96792c5fc545Cb7f7EFF6',
    FEWMANS_BREED_CONTRACT_TEST: '0x0FC0C72F5b3378c07789f0aa9B738d6171881c81',

    DEFAULT_KEY: '00921e2ed6f449ecb52c22e8d585227b',
}
