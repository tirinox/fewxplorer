<template>
    <div>
        <img alt="star" class="img-fluid star"
             src="/img/star.png"
             v-for="i in maxStars" :key="i"
             :class="{'faded': (i > current)}"
             @click="click(i)"
        >
    </div>
</template>

<script>
export default {
    name: "StarSelector",
    props: ['maxStars', 'initialStars'],
    data() {
        return {
            current: this.initial
        }
    },
    methods: {
        click(i) {
            this.current = i
            this.$emit('change', i)
        }
    }
}
</script>

<style scoped>

.star {
    width: 12pt;
}

.faded {
    opacity: 50%;
}

</style>