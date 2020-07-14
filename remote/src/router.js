import Vue from 'vue';
import Router from 'vue-router';
//import Floor from '@/components/Floor.vue';
import { i18n } from './main'
Vue.use(Router);
const routesone = [
    {
        path: "/",
        name: "index",
        redirect: '/s',
        meta: {
            title: '家庭医生'
        },
    },
    {
        path: "/s",
        name: "s",
        component: () => import("./views/color.vue"),
        meta: {
            title: 'ceshi',
            id: 4
        }
    },
    {
        path: "/b",
        name: "b",
        component: () => import("./views/huitu.vue"),
        meta: {
            title: 'ceshi',
            id: 4
        }
    },

];

const routes = new Array().concat(routesone)
// add route path
routes.forEach(route => {
    route.path = route.path || '/' + (route.name || '');
});

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title;
    if (title) {
        document.title = title;
    }
    if (window.localStorage.getItem("lan")) {
        i18n.locale = window.localStorage.getItem("lan")
    }
    next();
});

export {
    router
};
