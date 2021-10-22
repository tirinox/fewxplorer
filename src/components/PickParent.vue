<template>
    <div class="spinner-grow" v-if="loading"></div>
    <h5>{{ f }}: Choose a Fewman</h5>
    <small v-if="breedPicking">
        You can also pick him/her at the Explorer tab by pressing <strong>{{ f }}</strong> button.
    </small>
    <input type="text"
           ref="idInput"
           v-model="fewmanIdStr"
           v-debounce.lock:800="doSearch"
           :class="{'is-invalid': isError}"
           placeholder="Enter Token ID..."
           class="form-control rect"
    />
</template>

<script>
export default {
    name: "PickParent",
    props: ['f', 'isError', 'loading'],
    emits: ['id-change'],
    data() {
        return {
            fewmanIdStr: '',
            prevIdStr: '',
        }
    },
    computed: {
        breedPicking() {
            return this.f === 'F1' || this.f === 'F2'
        }
    },
    methods: {
        emitChange() {
            if(this.fewmanIdStr === this.prevIdStr) {
                return
            } else {
                this.prevIdStr = this.fewmanIdStr
            }
            let id = null
            try {
                id = parseInt(this.fewmanIdStr)
                this.$emit('id-change', id, this.f)
            } catch {}
        },
        doSearch() {
            this.emitChange()
        },
        autoUpdate() {
            this.emitChange()
        }
    }
}
</script>

<style scoped>
    .rect {
        border-radius: 0 !important;
    }
</style>
