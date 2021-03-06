<script>

import FewmanCard from "./FewmanCard.vue";
import {fewmanDB} from "../data/provider";
import mitt, {EVENTS} from "../helpers/mitt";
import StarSelector from "./StarSelector.vue";

const MAX_STARS = 12

export default {
    components: {StarSelector, FewmanCard},
    props: {
        msg: String
    },
    data() {
        return {
            currentMaxStars: MAX_STARS,
            maxStars: MAX_STARS,
            gotData: false
        }
    },
    methods: {
        updateMatches(i) {
            this.currentMaxStars = i
        }
    },
    created() {

    },
    mounted() {
        mitt.emit(EVENTS.SCROLL_TOP)
        mitt.on('data_loaded', () => {
            this.gotData = true
        })
    },
    computed: {
        results() {
            if(!this.gotData) {
                return []
            }

            const fewman = fewmanDB.findById(this.subjectId)
            if (!fewman) {
                return []
            }
            return fewmanDB.bestMatch(fewman, this.currentMaxStars)
        },
        subjectId() {
            return this.$route.params.token_id
        },
        subjectFewman() {
            return fewmanDB.findById(this.subjectId)
        }
    }
}

</script>

<template>
    <div class="row m-1">
        <FewmanCard :fewman="subjectFewman" v-if="gotData"></FewmanCard>
        <div class="col-6">
            <img class="img-fluid float-start p-4" src="/img/half-heart-cr.png" alt="Half of a heart">
            <h1 class="d-inline">Best matches</h1>

            <div class="explain">
                <p><strong>Inspired by <a href="https://fewmulator.xyz/"
                                          target="_blank">https://fewmulator.xyz/</a></strong></p>
                <p>
                    Since breeding algorithm is not known yet, this is highly speculative.
                    However it is not random and it does follow FEW rules:
                </p>
                <ol>
                    <li>Only Male + Female can breed</li>
                    <li>Two same (no star) attribute values yield a star</li>
                    <li>Two same (with star) attribute values simply sum stars</li>
                    <li>Two different attribute values -> dominant one (the one with more stars) is inherited</li>
                </ol>
            </div>
            <div>
                <div class="d-inline">
                    <strong>Max stars of partner ({{ currentMaxStars }}):</strong>
                    <StarSelector :max-stars="maxStars" :initial-stars="currentMaxStars" @change="updateMatches"></StarSelector>
                </div>
            </div>
        </div>
    </div>
    <hr class="my-2 new2"/>
    <div class="row m-1">
        <FewmanCard :fewman="v.candidate" :child="v.result" v-for="v in results" :key="v.id"></FewmanCard>
        <div class="text-center" v-if="!results.length">
            <h2 class="m-4">No FEWMANS like this</h2>
        </div>
    </div>
</template>

<style scoped>

/* Dashed red border */
hr.new2 {
    background-color: white;
    border-top: 4px dashed #bbb;
    margin-bottom: 20pt !important;
}

.explain {
    font-size: 11pt;
}

</style>
