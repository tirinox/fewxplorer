<template>
    <h1>Breed Emulator</h1>
    <p>Только члены тайного Ордена допущены в это Святилище!</p>
    <hr>
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
            <div class="mt-1">
                <span v-if="needGold > 0">
                    You will spend <strong>{{ needGold }} 👑 FEWGO</strong>
                </span>
                <span v-else>
                    It is free
                </span>
            </div>
            <div>
                and you will get <strong> {{ outGold }} 👑 FEWGO</strong> after breeding.
            </div>
            <div>
                ⚠️ Both parent Fewmans will disappear...
            </div>
        </div>
        <div class="col-auto mb-4" v-else>
            <h5 class="text-danger">Breeding is not possible!</h5>
            <strong class="text-danger">{{ whyReason }}</strong>
        </div>
    </div>
    <LoadView v-else text="The Fewmans Database is updating... Please wait patiently."></LoadView>

</template>

<script>

import FewmanCard from "./FewmanCard.vue";
import {fewmanDB} from "../data/provider";
import PickParent from "./PickParent.vue";
import useBreedingState from "../data/breed.js";
import {gen0fewman} from "../data/personality";
import LoadView from "./LoadView.vue";

const breed = useBreedingState()

export default {
    name: "BreedEmulatorPage",
    components: {LoadView, PickParent, FewmanCard},
    data() {
        return {
            magicFoo: 0,
            f1: null,
            f2: null,
            resultFewman: null,
            whyReason: '',
            needGold: 0,
            outGold: 0,
        }
    },
    mounted() {
        this.f1 = this.findOrImagine(this.$route.params.f1)
        this.f2 = this.findOrImagine(this.$route.params.f2)
        this.updateChild()
    },
    computed: {
        nextId() {
            return 0
        }
    },
    methods: {
        findOrImagine(id) {
            return null // todo!
        },

        updateChild() {
            const {child, reason, needGold, outGold} = breed.breed(this.f1, this.f2, fewmanDB.nextId)
            this.resultFewman = child
            this.whyReason = reason
            this.needGold = needGold
            this.outGold = outGold
        },

        updateFew(value, f) {
            const fewman = this.findOrImagine(value)
            if (f === 'F1') {
                this.f1 = fewman
            } else {
                this.f2 = fewman
            }

            this.updateChild()
        }
    }
}
</script>

<style scoped>
</style>