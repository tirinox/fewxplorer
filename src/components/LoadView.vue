<template>
    <div class="load">
        <h4>
            <span class="spinner-grow"></span>
            {{ text ?? 'Loading...' }}
        </h4>
    </div>
</template>

<script>
export default {
    name: "LoadView",
    props: ['text'],
}
</script>

<style scoped>


.load {
    padding: 20pt;
    border: 2px #444 dashed;
    background: white;
    position: fixed;
    top: 50%;
    left: 50%;
    /* bring your own prefixes */
    transform: translate(-50%, -50%);
    z-index: 999;
}

</style>