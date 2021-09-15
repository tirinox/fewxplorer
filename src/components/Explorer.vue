<script>
import data from '../data/fewmans_stars_new_mini.json'
import FewmanCard from "./FewmanCard.vue";
import mitt, {EVENTS} from "../helpers/mitt";
import HelpModal from "./HelpModal.vue";

function isNormalInteger(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}

const BATCH_SIZE = 42
const MAX_TIER = 7

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
        }
    },
    methods: {
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
            this.query = (this.query + ' ' + term).trim()
            this.doSearch()
        },

        doSearch(more) {
            more = more === 'more'
            if(!more) {
                console.info('new search')
                this.nextIdentToScan = 0
                this.results = []
                this.allLoaded = false
            } else if(this.allLoaded) {
                return
            }

            const q = this.query.trim().toLowerCase()
            if (q === 'help') {
                this.query = ''
                this.help()
                return
            } else if(isNormalInteger(q)) {
                const token = parseInt(q)
                this.results = this.fewData.filter(v => v.id === token)
                this.allLoaded = true
            } else {
                let words = q.match(/\b(\w+)\b/g) || []

                let desiredGender = null
                const desiredTiers = new Set()
                const desiredStars = new Set()
                this.isError = false

                const fems = new Set(['f', 'fe', 'fem', 'female', 'femal', 'woman', 'girl'])
                const males = new Set(['m', 'ma', 'mal', 'male', 'man', 'boy'])

                let attribWords = []
                for (let i = 0; i < words.length; ++i) {
                    const last = i === words.length - 1
                    const w = words[i]
                    if (fems.has(w)) {
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
                                if(t > MAX_TIER) {
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

                console.log(`search gender = ${desiredGender},
                tiers = ${Array.from(desiredTiers).join(', ')},
                stars = ${Array.from(desiredStars).join(', ')},
                words = ${attribWords}`)

                this.filterWords = attribWords

                function isGood(item) {
                    if(q === '') {
                        return true
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

                    const starsArr = [hair_star, eyes_star, body_star, sex_star,
                        intel_star, career_star, curse_star, gift_star]

                    if (desiredTiers.size > 0) {
                        const tier = Math.max.apply(null, starsArr)
                        if (!desiredTiers.has(tier)) {
                            return false
                        }
                    }

                    if (desiredStars.size > 0) {
                        const totalStars = starsArr.reduce((a, c) => a + c, 0)
                        if (!desiredStars.has(totalStars)) {
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
                for(let i = this.nextIdentToScan; i < this.fewData.length; ++i) {
                    this.nextIdentToScan = i + 1
                    const el = this.fewData[i]
                    if(isGood(el)) {
                        thisBatch.push(el)
                    }
                    if(thisBatch.length >= BATCH_SIZE) {
                        break
                    }
                }

                if(thisBatch.length < BATCH_SIZE) {
                    this.allLoaded = true
                }

                console.info(`added ${thisBatch.length} elements`)

                this.results.push(...thisBatch)
            }

            if(!more) {
                mitt.emit(EVENTS.SCROLL_TOP)
            }
        },
        focusSearch() {
            this.$refs.searchQuery.focus();
        },
        loadMore() {
            this.doSearch('more')
        },
        copyQuery() {
            const url = location.protocol + '//' + location.host + location.pathname + '?q=' + encodeURI(this.query)
            navigator.clipboard.writeText(url)
        }
    },
    created() {
        // this.fewData = Object.values(data).slice(0, 500)
        this.fewData = Object.values(data)  // all
    },
    mounted() {
        this.query = new URL(location.href).searchParams.get('q') || ''
        this.doSearch()
        this.focusSearch()
        mitt.on('load_more', () => {
            this.loadMore()
        })
    },
    computed: {
        helperButtons() {
            const arr = [
                {value: 'male', caption: 'Male'},
                {value: 'female', caption: 'Female'},
            ]
            for(let i = 0; i <= MAX_TIER; ++i) {
                arr.push({value: `tier ${i}`, caption: `t${i}`})
            }
            for(let i = 0; i <= MAX_TIER; ++i) {
                arr.push({value: `star ${i}`, caption: `⭐${i}`})
            }
            return arr
        }
    }
}

</script>

<template>
    <HelpModal ref="help"></HelpModal>

    <div class="sticky-top toolbox mb-5 p-3">
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
                    <img id="copy-img" alt="copy" src="/copy.svg" class="img-fluid">
                </button>
                <button class="btn btn-secondary" @click="help">?</button>
            </div>
        </div>
        <div class="input-group">
            <button class="btn btn-sm btn-light" @click="appendQuery(value)"
            v-for="{value, caption} in helperButtons">{{ caption }}</button>
        </div>
    </div>

    <div class="row m-1">
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
    /*padding: 2px;*/
}

</style>
