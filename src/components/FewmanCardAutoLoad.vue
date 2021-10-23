<template>
    <FewmanCard
        v-if="fewman && !loading"
        :fewman="fewman"
        :hide-f2="true"
        @setF1="$emit('setF1', $event)"
    ></FewmanCard>
    <div class="card rect" v-if="loading">
        <h4><span class="spinner-border"></span> Загрузка...</h4>
    </div>
    <div class="card rect" v-if="!loading && !fewman">
        <h5>Ошибка загрузки #{{ this.tokenId }}</h5>
    </div>
</template>

<script>
import FewmanCard from "./FewmanCard.vue";
import {loadFewmanFromContractsById} from "../data/contract";

const cache = {}

export default {
    name: "FewmanCardAutoLoad",
    props: ['tokenId', 'isTestnet'],
    components: {FewmanCard},
    emits: ['setF1', 'loaded'],
    data() {
        return {
            fewman: null,
            loading: false,
        }
    },
    async mounted() {
        const tokenId = +this.tokenId
        const isTest = Boolean(this.isTestnet)
        const key = String(tokenId) + '-' + String(isTest)
        if(cache.hasOwnProperty(key)) {
            this.fewman = cache[key]
        } else {
            this.loading = true
            const result = await loadFewmanFromContractsById(+this.tokenId, isTest)
            if(result.error) {
                this.fewman = null
            } else {
                this.fewman = result
                cache[key] = result
            }
            this.$emit('loaded', result)
            this.loading = false
        }
    },
    getFewmanFromCache(tokenId, isTestnet) {
        return cache[String(tokenId) + '-' + String(isTestnet)]
    }
}
</script>

<style scoped>

</style>