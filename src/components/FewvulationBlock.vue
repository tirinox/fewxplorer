<template>
    <div class="row">
        <div class="col-4">
            <h4>
                <mark class="text-danger" v-if="noData">No data loaded yet!</mark>
                <mark class="text-warning" v-if="isFinished">Breeding is over!</mark>
                <mark class="text-primary" v-if="isSoon">Breeding is soon!</mark>
                <mark class="text-success" v-if="isInProgress">Love time!</mark>
            </h4>

            <span v-if="isSoon">
                Next Fewvulation in <span class="display-5">{{ nextEventTime }}</span>.
            </span>

            <span v-if="isInProgress">
                Fewvulation remaining time: <span class="display-6">{{ nextEventTime }}</span>.
            </span>
            <span v-if="isFinished">
                Since last Fewvulation:<br>
                <span class="display-5">{{ nextEventTime }}</span><br>
                When will be the next? I don't know. Wait for an announcement.
            </span>

            <div v-if="state.error" class="text-danger">{{ state.error.toString() }}</div>
        </div>
        <div class="col-auto">
            <h5>
                The next child will be probably
            </h5>

            <div class="spinner-border spinner-border-sm float-end" v-if="childLoading"></div>
            <div class="d-inline display-6">
                <kbd class="male" v-if="nextIsMale">Male</kbd>
                <kbd class="female" v-else>Female</kbd>
            </div>
            <br>
            <span class="display-6"><strong>#{{ nextTokenId }}</strong></span>

            <div v-if="childError" class="text-danger">{{ childError.toString() }}</div>

        </div>
    </div>
</template>

<script>
import {Config} from "../data/config";
import {loadFewvulationState, loadLastGeneratedTokenId} from "../data/contract";
import {agoTS, countdownFormat, nowTS, nowTS_UTC} from "../helpers/util";

export default {
    name: "FewvulationBlock",
    props: ['isTestnet'],
    emits: ['updateNextId'],
    data() {
        return {
            timer: null,
            state: {},
            lastLoadedFewvulationTS: 0,
            loadingFewvulation: false,
            nextTokenId: 10555,
            childLoading: false,
            childError: null,
            childLastLoadTS: 0,
            pendel: 0,
        }
    },
    computed: {
        isFinished() {
            return !this.noData && this.state.state === 'finished'
        },
        isInProgress() {
            return !this.noData && this.state.state === 'active'
        },
        isSoon() {
            return !this.noData && this.state.state === 'soon'
        },
        noData() {
            return !this.state || !this.state.state || this.state.error
        },
        nextEventTime() {
            if (!this.state.nextEventTS) {
                return 'unknown'
            }
            this.pendel;
            // let s = agoTS(this.state.nextEventTS)
            // if (!this.isFinished) {
            //     s = s.replace(' ago', '')
            // } else {
            //     s = countdownFormat(Math.abs(nowTS() - this.state.nextEventTS))
            // }
            return countdownFormat(Math.abs(nowTS() - this.state.nextEventTS))
        },
        nextIsMale() {
            return this.nextTokenId % 2 === 1
        },
    },
    methods: {
        async loadDataFromContracts() {
            if (!this.loadingFewvulation) {
                this.loadingFewvulation = true
                console.info('Loading Fewvulation state...')
                this.state = await loadFewvulationState(Boolean(this.isTestnet))
                this.loadingFewvulation = false
                console.info(`Fewvulation state loaded: ${JSON.stringify(this.state)}.`)
            }
        },

        async loadNextChild() {
            this.childLoading = true
            this.childError = null

            console.log('loadNextChild...')

            const lastId = await loadLastGeneratedTokenId(Boolean(this.isTestnet))
            if(lastId.error) {
                this.childError = lastId.error
            } else {
                this.nextTokenId = (lastId + 1)
            }

            this.$emit('updateNextId', this.nextTokenId)

            console.log('lastId = ', lastId)

            this.childLoading = false
        },

        async timerTick() {
            this.pendel++
            if (nowTS_UTC() > this.lastLoadedFewvulationTS + Config.FEWVULATION_AUTO_UPDATE_TIME) {
                await this.loadDataFromContracts()
                this.lastLoadedFewvulationTS = nowTS_UTC()
            }

            if(this.isInProgress) {
                if(this.childLastLoadTS + Config.FEWVULATION_CHILD_UPDATE_TIME < nowTS_UTC()) {
                    this.childLastLoadTS = nowTS_UTC()
                    await this.loadNextChild()
                }
            }
        },
    },
    mounted() {
        this.loadNextChild()
        this.timer = setInterval(() => {
            this.timerTick().then(() => 1)
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
kbd {
    font-family: 'Press Start 2P', sans-serif;
}
</style>
