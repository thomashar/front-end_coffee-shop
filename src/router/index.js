import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import DashboardView from '../views/DashboardView.vue'

Vue.use(VueRouter)

function importComponent (path) {
  return () => import(`../components/${path}.vue`)
}

const routes = [
  {
    path: '/dashboard',
    component: DashboardView,
    children: [
      {
        path: '/profile',
        name: 'profile',
        meta: { title: 'Profile' },
        component: importComponent('ProfileComponent')
      },
      {
        path: '/historystok',
        name: 'history stok',
        meta: { title: 'History Stok' },
        component: importComponent('HistoryStokComponent')
      },
      {
        path: '/menu',
        name: 'menu',
        meta: { title: 'Menu' },
        component: importComponent('MenuComponent')
      },
      {
        path: '/pegawai',
        name: 'pegawai',
        meta: { title: 'Pegawai' },
        component: importComponent('PegawaiComponent')
      },
      {
        path: '/transaksi',
        name: 'transaksi',
        meta: { title: 'Transaksi' },
        component: importComponent('TransaksiComponent')
      },
      {
        path: '/resep',
        name: 'resep',
        meta: { title: 'Resep' },
        component: importComponent('ResepComponent')
      }
      // {
      //   path: '/pembeli',
      //   name: 'pembeli',
      //   component: importComponent('PegawaiComponent')
      // }
    ]
  },
  {
    path: '/admin',
    name: 'login',
    meta: { title: 'Login' },
    component: Login
  },
  {
    path: '/customer',
    name: 'Pesan Menu',
    meta: { title: 'Pesan Menu' },
    component: importComponent('PesanComponent')
  }

  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//  Mengset harus login
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  if (to.name !== 'login' && localStorage.getItem('token') === '') {
    return next({
      path: '/customer'
    })
  }
  next()
})
export default router
