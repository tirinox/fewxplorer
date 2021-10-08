<script>

import RarityCard from "./RarityCard.vue";
import {TRAIT_NAMES} from "../data/personality";
import {COUNTER_GENDER, COUNTER_STARS, COUNTER_TIER, fewmanDB} from "../data/provider";
import mitt from "../helpers/mitt";

export default {
    components: {RarityCard},
    props: {
        msg: String
    },
    data() {
        return {
            cardsNames: [
                COUNTER_TIER,
                COUNTER_STARS,
                COUNTER_GENDER,
                ...TRAIT_NAMES
            ],
            totalFewmans: 'Loading...',
            lastUpdateTS: 0,
        }
    },
    mounted() {
        mitt.on('data_loaded', () => {
            this.totalFewmans = fewmanDB.totalFewmans
            this.lastUpdateTS = fewmanDB.tokenIdLastTS
        })
    }
}

</script>

<template>
    <h1>Rarity</h1>
    <div class="mb-2">
        <span>
            Total Fewmans: <strong>{{ totalFewmans }}</strong>
            (last updated <strong>{{ $filters.agoTS(lastUpdateTS) }}</strong>)
        </span>
    </div>
    <hr>
    <div class="row">
        <RarityCard :name="name" v-for="name of cardsNames"></RarityCard>
    </div>
</template>

<style scoped>
</style>
