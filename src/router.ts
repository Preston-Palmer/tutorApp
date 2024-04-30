import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'Home', component: () => import('./views/Home.vue') },
    {
        path: '/Contact',
        name: 'Contact',
        component: () => import('./views/Contact.vue')
    },
    {
        path: '/Profile',
        name: 'Profile',
        component: () => import('./views/Profile.vue')
    },
    {
        path: '/Clockin',
        name: 'Clockin',
        component: () => import('./views/Clockin.vue')
    },
    {
        path: '/Signup',
        name: 'Signup',
        component: () => import('./views/Sign-up.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        // always scroll to top
        return { top: 0 }
    }
})

export default router
