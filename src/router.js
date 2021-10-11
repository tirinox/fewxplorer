import {createRouter, createWebHashHistory} from "vue-router";
import Explorer from "./components/Explorer.vue";
import Match from "./components/MatchPage.vue";
import Rarity from "./components/RarityPage.vue";


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
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;