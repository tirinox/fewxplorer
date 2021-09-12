<script>
import data from '../data/fewmans_stars_new_mini.json'
import FewmanCard from "./FewmanCard.vue";
import mitt, {EVENTS} from "../helpers/mitt";
import HelpModal from "./HelpModal.vue";

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

        doSearch() {
            const q = this.query.trim().toLowerCase()
            if (q === '') {
                this.results = this.fewData
            } else if (q === 'help') {
                this.query = ''
                this.help()
            } else {
                let words = q.match(/\b(\w+)\b/g)
                const wordSet = new Set(words)

                let desiredGender = null
                const minTier = 0
                const maxTier = 3
                const minStars = 0
                const maxStars = 1000

                this.isError = false

                const fems = new Set(['f', 'fe', 'fem', 'female', 'femal', 'woman', 'girl'])
                const males = new Set(['m', 'ma', 'mal', 'male', 'man', 'boy'])

                let attribWords = []
                for (let i = 0; i < words.length; ++i) {
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
                    } else {
                        attribWords.push(w)
                    }
                }

                console.log(`search gender = ${desiredGender}, tier = [${minTier}...${maxTier}],
                stars = [${minStars}...${maxStars}], words = ${attribWords}`)

                this.filterWords = attribWords

                function isGood(item) {
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

                    const tier = Math.max.apply(null, starsArr)
                    if (tier < minTier || tier > maxTier) {
                        return false
                    }

                    const totalStars = starsArr.reduce((a, c) => a + c, 0)
                    if (totalStars < minStars || totalStars > maxStars) {
                        return false
                    }

                    const genderMatch = desiredGender === null || desiredGender === gender
                    if (!genderMatch) {
                        return false
                    }

                    const attribs = [hair, eyes, body, sex, intel, career, curse, gift].map(w => w.toLowerCase())
                    const text = attribs.join(' ')
                    return attribWords && attribWords.every(w => text.includes(w))
                }

                this.results = this.fewData.filter(isGood).slice(0, 50)
            }
            mitt.emit(EVENTS.SCROLL_TOP)
        },
        focusSearch() {
            this.$refs.searchQuery.focus();
        }
    },
    created() {
        this.fewData = Object.values(data).slice(0, 50)
        // this.fewData = Object.values(data)  // all
    },
    mounted() {
        this.doSearch()
        this.focusSearch()
    }
}

</script>

<template>
    <HelpModal ref="help"></HelpModal>

    <div class="sticky-top toolbox my-3 p-2">
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
                <button class="btn btn-secondary" @click="help">?</button>
            </div>
        </div>
    </div>

    <div class="row">
        <FewmanCard :fewman="v" v-for="v in results" :key="v.id"></FewmanCard>
        <div class="text-center" v-if="!results.length">
            <h2>Nothing found!</h2>
        </div>
    </div>
</template>

<style scoped>

.toolbox {
    display: block;
    background: #F9FBFC;
}

button, input {
    font-family: "Courier New", Courier, monospace;
    font-weight: bold;
    border-radius: 0 !important;
}


</style>
