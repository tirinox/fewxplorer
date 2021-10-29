<template>
    <h1>Breed Emulator V2</h1>
    <hr>
    <FewvulationBlock :is-testnet="false" @update-next-id="updateNextId"></FewvulationBlock>
    <hr>
    <div class="row m-1">
        <div class="col-xl-4 col-lg-4 col-md-6 mb-4">
            <div class="mb-2">
                <PickParent f="F1" @id-change="updateFew" :loading="f1.loading" :is-error="f1.error"></PickParent>
            </div>
            <FewmanCard :fewman="f1.fewman" v-if="!!f1.fewman" hide-breeding="1"></FewmanCard>
            <div v-else class="text-danger">Not found...</div>
        </div>

        <div class="col-auto d-flex flex-column justify-content-center align-items-center">
            <h2>+</h2>
        </div>

        <div class="col-xl-4 col-lg-4 col-md-6 mb-4">
            <div class="mb-2">
                <PickParent f="F2" @id-change="updateFew" :loading="f2.loading" :is-error="f2.error"></PickParent>
            </div>

            <FewmanCard :fewman="f2.fewman" v-if="!!f2.fewman" hide-breeding="1"></FewmanCard>
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
</template>

<script>

import FewmanCard from "./FewmanCard.vue";
import {fewmanDB} from "../data/provider";
import PickParent from "./PickParent.vue";
import useBreedingState from "../data/breed.js";
import {gen0fewman} from "../data/personality";
import LoadView from "./LoadView.vue";
import {loadFewmanFromContractsById, setupInfura} from "../data/contract";
import {Config} from "../data/config";
import FewvulationBlock from "./FewvulationBlock.vue";

const breed = useBreedingState()

export default {
    name: "BreedEmulatorPageV2",
    components: {FewvulationBlock, LoadView, PickParent, FewmanCard},
    data() {
        return {
            f1: {
                fewman: null,
                loading: false,
                error: false,
                tokenId: -1,
            },
            f2: {
                fewman: null,
                loading: false,
                error: false,
                tokenId: -1,
            },
            resultFewman: null,
            whyReason: '',
            needGold: 0,
            outGold: 0,
            autoUpdaterTimer: null,
            nextId: 0,
        }
    },
    beforeMount() {
        setupInfura(this.$route.params.infura)
    },
    mounted() {
        this.loadFewmansFromRoute().then(() => {})
        if(Config.AUTO_UPDATE_TIME) {
            console.log(`BreedEmulatorPageV2: Set up timer for update: ${Config.AUTO_UPDATE_TIME} ms.`)
            this.autoUpdaterTimer = setInterval(() => {
                this.autoUpdate().then(() => {})
            }, Config.AUTO_UPDATE_TIME)
        }
    },
    methods: {
        updateNextId(id) {
            this.nextId = +id
        },

        async loadFewmansFromRoute() {
            await this.loadFewman(this.$route.params.f1, 'F1')
            await this.loadFewman(this.$route.params.f2, 'F2')
            this.updateChild()
        },

        async loadFewman(id, f) {
            const fewSide = f === 'F1' ? this.f1 : this.f2
            fewSide.loading = true
            fewSide.error = false
            fewSide.tokenId = id

            const result = await loadFewmanFromContractsById(id, false)

            if(!result.error) {
                fewSide.fewman = result
            } else {
                fewSide.fewman = null
                fewSide.error = true
            }
            fewSide.loading = false
        },

        updateChild() {
            const {child, reason, needGold, outGold} = breed.breed(this.f1.fewman, this.f2.fewman, fewmanDB.nextId)
            this.resultFewman = child
            this.whyReason = reason
            this.needGold = needGold
            this.outGold = outGold
        },

        async updateFew(value, f) {
            await this.loadFewman(value, f)
            this.updateChild()
        },

        async autoUpdate() {
            if(!this.f1.fewman && this.f1.tokenId !== -1) {
                await this.loadFewman(this.f1.tokenId, 'F1')
            }
            if(!this.f2.fewman && this.f2.tokenId !== -1) {
                await this.loadFewman(this.f2.tokenId, 'F2')
            }
        }
    },
    unmounted() {
        if(this.autoUpdaterTimer !== null) {
            clearInterval(this.autoUpdaterTimer)
            console.log('BreedEmulatorPageV2: Cleared auto update timer.')
            this.autoUpdaterTimer = null
        }
    }
}
</script>

<style scoped>
</style>
