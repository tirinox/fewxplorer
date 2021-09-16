<script>
import Explorer from './components/Explorer.vue'
import mitt, {EVENTS} from "./helpers/mitt";

export default {
    name: "App",
    components: {Explorer},
    data() {
        return {
            scTimer: 0,
            scY: 0,
        }
    },
    methods: {
        handleScroll: function () {
            const listElm = document
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2) {
                mitt.emit("load_more")
            }

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
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
        mitt.on(EVENTS.SCROLL_TOP, this.toTop)
    },
    onUnmounted() {
        window.removeEventListener("scroll", this.handleScroll)
    },
}

</script>

<template>
    <div class="container-fluid min-vh-100">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <router-link class="navbar-brand" to="/">
                    <img class="img-fluid logo" src="/img/logo-few.png" alt="Project Logo">
                    FEWxplorer
                </router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/">Search</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/stats">Stats</router-link>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Links
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="https://www.fewmans.com/">Main site</a></li>
                                <li><a class="dropdown-item" href="https://opensea.io/collection/fewmans">Open Sea</a></li>
                                <li><a class="dropdown-item" href="https://etherscan.io/address/0xad5f6cdda157694439ef9f6dd409424321c74628">Contract</a></li>
                                <li><a class="dropdown-item" href="https://etherscan.io/token/0xad5f6cdda157694439ef9f6dd409424321c74628#balances">Holders</a></li>
<!--                                <li><hr class="dropdown-divider"></li>-->
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

        <router-view />

        <footer class="page-footer font-small blue pt-4 pb-5">
            <div class="container-fluid text-center text-md-left">
                <div class="row">
                    <div class="col-md-12 mt-md-0 mt-3 pb-3">
                    <span>
                    <strong>© 2021 FEW community.</strong> <br>
                        If you want, drop a FEW donations here:<br>
                    <small><i>0x44F7f2cE1A46Ca5C78D6C0701D192A613890c20E</i></small><br>
                        <small>v.0.0.5</small>
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
}

.navbar a {
    font-family: "Courier New", Courier, monospace;
}

p, span, code {
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
}

h1, h2, h3, h4, h5, h6, button {
    font-family: 'Press Start 2P', sans-serif;
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

</style>
