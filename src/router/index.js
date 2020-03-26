import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/problem',
    component: Layout,
    redirect: '/problem/list',
    children: [
      {
        path: 'submit/:id(\\d+)',
        component: () => import('@/views/problem/submit'),
        name: 'ProblemSubmit',
        meta: { title: '提交', activeMenu: '/problems/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/problem/list'),
        name: 'ProblemList',
        meta: { title: '问题', icon: 'message' }
      }
    ]
  },
  {
    path: '/status',
    component: Layout,
    redirect: '/status/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/status/index'),
        name: 'Status',
        meta: { title: '状态', icon: 'skill' }
      }
    ]
  },
  {
    path: '/ranklist',
    component: Layout,
    redirect: '/ranklist/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/ranklist/index'),
        name: 'Ranklist',
        meta: { title: '排名', icon: 'chart' }
      }
    ]
  },
  {
    path: '/contest',
    component: Layout,
    redirect: '/contest/list',
    children: [
      {
        path: 'list',
        component: () => import('@/views/contest/list'),
        name: 'ContestList',
        meta: { title: '竞赛', icon: 'example' }
      },
      {
        path: 'submit/:cid(\\d+)/:pid(\\d+)',
        component: () => import('@/views/contest/submit'),
        name: 'ContestSubmit',
        meta: { title: '提交 - 竞赛', activeMenu: '/contest/list' },
        hidden: true
      }
    ]
  },
  {
    path: '/score',
    component: Layout,
    redirect: '/score/achieve',
    name: 'Score',
    meta: {
      title: '积分中心',
      icon: 'money'
    },
    children: [
      {
        path: 'achieve',
        component: () => import('@/views/score/achieve'),
        name: 'ScoreAchieve',
        meta: { title: '领取积分', icon: 'edit', noCache: true }
      },
      {
        path: 'vip',
        component: () => import('@/views/score/vip'),
        name: 'ScoreVIP',
        meta: { title: '会员中心', icon: 'peoples', noCache: true }
      },
      {
        path: 'log',
        component: () => import('@/views/score/log'),
        name: 'ScoreLog',
        meta: { title: '积分记录', icon: 'list', noCache: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      },
      {
        path: 'user/:id',
        component: () => import('@/views/profile/user'),
        name: 'ProfileUser',
        meta: { title: '用户信息', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/faq',
    component: Layout,
    redirect: '/faq/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/faq/index'),
        name: 'FaqIndex',
        meta: { title: '常见问答', icon: 'guide' }
      }
    ]
  },
  {
    path: '/mail',
    component: Layout,
    redirect: '/mail/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/mail/index'),
        name: 'MailIndex',
        meta: { title: '站内信', icon: 'email' }
      }
    ]
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  {
    path: 'website',
    component: Layout,
    children: [
      {
        path: 'https://acm.likole.com/old',
        meta: { title: '访问旧版', icon: 'link' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
