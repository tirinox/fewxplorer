<template>
    <div class="col-xl-4 col-lg-4 col-md-6 mb-4">

        <div class="fewtext">
            <h4>
                Fewman #{{ fewman.id }}
            </h4>
            <p>
                <a :href="'https://opensea.io/assets/0xad5f6cdda157694439ef9f6dd409424321c74628/'+ fewman.id"
                   target="_blank">Buy</a>
                *
                <a :href="'https://etherscan.io/token/0xad5f6cdda157694439ef9f6dd409424321c74628?a=' + fewman.id" target="_blank">Scan</a>
            </p>
        </div>
        <img :src='fewman.img' alt="Fewman #{{ fewman.id }} Image" class="img-fluid">
    </div>
</template>

<script>
export default {
    name: "FewmanCard",
    props: ['fewman']
}
</script>

<style scoped>

.fewtext {
    position: absolute;
}

a {
    font-size: 10pt;
}

.fewcard {
}

.fewimg {
}

</style>