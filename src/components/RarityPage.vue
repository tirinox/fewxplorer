<script>

import RarityCard from "./RarityCard.vue";
export default {
    components: {RarityCard},
    props: {
        msg: String
    },
    data() {
        return {
            cards: [
                'stars',
                't',
                'gender',
                'hair',
                'eyes',
                'body',
                'sex',
                'intel',
                'career',
                'curse',
                'gift'
            ]
        }
    },
}

</script>

<template>
    <h1>Rarity</h1>
    <div class="row">
        <RarityCard :name="n" v-for="n of cards"></RarityCard>
    </div>
</template>

<style scoped>


</style>
