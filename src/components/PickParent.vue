<template>
    <h5>{{ f }}: Choose a Fewman</h5>
    <small>You can also pick him/her at the Explorer tab by pressing <strong>{{ f }}</strong> button.</small>
    <input type="text"
           ref="idInput"
           v-model="fewmanIdStr"
           v-debounce.lock:450="doSearch"
           :class="{'is-invalid': isError}"
           placeholder="Enter Token ID..."
           class="form-control rect"
    />
</template>

<script>
export default {
    name: "PickParent",
    props: ['f'],
    emits: ['id-change'],
    data() {
        return {
            fewmanIdStr: '',
            isError: false,
        }
    },
    methods: {
        doSearch() {
            let id = null
            try {
                id = parseInt(this.fewmanIdStr)
            } catch {}
            this.$emit('id-change', id, this.f)
        }
    }
}
</script>

<style scoped>
    .rect {
        border-radius: 0 !important;
    }
</style>