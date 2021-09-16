<template>
    <div class="col-xl-4 col-lg-4 col-md-6 mb-4">
        <div class="card">
            <div class="card-header">
                <div class="float-end gender">
                    <span class="female gender" v-if="isFem">Female</span>
                    <span class="male gender" v-else>Male</span>
                </div>
                <div class="float-end few-tier gender">
                    Tier {{ fewman.tier }}
                </div>
                <h6 class="few-title">Fewman #{{ fewman.id }}</h6>
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
                        <div class="pt-2">
                            <span class="attr-head">{{ leftNames[i] }}</span><br>
                            <span class="attr-val">
                                {{ paramName(i) }}
                                <img alt="star" src="/img/star.png" class="star" v-for="_ in paramStars(i)">
                            </span>
                        </div>
                    </div>
                    <div class="col col-6 attr">
                        <div class="pt-2">
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
                        <div v-if="fewman.stars > 0">
                            Total {{ fewman.stars }}<img alt="star" src="/img/star.png" class="star">
                        </div>
                        <div v-else>
                            Common
                        </div>
                    </div>

            </div>
            <div class="card-footer">
                <p>
                    <a :href="'https://opensea.io/assets/0xad5f6cdda157694439ef9f6dd409424321c74628/'+ fewman.id"
                       target="_blank">Buy</a>
                    ▪
                    <a :href="'https://etherscan.io/token/0xad5f6cdda157694439ef9f6dd409424321c74628?a=' + fewman.id"
                       target="_blank" >Scan</a>
                    ▪
                    <router-link :to="'/match/' + fewman.id">Match</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>

const LEFT_NAMES = [
    'Hair', 'Eyes', 'Body', 'Sexuality'
]

const RIGHT_NAMES = [
    'Intelligence', 'Career', 'Curse', "God's gift"
]

export default {
    name: "FewmanCard",
    props: ['fewman'],
    computed: {
        isFem() {
            return this.fewman.p[0] === 'Female'
        },
        leftNames() {
            return LEFT_NAMES
        },
        rightNames() {
            return RIGHT_NAMES
        }
    },
    methods: {
        paramName(i) {
            return this.fewman.p[i * 2 + 1]
        },
        paramStars(i) {
            return this.fewman.p[i * 2 + 2]
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
    font-family: 'Press Start 2P', sans-serif ;
}

.card-header {
    padding-top: 20px;
}

.col-head {
    font-size: 8pt;
    font-family: 'Press Start 2P', sans-serif ;
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

</style>