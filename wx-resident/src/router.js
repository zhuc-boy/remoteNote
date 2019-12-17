import Vue from 'vue';
import Router from 'vue-router';
import Floor from '@/components/Floor.vue';

Vue.use(Router);

const routesone = [
    {
        path: "/",
        name: "index",
        redirect: '/s',
        meta: {
            title: '远程绘图'
        },
    },
    {
        path: "/s",
        name: "s",
        component: () => import(/* webpackChunkName: "login" */ "./views/huitu.vue"),
        meta: {
            title: '远程绘图'
        },
    }
];

routesone.forEach(route => {
    route.path = route.path || '/' + (route.name || '');
});

const router = new Router({ routesone });

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
