<template>
    <div class="col-xl-4 col-lg-4 col-md-6 mb-4">
        <div class="card">
            <div
                class="price-tag"
                v-if="price > 0"
                :class="{'price-bid': !buyNow}"
            >
                <span>{{ price }}
                    <span v-if="buyNow">Eth!</span>
                    <span v-else>Eth?</span>
                </span>
            </div>
            <div class="card-header">
                <div class="float-end gender">
                    <span class="female gender" v-if="isFem">Female</span>
                    <span class="male gender" v-else>Male</span>
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
                                {{ paramName(i) }}
                                <img alt="star" src="/img/star.png" class="star" v-for="_ in paramStars(i)">
                            </span>
                        </div>
                    </div>
                    <div class="col col-6 attr">
                        <div class="py-1">
                            <span class="attr-head">{{ rightNames[i] }}</span><br>
                            <span class="attr-val">
                                {{ paramName(i + 4) }}
                                <img alt="star" src="/img/star.png" class="star" v-for="_ in paramStars(i + 4)">
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
                    {{ Math.round(rarity * 100.0) / 100.0 }} %
                </div>
            </div>
            <div class="card-footer">
                <p>
                    <a :href="linkOpenSea" target="_blank">
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
                    ▪
                    <a :href="linkScan" target="_blank">Scan</a>
                    ▪
                    <a @click="isChildNow = false" v-if="isChildNow">Back</a>
                    <router-link :to="'/match/' + fewman.id" v-if="!child">Match</router-link>
                    <a @click="isChildNow = true" v-if="child && !isChildNow">Child?</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>

import {FewmanDB} from "../data/provider";
import {FEWMANS_CONTRACT} from "../data/opensea";

const LEFT_NAMES = [
    'Hair', 'Eyes', 'Body', 'Sexuality'
]

const RIGHT_NAMES = [
    'Intelligence', 'Career', 'Curse', "God's gift"
]

export default {
    name: "FewmanCard",
    props: ['fewman', 'child'],
    data() {
        return {
            isChildNow: false,
            price: 0.0,
            buyNow: false,
        }
    },
    computed: {
        isFem() {
            return this.sourceFewman.p[0] === 'Female'
        },
        leftNames() {
            return LEFT_NAMES
        },
        rightNames() {
            return RIGHT_NAMES
        },
        rarity() {
            return FewmanDB.rarityByStar(this.sourceFewman)
        },
        sourceFewman() {
            return this.isChildNow ? this.child : this.fewman
        },
        linkOpenSea() {
            return `https://opensea.io/assets/${FEWMANS_CONTRACT}/${this.fewman.id}`
        },
        linkScan() {
            return `https://etherscan.io/token/${FEWMANS_CONTRACT}?a=${this.fewman.id}`
        }
    },
    methods: {
        paramName(i) {
            return this.sourceFewman.p[i * 2 + 1]
        },
        paramStars(i) {
            return this.sourceFewman.p[i * 2 + 2]
        },
    },
    mounted() {
        const priceData = FewmanDB.getPriceInfo(this.fewman.id)
        if(priceData) {
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

.female {
    color: #F973D9;
}

.male {
    color: #00BECA;
}

.gender {
    font-size: 8pt;
    font-family: 'Press Start 2P', sans-serif;
}

.card-header {
    padding-top: 20px;
}

.eth-text {
    font-weight: bold;
    font-size: 12pt;
}

.eth {
    height: 12pt;
    padding-bottom: 2pt;
    padding-left: 2pt;
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

.card {
    border-radius: 0;
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

</style>