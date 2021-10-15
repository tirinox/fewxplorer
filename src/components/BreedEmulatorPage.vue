<template>
    <h1>Breed Emulator</h1>
    <div class="row m-1">
        <div class="col-xl-4 col-lg-4 col-md-6 mb-4">
            <div class="mb-2">
                <PickParent f="F1" @id-change="updateFew"></PickParent>
            </div>
            <FewmanCard :fewman="f1" v-if="!!f1" hide-breeding="1"></FewmanCard>
            <div v-else class="text-danger">Not found...</div>
        </div>

        <div class="col-auto d-flex flex-column justify-content-center align-items-center">
            <h2>+</h2>
        </div>

        <div class="col-xl-4 col-lg-4 col-md-6 mb-4">
            <div class="mb-2">
                <PickParent f="F2" @id-change="updateFew"></PickParent>
            </div>

            <FewmanCard :fewman="f2" v-if="!!f2" hide-breeding="1"></FewmanCard>
            <div v-else class="text-danger">Not found...</div>
        </div>

        <div class="col-auto d-flex flex-column justify-content-center align-items-center">
            <h2>=</h2>
        </div>

        <div class="col-4 mb-4" v-if="!!resultFewman">
            <h5 class="text-success">Success! Child:</h5>
            <FewmanCard :fewman="resultFewman" hide-breeding="1"></FewmanCard>
        </div>
        <div class="col-auto mb-4" v-else>
            <h5 class="text-danger">Breeding is not possible!</h5>
            <strong class="text-danger">{{ whyReason }}</strong>
        </div>
    </div>

</template>

<script>
import FewmanCard from "./FewmanCard.vue";
import {fewmanDB} from "../data/provider";
import mitt from "../helpers/mitt";
import PickParent from "./PickParent.vue";
export default {
    name: "BreedEmulatorPage",
    components: {PickParent, FewmanCard},
    data() {
        return {
            magicFoo: 0,
            f1: null,
            f2: null,
            resultFewman: null,
            whyReason: ''
        }
    },
    mounted() {
        mitt.on('data_loaded', () => {
            this.magicFoo++
            this.f1 = fewmanDB.findById(this.$route.params.f1)
            this.f2 = fewmanDB.findById(this.$route.params.f2)
            this.updateChild()
        })
    },
    methods: {
        updateChild() {
            let child = null
            let reason = ''
            const f1 = this.f1
            const f2 = this.f2
            if(!f1) {
                reason = 'Parent F1 is not set.'
            } else if(!f2) {
                reason = 'Parent F2 is not set.'
            } else if(f1.id === f2.id) {
                reason = 'One cannot breed with self.'
            } else if(f1.gender === f2.gender) {
                reason = 'One must be a man and the other must be a woman.'
            } else {
                child = fewmanDB.findById(11)  // fixme! debug
            }
            this.resultFewman = child
            this.whyReason = reason
        },

        updateFew(value, f) {
            if(f === 'F1') {
                this.f1 = fewmanDB.findById(value)
            } else {
                this.f2 = fewmanDB.findById(value)
            }

            this.updateChild()
        }
    }
}
</script>

<style scoped>

</style>