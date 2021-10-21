<template>
    <h1>Test Fewman Viewer</h1>
    <p>Эта страничка позволяет вам просматривать Фьюманов по ID в тестовой сети</p>
    <div class="row m-1">
        <TestFewiewerCard
            @add-more="addCard"
            @remove-this="removeCard"
            :token-id = "tokenId"
            :id="id"
            v-for="[id, tokenId] in viewCards"></TestFewiewerCard>
    </div>
</template>

<script>

import TestFewiewerCard from "./TestFewiewerCard.vue";
import {setupInfura} from "../data/contract";

export default {
    name: "TestFewiwer",
    components: {TestFewiewerCard},
    data() {
        return {
            viewCards: [],
            currentId: 0
        }
    },
    methods: {
        addCard(tokenId) {
            this.viewCards.push([this.currentId++, tokenId])
        },
        removeCard(idToRemove) {
            this.viewCards = this.viewCards.filter(([id, _]) => (id !== idToRemove))
        }
    },
    mounted() {
        setupInfura(this.$route.params.infura)
        if(this.$route.params.tokenIds) {
            const ids = this.$route.params.tokenIds.split(',').map(s => parseInt(s.trim()))
            console.log('test tokens ids: ', ids)
            this.viewCards = []
            for(let i = 0; i < ids.length; ++i) {
                this.addCard(ids[i])
            }
        } else {
            this.addCard()
        }
    }
}
</script>

<style scoped>

</style>