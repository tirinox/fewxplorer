<template>
    <div class="row">
        <div class="col-4">
            <h4>
                <mark class="text-danger" v-if="noData">Нет данных о бридинге!</mark>
                <mark class="text-warning" v-if="isFinished">Бридинг прошел!</mark>
                <mark class="text-primary" v-if="isSoon">Скоро бридинг!</mark>
                <mark class="text-success" v-if="isInProgress">Время любви!</mark>
            </h4>

            <span v-if="isSoon">
                Следующий бридинг через {{ nextEventTime }}.
            </span>

            <span v-if="isInProgress">
                Осталось времени {{ nextEventTime }}.
            </span>
            <span v-if="isFinished">
                Во времени окончания бридинга прошло {{ nextEventTime }}. Когда следующий? Не знаю.
            </span>

            <div v-if="state.error" class="text-danger">{{ state.error.toString() }}</div>
        </div>
        <div class="col-auto">
            <h4>
                Следующий ребенок:
            </h4>

            <div class="spinner-border spinner-border-sm float-end" v-if="childLoading"></div>
            <div class="d-inline">
                <kbd class="male" v-if="nextIsMale">Мальчик</kbd>
                <kbd class="female" v-else>Девочка</kbd>
                <span> #{{ nextTokenId }}</span>
            </div>

            <div v-if="childError" class="text-danger">{{ childError.toString() }}</div>

            <div v-if="pendingTxCount === 0">Вроде бы никто не бридит сейчас.
                <strong>Высокая вероятность угадать пол.</strong>
            </div>
            <div v-else>Сейчас {{ pendingTxCount}} транзакций в ожидании бридинга.
                <strong>Низкая вероятность угадать пол!</strong>
            </div>

            <div v-if="pendingError" class="text-danger">
                Ошибка! Не удалось загрузить инфо об ожидающих транзакциях бридинга
            </div>

        </div>
    </div>
</template>

<script>
import {Config} from "../data/config";
import {
    getPendingBreedingTXS,
    loadFewvulationState,
    loadLastGeneratedTokenId
} from "../data/contract";
import {agoTS, nowTS} from "../helpers/util";

export default {
    name: "FewvulationBlock",
    props: ['isTestnet'],
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
            pendingError: null,
            pendingTxCount: 0,
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
                return 'неизвестно'
            }
            let s = agoTS(this.state.nextEventTS)
            if (!this.isFinished) {
                s = s.replace(' ago', '')
            }
            return s
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

            console.log(lastId)

            await this.loadPendingTXS()

            this.childLoading = false
        },

        async loadPendingTXS() {
            this.pendingError = null
            const r = await getPendingBreedingTXS(Boolean(this.isTestnet))
            if(r.error) {
                this.pendingError = r.error
                console.error(`Pending TX error: ${r.error}`)
            } else {
                this.pendingTxCount = r.length
                console.info(`Pending TX count: ${r.length}`)
            }
        },

        async timerTick() {
            if (nowTS() > this.lastLoadedFewvulationTS + Config.FEWVULATION_AUTO_UPDATE_TIME) {
                await this.loadDataFromContracts()
                this.lastLoadedFewvulationTS = nowTS()
            }

            if(this.isInProgress) {
                if(this.childLastLoadTS + Config.FEWVULATION_CHILD_UPDATE_TIME < nowTS()) {
                    this.childLastLoadTS = nowTS()
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

</style>
