import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeScreen from '../components/HomeScreen'
import FavoritesScreen from '../components/FavoritesScreen'
import AboutScreen from '../components/AboutScreen'
import OrgStructure from '../components/OrgStructure'


Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: HomeScreen
    },
    {
        path: '/favorites',
        name: 'favorites',
        component: FavoritesScreen
    },
    {
        path: '/about',
        name: 'about',
        component: AboutScreen
    },
    {
        path: '/orgstructure',
        name: 'orgstructure',
        component: OrgStructure
    },
    {
        path: '/orgstructure/:department_id',
        name: 'orgstructure_department',
        component: OrgStructure
    }


]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router