<script>
import Explorer from './components/Explorer.vue'
import mitt, {EVENTS} from "./helpers/mitt";
import {fewmanDB} from "./data/provider";
import LoadView from "./components/LoadView.vue";
import {Config} from "./data/config";
import {setupInfura} from "./data/contract";

export default {
    name: "App",
    components: {Explorer, LoadView},
    data() {
        return {
            scTimer: 0,
            scY: 0,
            loading: false,
        }
    },
    methods: {
        handleScroll: function () {
            if (this.scTimer) {
                return;
            }
            this.scTimer = setTimeout(() => {
                this.scY = window.scrollY;
                clearTimeout(this.scTimer);
                this.scTimer = 0;
            }, 100);
        },
        toTop: function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },

        updateData() {
            this.loading = true
            fewmanDB.updateIfNeeded().finally(() => {
                this.loading = false
                mitt.emit('data_loaded')
                console.log('FewmanDB data loaded!')
            })
        }
    },
    computed: {
        linkHolders() {
            return `https://etherscan.io/token/${Config.FEWMANS_CONTRACT}#balances`
        },
        linkContract() {
            return `https://etherscan.io/address/${Config.FEWMANS_CONTRACT}`
        },
        linkBreed() {
            return `https://etherscan.io/address/${Config.FEWMANS_BREED_CONTRACT}#writeContract`
        },
    },
    watch: {
        $route(to, from) {
            this.updateData()
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
        mitt.on(EVENTS.SCROLL_TOP, this.toTop)
        this.updateData()
    },
    onUnmounted() {
        window.removeEventListener("scroll", this.handleScroll)
    },
}

</script>

<template>
    <div class="container-fluid min-vh-100">
        <LoadView v-if="loading"></LoadView>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <router-link class="navbar-brand" to="/">
                    <img class="img-fluid logo" src="/img/logo-few.png" alt="Project Logo">
                    FEWxplorer
                </router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/">Search</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/rarity">Rarity</router-link>
                        </li>


                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                               data-bs-toggle="dropdown" aria-expanded="false">
                                BreedEm
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown_breed">
                                <li>
                                    <router-link class="dropdown-item" to="/breedem">Simple</router-link>
                                </li>
                                <li>
                                    <router-link class="dropdown-item" to="/our-best-pairs">Best pairs</router-link>
                                </li>
                            </ul>
                        </li>


                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown_links" role="button"
                               data-bs-toggle="dropdown" aria-expanded="false">
                                Links
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="https://www.fewmans.com/" target="_blank">Main
                                    site</a></li>
                                <li><a class="dropdown-item" href="https://opensea.io/collection/fewmans"
                                       target="_blank">Open Sea</a></li>
                                <li><a class="dropdown-item" :href="linkContract" target="_blank">Contract</a></li>
                                <li><a class="dropdown-item" :href="linkBreed" target="_blank">Breeding contract</a></li>
                                <li><a class="dropdown-item" :href="linkHolders" target="_blank">Holders</a></li>
                                <li><a class="dropdown-item"
                                       href="https://etherscan.io/token/0x60e46a4dd91d10506d8efa2caa266e7191fe7ea8"
                                       target="_blank">FEWGold</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <button
            type="button"
            class="btn btn-danger btn-floating btn-lg"
            id="btn-back-to-top"
            v-show="scY > 300"
            @click="toTop"
        >
            <span id="top-text">TOP</span>
        </button>

        <router-view/>

        <footer class="page-footer font-small pt-4 pb-5">
            <div class="container-fluid text-center text-md-left">
                <div class="row">
                    <div class="col-md-12 mt-md-0 mt-3 pb-3">
                    <span>
                    <strong>© 2021 FEW community.</strong> <br>
                        If you want, drop a FEW donations here:<br>
                    <small><i>0x44F7f2cE1A46Ca5C78D6C0701D192A613890c20E</i></small><br>
                        <small>v.0.2.1</small>
                    </span>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<style>

html, body {
    font-family: 'Press Start 2P', sans-serif;
    height: 100% !important;
    min-height: 100vh !important;
}

#app {
    height: 100% !important;
    min-height: 100vh !important;
}

.navbar a {
    font-family: "Courier New", Courier, monospace;
}

p, span, code, li, strong, small, div {
    font-family: "Courier New", Courier, monospace;
}

a {
    text-decoration: none !important;
    font-weight: bold;
    color: #083823 !important;
}

a:hover {
    opacity: 84%;
}

body {
    background: #F9FBFC !important;
    min-height: 100vh;
}

h1, h2, h3, h4, h5, h6, button {
    font-family: 'Press Start 2P', sans-serif;
}

h6 {
    font-size: 10pt !important;
}

.logo {
    width: 40px;
}

#btn-back-to-top {
    /*display: none; !* Hidden by default *!*/
    position: fixed; /* Fixed/sticky position */
    bottom: 20px; /* Place the button at the bottom of the page */
    right: 30px; /* Place the button 30px from the right */
    z-index: 999; /* Make sure it does not overlap */
    border: none; /* Remove borders */
    outline: none; /* Remove outline */
    background-color: #ef2929; /* Set a background color */
    color: white; /* Text color */
    cursor: pointer; /* Add a mouse pointer on hover */
    padding: 15px; /* Some padding */
    border-radius: 10px; /* Rounded corners */
    font-size: 18px; /* Increase font size */
}

#top-text {
    font-family: 'Press Start 2P', sans-serif;
    font-size: 10pt;
}

ul {
    list-style-type: square;
}

.nav-item {
    border-left: 2px solid #ccc;
}

.nav-link, .navbar-brand {
    font-family: 'Press Start 2P', sans-serif !important;
}

.female {
    color: #F973D9;
}

.male {
    color: #00BECA;
}

.rect {
    border-radius: 0 !important;
}

code {
    font-family: "Courier New", Courier, monospace !important;
}

kbd {
    font-family: Consolas, "Courier New", Courier, monospace;
}

</style>
