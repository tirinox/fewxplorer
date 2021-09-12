<script setup>
import Explorer from './components/Explorer.vue'
</script>

<template>

    <div class="container-fluid">
        <div class="row py-5">
            <div class="col-lg-12 mx-auto">
                <img class="logo img-fluid float-start" src="/logo-few.png">
                <h1>

                    FEWxplorer
                </h1>
                <h6>It has FEW features, it is helpful for FEW.</h6>
                <p><a href="https://www.fewmans.com/" target="_blank">Go to FEWMANS website.</a></p>
            </div>
        </div>

        <Explorer/>
    </div>

    <footer class="page-footer font-small blue pt-4">
        <div class="container-fluid text-center text-md-left">
            <div class="row">
                <div class="col-md-12 mt-md-0 mt-3 pb-3">
                    <span>
                    © 2021 FEW community. If you want, drop a FEW donations here:
                    <code>0x44F7f2cE1A46Ca5C78D6C0701D192A613890c20E</code>
                    </span>
                </div>
            </div>
        </div>
    </footer>

</template>

<style>

html, body, a {
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
    color: #42b983 !important;
}


body {
    background: #F9FBFC !important;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Press Start 2P', sans-serif;
}

.logo {
    padding: 10px;
    height: 80%;
    width: auto;
}

</style>
