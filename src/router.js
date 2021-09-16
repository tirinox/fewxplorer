import { createWebHistory, createRouter } from "vue-router";
import Explorer from "./components/Explorer.vue";
import Match from "./components/Match.vue";
import Stats from "./components/Stats.vue";


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
        path: "/stats",
        name: "Stats",
        component: Stats,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;