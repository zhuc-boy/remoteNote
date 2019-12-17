import Vue from 'vue';
import Router from 'vue-router';
//import Floor from '@/components/Floor.vue';

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
        component: () => import(/* webpackChunkName: "addFamily" */ "./views/huitu.vue"),
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
    next();
});

export {
    router
};
