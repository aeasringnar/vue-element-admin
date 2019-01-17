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
    // name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  {
    path: '/bannermanage',
    component: Layout,
    children: [
      {
        path: 'banner',
        name: 'banner',
        component: () => import('@/views/website/bannermanage'),
        meta: { title: 'banner 管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/bannermanagetwo',
    component: Layout,
    children: [
      {
        path: 'bannertwo',
        name: 'bannertwo',
        component: () => import('@/views/website/bannerbot_manage'),
        meta: { title: '真情分享管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/tourdomesticmanage',
    component: Layout,
    children: [
      {
        path: 'tourdomestic',
        name: 'tourdomestic',
        component: () => import('@/views/website/tourdomestic_manage'),
        meta: { title: '国内研学管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/tourforeignmanage',
    component: Layout,
    children: [
      {
        path: 'tourforeign',
        name: 'tourforeign',
        component: () => import('@/views/website/tourforeign_manage'),
        meta: { title: '国外研学管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/dynamicmanage',
    component: Layout,
    children: [
      {
        path: 'dynamic',
        name: 'dynamic',
        component: () => import('@/views/website/dynamic_manage'),
        meta: { title: '动态资讯管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/tinymceDemo',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'tinymce',
        name: 'tinymce',
        component: () => import('@/views/website/tinymce_demo'),
        meta: { title: 'tinymce', icon: 'form' }
      }
    ]
  },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
