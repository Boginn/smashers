import Vue from 'vue'
import VueRouter from 'vue-router'
import Game from '../views/Game.vue'
import Welcome from '../views/Welcome.vue'
import Help from '../views/Help.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/Game',
    name: 'Game',
    component: Game,

  },
  {
    path: '/Welcome',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/Help',
    name: 'Help',
    component: Help
  },

  // {
    // path: '/about',
    // name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: "history",
  routes
})

export default router
