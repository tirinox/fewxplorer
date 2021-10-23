<template>
    <div class="card rect">
        <div
            class="price-tag"
            v-if="!isTest && price > 0"
            :class="{'price-bid': !buyNow}"
        >
            <span>{{ price }}
                <span v-if="buyNow">Eth!</span>
                <span v-else>Eth?</span>
            </span>
        </div>
        <div class="card-header rect">
            <div class="float-end gender">
                <span class="female gender" v-if="isFem">Female</span>
                <span class="male gender" v-else>Male</span>
            </div>

            <div class="float-end few-tier gender gen">
                Gen {{ sourceFewman.generation }}
            </div>

            <div class="float-end few-tier gender">
                Tier {{ sourceFewman.tier }}
            </div>

            <h6 class="few-title" v-if="child && isChildNow">
                #{{ fewman.id }}'s child
            </h6>
            <h6 class="few-title" v-else>
                Fewman #{{ fewman.id }}
            </h6>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col col-6">
                    <span class="col-head">APPEARANCE</span>
                </div>
                <div class="col col-6">
                    <span class="col-head">ATTRIBUTES</span>
                </div>
            </div>
            <div class="row" v-for="i in [0, 1, 2, 3]">
                <div class="col col-6 attr">
                    <div class="py-1">
                        <span class="attr-head">{{ leftNames[i] }}</span><br>
                        <span class="attr-val">
                            {{ paramName(leftNames[i]) }}
                            <img alt="star" src="/img/star.png" class="star" v-for="_ in paramStars(leftNames[i])">
                        </span>
                    </div>
                </div>
                <div class="col col-6 attr">
                    <div class="py-1">
                        <span class="attr-head">{{ rightNames[i] }}</span><br>
                        <span class="attr-val">
                            {{ paramName(rightNames[i]) }}
                            <img alt="star" src="/img/star.png" class="star" v-for="_ in paramStars(rightNames[i])">
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer footer-2">
            <div class="total float-end">
                <div v-if="sourceFewman.stars > 0">
                    Total {{ sourceFewman.stars }}<img alt="star" src="/img/star.png" class="star">
                </div>
                <div v-else>
                    Common
                </div>
            </div>
            <div class="total">
                {{ $filters.percentage(rarity, 3) }}
            </div>
        </div>
        <div class="card-footer">
            <a :href="linkOpenSea" target="_blank" v-if="!isTest">
                    <span v-if="price > 0">
                        <span v-if="buyNow" class="text-success">
                            Buy
                        </span>
                        <span v-else class="text-primary">
                            Bid
                        </span>
                    </span>
                <span v-else>OpenSea</span>
            </a>

            <span v-if="!isChildNow && !dead">
                ▪ <a :href="linkScan" target="_blank">Scan</a>
            </span>

            <span v-if="child && !isChildNow">
                ▪ <a @click="isChildNow = true">Child</a>
            </span>

<!--            <span v-if="!child && !dead && !isTest">-->
<!--                ▪-->
<!--                <router-link :to="'/match/' + fewman.id">Match</router-link>-->
<!--            </span>-->

            <span v-if="!hideBreeding && !isChildNow && !isTest">
                ▪
                <a @click="setF1">
                    <span v-if="globalF1 === fewman.id">✔️</span>F1
                </a>
                <router-link :to="'/breedem/' + globalF1 + '/' + fewman.id" v-if="globalF1 !== fewman.id && !hideF2">
                    ▪
                    F2
                </router-link>
            </span>
        </div>
    </div>
</template>

<script>

import {fewmanDB} from "../data/provider";
import useBreedingState from "../data/breed";
import {Config} from "../data/config";


const state = useBreedingState()

const LEFT_NAMES = [
    'Hair', 'Eyes', 'Body', 'Sexuality'
]

const RIGHT_NAMES = [
    'Intelligence', 'Career', 'Curse', "God's gift"
]

export default {
    name: "FewmanCard",
    props: ['fewman', 'child', 'hideBreeding', 'dead', 'isTest', 'hideF2'],
    emits: ['setF1'],
    data() {
        return {
            isChildNow: false,
            price: 0.0,
            buyNow: false,
        }
    },
    computed: {
        isFem() {
            return this.sourceFewman.gender === 'Female'
        },
        leftNames() {
            return LEFT_NAMES
        },
        rightNames() {
            return RIGHT_NAMES
        },
        rarity() {
            return fewmanDB.rarityByStar(this.sourceFewman)
        },
        sourceFewman() {
            return this.isChildNow ? this.child : this.fewman
        },
        contract() {
            return this.isTest ? Config.FEWMANS_CONTRACT_TEST : Config.FEWMANS_CONTRACT;
        },
        linkOpenSea() {
            if(this.isTest) {
                return null
            }
            return `https://opensea.io/assets/${this.contract}/${this.fewman.id}`
        },
        linkScan() {
            if(this.isTest) {
                return `https://ropsten.etherscan.io/token/${this.contract}?a=${this.fewman.id}`
            } else {
                return `https://etherscan.io/token/${this.contract}?a=${this.fewman.id}`
            }
        },
        globalF1() {
            return state.f1TokenId.value
        }
    },
    methods: {
        paramName(n) {
            return this.sourceFewman.traits[n][0]
        },
        paramStars(n) {
            return this.sourceFewman.traits[n][1]
        },
        setF1() {
            state.setF1(this.sourceFewman.id)
            console.log('Set F1', state.f1TokenId.value)
            this.$emit('setF1', state.f1TokenId.value)
        }
    },
    mounted() {
        const priceData = fewmanDB.getPriceInfo(this.fewman.id)
        if (priceData) {
            this.price = priceData.price
            this.buyNow = priceData.buyNow && priceData.m
        }
    }
}
</script>

<style scoped>

a {
    font-size: 12pt;
}

.gender {
    font-size: 8pt;
    font-family: 'Press Start 2P', sans-serif;
}

.card-header {
    padding-top: 20px;
}

.col-head {
    font-size: 8pt;
    font-family: 'Press Start 2P', sans-serif;
    color: #666;
}

.attr-head {
    color: #999;
}

.attr-val {
    color: #111;
}

.attr {
    font-family: "Courier New", Courier, monospace;
    font-size: 10pt;
    font-weight: bold;
    line-height: 110%;
}

.card-header {
    background-color: #222;
}

.few-title {
    color: white;
}

.few-tier {
    margin-right: 10px;
    color: #ddd;
}

.card-footer {
    height: 40px;
}

.star {
    height: 10pt;
    margin-bottom: 2pt;
}

.total {
    font-family: "Courier New", Courier, monospace;
    font-size: 10pt;
    color: #664;
}

.footer-2 {
    background-color: #fefefe;
}

.price-tag {
    position: absolute;
    background: red;
    left: -5%;
    top: -4%;
    color: white;
    padding: 3pt;
    font-size: 10pt;
    font-weight: bold;
    transform: rotate(-10deg);
}

.price-bid {
    background-color: #0a53be;
}

.gen {
    color: #fff8c8;
}

</style>