<script>
import data from '../data/fewmans_stars_new_mini.json'
import FewmanCard from "./FewmanCard.vue";

export default {
    components: {FewmanCard},
    props: {
        msg: String
    },
    data() {
        return {
            scTimer: 0,
            scY: 0,
        }
    },
    methods: {
        handleScroll: function () {
            if (this.scTimer) {
                return;
            }
            this.scTimer = setTimeout(() => {
                this.scY = window.scrollY;
                clearTimeout(this.scTimer);
                this.scTimer = 0;
            }, 100);
        },
        toTop: function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },
    },
    created() {
        this.fewData = Object.values(data).slice(0, 50)
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    }
}

</script>

<template>
    <button
        type="button"
        class="btn btn-danger btn-floating btn-lg"
        id="btn-back-to-top"
        v-show="scY > 100"
        @click="toTop"
    >
        <span id="top-text">TOP</span>
    </button>

    <div class="row">
        <FewmanCard :fewman="v" v-for="v in fewData" :key="v.id"></FewmanCard>
    </div>
</template>

<style scoped>

#btn-back-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
}

#top-text {
    font-family: 'Press Start 2P', sans-serif;
    font-size: 10pt;
}

</style>
