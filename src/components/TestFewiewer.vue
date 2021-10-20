<template>
    <h1>Test Fewman Viewer</h1>
    <p>Эта страничка позволяет вам просматривать Фьюманов по ID в тестовой сети</p>
    <div class="row m-1">
        <TestFewiewerCard
            @add-more="addCard"
            @remove-this="removeCard"
            v-for="id in viewCards" :id="id"></TestFewiewerCard>
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
        addCard() {
            this.viewCards.push(this.currentId++)
        },
        removeCard(idToRemove) {
            this.viewCards = this.viewCards.filter((id) => (id !== idToRemove))
        }
    },
    mounted() {
        setupInfura(this.$route.params.infura)
        this.addCard()
    }
}
</script>

<style scoped>

</style>