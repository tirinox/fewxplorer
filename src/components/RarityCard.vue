<template>
    <div class="col-xl-4 col-lg-4 col-md-6 mb-4">
        <div class="card">
            <div class="card-body">
                <h4>{{ title }}</h4>
                <div v-for="[name, count, percent, stars] of elements" class="telem">
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
import {FewmanDB, TRAIT_NAMES} from "../data/provider";

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
            if (this.name === 'stars') {
                q = `stars ${n}`
            } else if (this.name === 't') {
                q = `tier ${n}`
            }

            return `/?q=${encodeURI(q)}`
        }
    },
    mounted() {
        this.title = TRAIT_NAMES[this.name]
        this.elements = FewmanDB.attrRarities(this.name)
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