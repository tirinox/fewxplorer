<template>
    <div>
        <h4>
            <mark class="text-danger" v-if="noData">Нет данных о бридинге!</mark>
            <mark class="text-warning" v-if="isFinished">Бридинг прошел!</mark>
            <mark class="text-primary" v-if="isSoon">Скоро бридинг!</mark>
            <mark class="text-success" v-if="isInProgress">Время любви!</mark>
        </h4>

        <span v-if="isSoon">
            Следующий бридинг через {{ test }}
        </span>

        <span v-if="isInProgress">
            Осталось времени {{ test }}
        </span>

        <span v-if="isFinished">
            Во времени окончания бридинга прошло {{ test }}
        </span>

        <div v-if="state.error" class="text-danger">{{ state.error.toString() }}</div>
    </div>
</template>

<script>
import {Config} from "../data/config";
import {loadFewvulationState} from "../data/contract";

export default {
    name: "FewvulationBlock",
    data() {
        return {
            timer: null,
            test: 1,
            state: {},
        }
    },
    computed: {
        isFinished() {
            return !this.noData && this.state.state === 'finished'
        },
        isInProgress() {
            return !this.noData && this.state.state === 'progress'
        },
        isSoon() {
            return !this.noData && this.state.state === 'soon'
        },
        noData() {
            return !this.state || !this.state.state || this.state.error
        }
    },
    methods: {
        async loadDataFromContracts() {
            this.state = await loadFewvulationState(false)
            console.info(`Breeding: ${this.state.state}.`)
        },
        async timerTick() {
            this.test++
            this.state.state = ['finished', 'soon', 'progress'][this.test % 3]
        }
    },
    mounted() {
        this.loadDataFromContracts().then(() => {
        })
        this.timer = setInterval(() => {
            this.timerTick().then(() => {
            })
        }, Config.FEWVULATION_TICK_TIME)
    },
    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    }
}
</script>

<style scoped>

</style>
