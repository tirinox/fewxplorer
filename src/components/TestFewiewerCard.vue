<template>
    <div class="col-xl-4 col-lg-4 col-md-6 mb-4">
        <div class="mb-2">
            <div class="float-end mb-2">
                <button class="btn btn-sm btn-primary" @click="$emit('add-more')">+</button>
                <button class="btn btn-sm btn-danger" @click="$emit('remove-this', this.id)" v-if="id !== 0">x</button>
            </div>
            <PickParent :f="`(${id}) Test`" @id-change="updateFew" :loading="loading"></PickParent>
        </div>
        <FewmanCard
            :fewman="fewman"
            v-if="!!fewman"
            hide-breeding="1"
            is-test="1"
        ></FewmanCard>
        <div v-else class="text-danger">
            <span v-if="!loading">Not found...</span>
            <span v-if="error">{{ error }}</span>
        </div>
    </div>
</template>

<script>
import PickParent from "./PickParent.vue";
import FewmanCard from "./FewmanCard.vue";
import {loadFewmanFromContractsById} from "../data/contract";


export default {
    name: "TestFewiewerCard",
    emits: ['add-more', 'remove-this'],
    props: ['id', 'tokenId'],
    components: {PickParent, FewmanCard},
    data() {
        return {
            fewman: null,
            loading: false,
            error: false,
        }
    },
    methods: {
        async updateFew(tokenId) {
            this.loading = true
            this.fewman = null
            this.error = false

            const result = await loadFewmanFromContractsById(tokenId, true)
            if(result.error) {
                this.error = result.error.toString()
            } else {
                this.fewman = result
            }
            this.loading = false
        }
    },
    mounted() {
        if (this.tokenId !== undefined) {
            this.updateFew(this.tokenId)
        }
    }
}
</script>

<style scoped>
</style>