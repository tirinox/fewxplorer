<script>

import {fewmanDB} from "./data/provider";

export default {
    name: "App",

    data() {
        return {
            result: ''
        }
    },
    methods: {},

    mounted() {
        this.result = 'loading...'
        fewmanDB.updateIfNeeded().then(() => {
            this.result = JSON.stringify(fewmanDB.findById(6))
        })
    },
    onUnmounted() {

    },
}

</script>

<template>
    <div>
        <h1>Test</h1>
        <code>{{ result }}</code>
    </div>
</template>

<style>
</style>
