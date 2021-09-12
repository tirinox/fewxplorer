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
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
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
        <button
            type="button"
            class="btn btn-danger btn-floating btn-lg"
            id="btn-back-to-top"
            v-show="scY > 300"
            @click="toTop"
        >
            <span id="top-text">TOP</span>
        </button>

        <div class="row pt-4 pb-4">
            <div class="col-lg-12 mx-auto">
                <img class="logo img-fluid float-start" src="/logo-few.png" alt="Project Logo">
                <h1>FEWxplorer</h1>
                <h6>It has FEW features, it is helpful for FEW.</h6>
                <p><a href="https://www.fewmans.com/" target="_blank">Go to FEWMANS website.</a></p>
            </div>
        </div>

        <Explorer/>

        <footer class="page-footer font-small blue pt-4 pb-5">
            <div class="container-fluid text-center text-md-left">
                <div class="row">
                    <div class="col-md-12 mt-md-0 mt-3 pb-3">
                    <span>
                    © 2021 FEW community. If you want, drop a FEW donations here:
                    <i>0x44F7f2cE1A46Ca5C78D6C0701D192A613890c20E</i>
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
    color: #2a9766 !important;
}

body {
    background: #F9FBFC !important;
}

h1, h2, h3, h4, h5, h6, button {
    font-family: 'Press Start 2P', sans-serif;
}

.logo {
    padding: 10px;
    height: 80%;
    width: auto;
}

#btn-back-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
}

#top-text {
    font-family: 'Press Start 2P', sans-serif;
    font-size: 10pt;
}

ul {
    list-style-type:square;
}



</style>
