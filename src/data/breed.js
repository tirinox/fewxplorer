import {toRefs, reactive} from "vue";

const state = reactive({
    f1TokenId: null,
    f2TokenId: null
});


export default function useBreedingState() {
    const setF1 = (f1) => {
        state.f1TokenId = f1
    }
    const setF2 = (f2) => {
        state.f2TokenId = f2
    }
    return {
        ...toRefs(state),
        setF1, setF2
    }
}