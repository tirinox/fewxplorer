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
                        <li><code>"345"</code>(search by token ID)&nbsp;<a href="/?q=345">👉 try</a></li>
                        <li><code>"male gay president"</code>&nbsp;<a href="/?q=male gay president">👉 try</a></li>
                        <li><code>"porn addict regular clerk"</code>&nbsp;<a href="/?q=porn addict regular clerk">👉 try</a></li>
                        <li><code>"red fat medic"</code>&nbsp;<a href="/?q=red fat medic">👉 try</a></li>
                        <li><code>"not gifted albino"</code>&nbsp;<a href="/?q=not gifted albino">👉 try</a></li>
                        <li><code>"tier 1"</code>&nbsp;<a href="/?q=tier 1">👉 try</a></li>
                        <li><code>"stars 4"</code>&nbsp;<a href="/?q=stars 4">👉 try</a></li>
                        <li><code>"tier 2 tier 3 violet"</code>&nbsp;<a href="/?q=tier 2 tier 3 violet">👉 try</a></li>
                        <li><code>"star 5 star 6 hetero"</code>&nbsp;<a href="/?q=star 5 star 6 hetero">👉 try</a></li>
                        <li><code>"gen 3"</code>(search by generation)&nbsp;<a href="/?q=gen 3">👉 try</a></li>
                        <li><code>"0x4d9d3e18ed6f62018a84d654201938b78689399a"</code>(search by address)&nbsp;
                            <a href="/?q=0x4d9d3e18ed6f62018a84d654201938b78689399a">👉 try</a></li>
                    </ul>
                    <p class="small">
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