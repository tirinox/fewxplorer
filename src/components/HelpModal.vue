<template>
    <div class="modal" tabindex="-1" ref="modalCore">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">FEWxplorer help</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>
                        <strong>There is a FEW rules. See examples:</strong>
                    </p>
                    <ul>
                        <li><span>345</span>&nbsp;<a href="/?q=345">try</a></li>
                        <li><span>male gay president</span>&nbsp;<a href="/?q=male gay president">try</a></li>
                        <li><span>porn addict regular clerk</span>&nbsp;<a href="/?q=porn addict regular clerk">try</a></li>
                        <li><span>red fat medic</span>&nbsp;<a href="/?q=red fat medic">try</a></li>
                        <li><span>not gifted albino</span>&nbsp;<a href="/?q=not gifted albino">try</a></li>
                        <li><span>tier 1</span>&nbsp;<a href="/?q=tier 1">try</a></li>
                        <li><span>stars 4</span>&nbsp;<a href="/?q=stars 4">try</a></li>
                        <li><span>tier 2 tier 3 violet</span>&nbsp;<a href="/?q=tier 2 tier 3 violet">try</a></li>
                        <li><span>star 5 star 6 hetero</span>&nbsp;<a href="/?q=star 5 star 6 hetero">try</a></li>
                    </ul>
                    <p>
                        <strong>Tier 0</strong> = no stars at all<br>
                        <strong>Tier 1</strong> = at least one star<br>
                        <strong>Tier 2</strong> = two stars on attribute<br>
                        <strong>Tier 3</strong> = three stars on attribute<br>
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
a {
    font-family: "Courier New", Courier, monospace;
}
</style>