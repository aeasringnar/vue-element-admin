import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/demoadmin',
    component: Layout,
    children: [
      {
        path: 'demo',
        name: 'demo',
        component: () => import('@/views/myviews/demoadmin'),
        meta: { title: 'demo admin', icon: 'form' }
      }
    ]
  },
  {
    path: '/print',
    component: Layout,
    children: [
      {
        path: 'pdemo',
        name: 'pdemo',
        component: () => import('@/views/myviews/printdemo'),
        meta: { title: 'demo print', icon: 'form' }
      }
    ]
  },
  {
    path: '/tinymceDemo',
    component: Layout,
    // hidden: true,
    children: [
      {
        path: 'tinymce',
        name: 'tinymce',
        component: () => import('@/views/myviews/tinymce_demo'),
        meta: { title: 'Tinymce Demo', icon: 'form' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
