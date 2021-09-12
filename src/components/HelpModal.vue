<template>
    <div class="modal" tabindex="-1" ref="modalCore">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">FEWxplorer help</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h6>
                        Examples:
                    </h6>
                    <ul>
                        <li><span>male gay president</span></li>
                        <li><span>porn addict regular clerk</span></li>
                        <li><span>red fat medic</span></li>
                        <li><span>not gifted albino</span></li>
                    </ul>
                    <p>
                        <strong>Tier 0</strong> = no stars at all<br>
                        <strong>Tier 1</strong> = at least one star<br>
                        <strong>Tier 2</strong> = two stars on one attribute<br>
                        <strong>Tier 3</strong> = three start on one attribute<br>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { Modal } from 'bootstrap'

export default {
    name: "HelpModal",
    data() {
        return {
            isOn: false
        }
    },
    methods: {
        showHelp() {
            this.modal.show()
        }
    },
    mounted() {
        this.modal = new Modal(this.$refs.modalCore)
    }
}
</script>

<style scoped>

</style>