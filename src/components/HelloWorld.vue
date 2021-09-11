<script setup>
import {ref} from 'vue'
import data from '../data/fewmans_stars_new_mini.json'

defineProps({
    msg: String,
})

const fewData = (data)
const count = ref(0)
</script>

<template>
    <h1>{{ msg }}</h1>
    <p>{{ fewData['0'] }}</p>
</template>

<style scoped>
a {
    color: #42b983;
}
</style>
