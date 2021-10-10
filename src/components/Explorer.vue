<script>
import {fewmanDB} from '../data/provider'
import FewmanCard from "./FewmanCard.vue";
import mitt, {EVENTS} from "../helpers/mitt";
import HelpModal from "./HelpModal.vue";
import {isBottom, isNormalInteger} from "../helpers/util";

const BATCH_SIZE = 42
const MAX_TIER = 3
const MAX_STARS = 12

export default {
    components: {HelpModal, FewmanCard},
    props: {
        msg: String
    },
    data() {
        return {
            query: '',
            results: [],
            filterWords: [],
            isError: false,
            nextIdentToScan: 0,
            allLoaded: false,
            loaded: false,
            priceBestTS: 0,
            priceWorstTS: 0,
            lastTokenUpdateTS: 0,
            totalTokens: 0
        }
    },
    methods: {
        handleScroll: function () {
            if (isBottom()) {
                this.loadMore()
            }
        },

        makeError() {
            this.results = []
            this.isError = true
        },

        help() {
            this.$refs.help.showHelp()
        },

        clearQuery() {
            this.query = ''
            this.doSearch()
        },

        appendQuery(term) {
            if (this.query.includes(term)) {
                this.query = this.query.replace(term, '').replace('  ', ' ').trim()
            } else {
                this.query = (this.query + ' ' + term).trim()
            }
            this.doSearch()
        },

        doSearch(more) {
            more = more === 'more'
            if (!more) {
                this.nextIdentToScan = 0
                this.results = []
                this.allLoaded = false
            } else if (this.allLoaded) {
                return
            }

            const q = this.query.trim().toLowerCase()
            if (q === 'help') {
                this.query = ''
                this.help()
                return
            } else if (isNormalInteger(q)) {
                const fewman = fewmanDB.findById(q)
                this.results = fewman ? [fewman] : []
                this.allLoaded = true
            } else {
                let words = q.match(/\b(\w+)\b/g) || []

                let desiredGender = null
                const desiredTiers = new Set()
                const desiredStars = new Set()
                this.isError = false

                const fems = new Set(['f', 'fe', 'fem', 'female', 'femal', 'woman', 'girl'])
                const males = new Set(['m', 'ma', 'mal', 'male', 'man', 'boy'])

                let buy = false
                let price = false

                let attribWords = []
                for (let i = 0; i < words.length; ++i) {
                    const last = i === words.length - 1
                    const  w = words[i]
                    if (w === 'buy') {
                        buy = true
                    } else if (w === 'price') {
                        price = true
                    } else if (fems.has(w)) {
                        if (desiredGender) {
                            return this.makeError()
                        } else {
                            desiredGender = 'Female'
                        }
                    } else if (males.has(w)) {
                        if (desiredGender) {
                            return this.makeError()
                        } else {
                            desiredGender = 'Male'
                        }
                    } else if (w === 'tier' || w === 't') {
                        if (last) {
                            return this.makeError()
                        } else {
                            ++i
                            const next = words[i]
                            if (isNormalInteger(next)) {
                                const t = parseInt(next)
                                if (t > MAX_TIER) {
                                    return this.makeError()
                                }
                                desiredTiers.add(t)
                            }
                        }
                    } else if (w === 'stars' || w === 'star') {
                        if (last) {
                            return this.makeError()
                        } else {
                            ++i
                            const next = words[i]
                            if (isNormalInteger(next)) {
                                desiredStars.add(parseInt(next))
                            }
                        }
                    } else {
                        attribWords.push(w)
                    }
                }

                console.log(`Search:
                gender = "${desiredGender}",
                tiers = [${Array.from(desiredTiers).join(', ')}],
                stars = [${Array.from(desiredStars).join(', ')}],
                words = "${attribWords},
                more = ${more}"`)

                this.filterWords = attribWords

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

                    const genderMatch = desiredGender === null || desiredGender === gender
                    if (!genderMatch) {
                        return false
                    }

                    const attribs = [hair, eyes, body, sex, intel, career, curse, gift].map(w => w.toLowerCase())
                    const text = attribs.join(' ')
                    return attribWords && attribWords.every(w => text.includes(w))
                }

                let thisBatch = []
                const data = buy ? fewmanDB.tokensPriceSorted : fewmanDB.tokens;
                for (let i = this.nextIdentToScan; i < data.length; ++i) {
                    this.nextIdentToScan = i + 1
                    const el = data[i]
                    if (isGood(el)) {
                        thisBatch.push(el)
                    }
                    if (thisBatch.length >= BATCH_SIZE) {
                        break
                    }
                }

                if (thisBatch.length < BATCH_SIZE) {
                    this.allLoaded = true
                }

                console.info(`Added ${thisBatch.length} elements (${this.results.length} total).`)

                this.results.push(...thisBatch)
            }

            if (!more) {
                mitt.emit(EVENTS.SCROLL_TOP)
            }
        },
        focusSearch() {
            if(this.$refs.searchQuery) {
                this.$refs.searchQuery.focus();
            }
        },
        loadMore() {
            this.doSearch('more')
        },
        copyQuery() {
            const q1 = this.query
            const url = location.protocol + '//' + location.host + location.pathname + '?q=' + encodeURI(q1)
            navigator.clipboard.writeText(url)
        },
        restoreQuery() {
            this.query = new URL(location.href).searchParams.get('q') || ''
        },
    },
    onUnmounted() {
        window.removeEventListener("scroll", this.handleScroll)
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
        mitt.on('data_loaded', () => {
            this.restoreQuery()
            this.doSearch()
            this.focusSearch()

            this.totalTokens = fewmanDB.totalFewmans
            this.lastTokenUpdateTS = fewmanDB.tokenIdLastTS
            this.priceBestTS = fewmanDB.priceBestTS
            this.loaded = true

            // fixme: called even if it is not on this route!
            mitt.on('load_more', () => {
                this.loadMore()
            })
        })
    },
    computed: {
        helperButtons() {
            const arr = [
                {value: 'buy', caption: 'Buy now'},
                {value: 'male', caption: 'Male'},
                {value: 'female', caption: 'Female'},
            ]
            for (let i = 0; i <= MAX_TIER; ++i) {
                arr.push({value: `tier ${i}`, caption: `t${i}`})
            }
            for (let i = 0; i <= MAX_STARS; ++i) {
                arr.push({value: `star ${i}`, caption: `⭐${i}`})
            }
            return arr
        },
    },
}

