<template>
    <div class="col-xl-4 col-lg-4 col-md-6 mb-4">

        <div class="fewtext">
            <p class="h4">
                Fewman #{{ fewman.id }}
            </p>
            <p>
                <a :href="'https://opensea.io/assets/0xad5f6cdda157694439ef9f6dd409424321c74628/'+ fewman.id"
                   target="_blank">Buy</a>
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

.fewcard {
}

.fewimg {
}

</style>