import {createRouter, createWebHashHistory} from "vue-router";
import Explorer from "./components/Explorer.vue";
import Match from "./components/MatchPage.vue";
import Rarity from "./components/RarityPage.vue";
import BreedEmulatorPage from "./components/BreedEmulatorPage.vue";
import TestFewiewer from "./components/TestFewiewer.vue";
import BreedEmulatorPageR from "./components/BreedEmulatorPageR.vue";
import NotFoundPage from "./components/NotFoundPage.vue";
import BestPairsPageR from "./components/BestPairsPageR.vue";


const routes = [
    {
        path: "/",
        name: "FEWxplorer",
        component: Explorer,
    },
    {
        path: "/match/:token_id",
        name: "Match",
        component: Match,
    },
    {
        path: "/rarity",
        name: 'Rarity',
        component: Rarity,
    },
    {
        path: "/breedem",
        name: "BreedEm",
        component: BreedEmulatorPage,
    },
    {
        path: "/breedem/:f1/:f2",
        name: "BreedEmPre",
        component: BreedEmulatorPage,
    },

    // ------ test -----
    {
        path: "/rr-go/test-fewiewer/:infura",
        name: "TestFewiewer",
        component: TestFewiewer,
    },
    {
        path: "/rr-go/test-fewiewer/:infura/:tokenIds",
        name: "TestFewiewerTokens",
        component: TestFewiewer,
    },
    {
        path: "/rr-go/breedem-v2/:infura",
        name: "BreedEmV2",
        component: BreedEmulatorPageR,
    },
    {
        path: "/rr-go/breedem-v2/:infura/:f1/:f2",
        name: "BreedEmV2Pre",
        component: BreedEmulatorPageR,
    },
    {
        path: "/rr-go/our-best-pairs/:infura",
        name: "BestPairs",
        component: BestPairsPageR,
    },
    {
        path: "/rr-go/our-best-pairs/:infura/:address",
        name: "BestPairsAddr",
        component: BestPairsPageR,
    },

    // ----- 404 ---
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
    { path: '/:pathMatch(.*)', name: 'bad-not-found', component: NotFoundPage },
];


const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;