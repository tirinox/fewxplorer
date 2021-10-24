<template>
    <h1>Best Pairs Calc</h1>
    <em>Только члены тайного Ордена допущены в это Святилище!</em>
    <p>Этот инструмент подберет лучшие пары из вашего адреса.</p>

    <hr>

    <FewvulationBlock :is-testnet="false" @update-next-id="updateNextId"></FewvulationBlock>

    <hr>

    <div>
        <span class="spinner-border spinner-border-sm" v-if="loading"></span>
        <h6>Сначала введите адрес:</h6>
    </div>

    <div class="input-group">
        <input type="text"
               ref="idInput"
               v-model="address"
               v-debounce.lock:800="doSearch"
               :class="{'is-invalid': isError}"
               placeholder="Введите адрес 0x..."
               class="form-control rect"
        />
        <div class="input-group-append">
            <button class="btn btn-danger rect" @click="clearQuery" v-show="this.address.length > 0">X</button>
            <button class="btn btn-secondary rect" @click="refreshButton">Обнови</button>
        </div>
    </div>

    <div v-if="loaded && !isFavoriteSelected" class="mt-4">
        <h6>Выберите Фьюмана за основу, мы подберем ему пары из остальных:</h6>
        <div class="row m-1 mt-4">

            <div class="col-xl-4 col-lg-4 col-md-6 mb-4" v-for="tokenId in tokenIds" :key="tokenId">
                <FewmanCardAutoLoad :token-id="tokenId" @setF1="setF1" @loaded="loadedFew"></FewmanCardAutoLoad>
            </div>
            <div class="text-center" v-if="!tokenIds.length">
                <h2 class="m-4">На этом адресе нет Fewmans.</h2>
            </div>
        </div>
    </div>

    <div v-if="isFavoriteSelected" class="m-1 mt-4">
        <hr>

        <div>
            <h5 class="p-1">Вы выбрали этого как F1: #{{ f1Id }}</h5>
            <button class="btn btn-warning rect center" @click="clearF1">
                <strong>Выбрать другого?</strong>
            </button>
        </div>

        <hr>
        <h5>Лучшие пары:</h5>
        <div class="row" v-for="{f1Fewman, f2Fewman, child} of pairFewmans">
            <div class="col-xl-3 col-lg-3 col-md-6 mb-4">
                <FewmanCard :fewman="f1Fewman" :hide-breeding="true"></FewmanCard>
            </div>
            <div class="col-auto d-flex flex-column justify-content-center align-items-center">
                <h2>+</h2>
            </div>
            <div class="col-xl-3 col-lg-3 col-md-6 mb-4">
                <FewmanCard :fewman="f2Fewman" :hide-breeding="true"></FewmanCard>
            </div>
            <div class="col-auto d-flex flex-column justify-content-center align-items-center">
                <h2>=</h2>
            </div>
            <div class="col-xl-3 col-lg-3 col-md-6 mb-4">
                <FewmanCard :fewman="child" :hide-breeding="true"></FewmanCard>
            </div>
        </div>
        <div class="text-center" v-if="!pairFewmans.length">
            <h2 class="m-4 text-danger">Нет доступных пар!</h2>
        </div>
        <hr>
    </div>
</template>

<script>

import {fewmanDB} from "../data/provider";
import FewmanCardAutoLoad from "./FewmanCardAutoLoad.vue";
import {setupInfura} from "../data/contract";
import useBreedingState from "../data/breed";
import FewmanCard from "./FewmanCard.vue";
import FewvulationBlock from "./FewvulationBlock.vue";

const breedState = useBreedingState()

const LS_ADDRESS_KEY = 'BestPairsPageR-add'

export default {
    name: "BestPairsPageR",
    components: {FewvulationBlock, FewmanCardAutoLoad, FewmanCard},
    data() {
        return {
            isError: false,
            address: '',
            prevAddress: '',
            loading: false,
            loaded: false,
            results: [],
            tokenIds: [],
            isFavoriteSelected: false,
            f1Id: 0,
            pairFewmans: [],
            nextId: 0,
        }
    },
    methods: {
        updateNextId(id) {
            this.nextId = +id
        },
        clearQuery() {
            this.address = ''
            this.loaded = false
            this.isFavoriteSelected = false
            breedState.setF1(null)
        },
        async refreshButton() {
            await this.reload(this.address)
        },
        async doSearch() {
            const address = this.address.trim()
            if (address !== this.prevAddress) {
                this.prevAddress = address
                await this.reload(address)
            }
        },
        async reload(address) {
            console.info(`BestPairsPageR: address loading: ${address}`)
            localStorage.setItem(LS_ADDRESS_KEY, address)

            breedState.setF1(null)
            this.isFavoriteSelected = false
            this.loaded = false
            this.loading = true
            this.tokenIds = [...(await fewmanDB.loadTokensOfAddress(address))]
            this.tokenIds.sort((a, b) => (b - a))
            this.loading = false
            this.loaded = true
            console.log(`tokenIds of ${address} are `, this.tokenIds)
        },
        setF1(f1) {
            if (this.loaded) {
                this.isFavoriteSelected = true
                this.f1Id = f1
                this.makePairs()
            }
        },
        clearF1() {
            this.isFavoriteSelected = false
            breedState.setF1(null)
        },
        loadedFew() {
        },
        makePairs() {
            this.pairFewmans = []
            const f1Fewman = FewmanCardAutoLoad.getFewmanFromCache(this.f1Id, false)
            if(!f1Fewman) {
                console.warn(`F1 = ${this.f1Id} has now cached fewman!`)
                return
            }

            for(const tokenId of this.tokenIds) {
                if(tokenId === this.f1Id) {
                    continue
                }
                const f2Fewman = FewmanCardAutoLoad.getFewmanFromCache(tokenId, false)
                if(!f2Fewman) {
                    console.warn(`F2 = ${tokenId} has now cached fewman!`)
                }

                const {child, reason, needGold, outGold} = breedState.breed(f1Fewman, f2Fewman, this.nextId)
                if(child) {
                    this.pairFewmans.push({f1Fewman, f2Fewman, child})
                }
            }
            this.pairFewmans.sort(function(a, b) {
                return b.child.stars - a.child.stars
            })
            console.info(this.pairFewmans)
        }
    },
    beforeMount() {
        setupInfura(this.$route.params.infura)
    },
    mounted() {
        breedState.setF1(null)
        const preAddress = (this.$route.params.address || localStorage.getItem(LS_ADDRESS_KEY) || '').trim()
        if (preAddress !== '' && preAddress.startsWith('0x')) {
            this.address = preAddress
            this.doSearch()
        }
    },
}
</script>

<style scoped>

</style>