</script>

<template>
    <HelpModal ref="help"></HelpModal>

    <div class="toolbox mb-5 p-3">
        <div class="py-1">
            <small class="disabled">
                Last price update: <em>{{ $filters.agoTS(priceBestTS) }}</em>,
                token list last update: <em>{{ $filters.agoTS(lastTokenUpdateTS) }}</em>,
                total tokens: <em>{{ totalTokens }}</em>
            </small>
        </div>

        <div class="input-group">
            <input type="text"
                   tabindex="0"
                   ref="searchQuery"
                   v-model="query"
                   v-debounce.lock:450="doSearch"
                   :class="{'is-invalid': isError}"
                   placeholder="Enter FEW words for search..."
                   class="form-control"
            />
            <div class="input-group-append">
                <button class="btn btn-danger" @click="clearQuery" v-show="this.query.length > 0">X</button>
                <button class="btn btn-light btn-light" @click="copyQuery" v-show="this.query.length > 0">
                    <img id="copy-img" alt="copy" src="/img/copy.svg" class="img-fluid">
                </button>
                <button class="btn btn-secondary" @click="help">?</button>
            </div>
        </div>
        <div class="input-group">
            <button class="btn btn-sm btn-light" @click="appendQuery(value)"
                    v-for="{value, caption} in helperButtons">{{ caption }}
            </button>
        </div>
    </div>

    <div class="row m-1" v-if="loaded">
        <FewmanCard :fewman="v" v-for="v in results" :key="v.id"></FewmanCard>
        <div class="text-center" v-if="!results.length">
            <h2 class="m-4">No FEWMANS like this</h2>
        </div>
    </div>
</template>

<style scoped>

.toolbox {
    display: block;
    background: #F9FBFC;
}

.btn-light {
    text-decoration: underline;
}

button, input {
    font-family: "Courier New", Courier, monospace;
    font-weight: bold;
    border-radius: 0 !important;
}

#copy-img {
    width: 16px;
    padding: 0;
    margin: 0;
}

</style>
