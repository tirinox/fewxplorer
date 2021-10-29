<template>
    <div class="col-xl-4 col-lg-4 col-md-6 mb-4">
        <div class="card">
            <div class="card-body">
                <h4>{{ title }}</h4>
                <div v-for="{name, count, percent, stars} of elements" class="telem">
                    <span class="attr-name">
                        <a :href="link(name)" :class="nameClass(name)">{{ name }}</a>
                    </span>
                    <img alt="star" src="/img/star.png" class="star" v-for="_ in stars">

                    <span class="float-end attr-percent">
                        <strong class="attr-count">{{ count }}</strong>
                        ({{ $filters.percentage(percent, 3) }})
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {COUNTER_GENDER, COUNTER_GENERATION, COUNTER_STARS, COUNTER_TIER, fewmanDB} from "../data/provider";
import mitt from "../helpers/mitt";
import {TRAIT_STARS_DIC} from "../data/personality";
import {compare} from "../helpers/util";

export default {
    name: "RarityCard",
    props: ['name'],
    data() {
        return {
            title: '',
            elements: []
        }
    },
    methods: {
        nameClass(n) {
            if (n === 'Female')
                return 'female'
            else if (n === 'Male')
                return 'male'
        },
        link(n) {
            let q = n
            if (this.name === COUNTER_STARS) {
                q = `stars ${n}`
            } else if (this.name === COUNTER_TIER) {
                q = `tier ${n}`
            } else if (this.name === COUNTER_GENERATION) {
                q = `gen ${n}`
            }

            return `/?q=${encodeURI(q)}`
        }
    },
    mounted() {
        mitt.on('data_loaded', () => {
            const traitName = this.name
            const dic = fewmanDB._counters[traitName]
            const traitStartDic = TRAIT_STARS_DIC[traitName]
            const total = fewmanDB.totalFewmans

            if (traitName === COUNTER_GENDER) {
                this.title = 'Gender'
            } else if (traitName === COUNTER_STARS) {
                this.title = 'Total stars'
            } else if (traitName === COUNTER_TIER) {
                this.title = 'Tier'
            } else if (traitName === COUNTER_GENERATION) {
                this.title = 'Generation'
            } else {
                this.title = traitName
            }

            const elements = Object.entries(dic).map(([name, count]) => {
                let stars = traitStartDic ? traitStartDic[name] : 0
                if (traitName === COUNTER_TIER || traitName === COUNTER_STARS) {
                    stars = +name
                    name = stars
                } else if(traitName === COUNTER_GENERATION) {
                    name = `Gen ${name}`
                }
                return {
                    name, count, stars,
                    percent: (count / total) * 100.0
                }
                // [name, count, percent, stars]
            })
            elements.sort((a, b) => compare(a.count, b.count))
            this.elements = elements
        })
    }
}

</script>

<style scoped>

.star {
    height: 10pt;
    margin-bottom: 2pt;
}

.attr-name {
    margin-right: 4pt;
}

.attr-percent {

}

.attr-count {

}

.card {
    border-radius: 0;
}

.telem {
    border-top: 1px solid #eee;
}

</style>