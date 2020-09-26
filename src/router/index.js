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
    path: '/public-about',
    component: () => import('@/views/about/index'),
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
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/problem',
    component: Layout,
    redirect: '/problem/list',
    meta: { title: '问题中心', icon: 'problem' },
    children: [
      {
        path: 'submit/:id(\\d+)',
        component: () => import('@/views/problem/submit'),
        name: 'ProblemSubmit',
        meta: { title: '提交', activeMenu: '/problems/list' },
        hidden: true
      },
      {
        path: 'status/:id(\\d+)',
        component: () => import('@/views/problem/status'),
        name: 'ProblemStatus',
        meta: { title: '问题状态', activeMenu: '/problems/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/problem/list'),
        name: 'ProblemList',
        meta: { title: '问题', icon: 'problem' }
      },
      {
        path: 'admin',
        component: () => import('@/views/problem/admin'),
        name: 'ProblemAdmin',
        meta: { title: '问题管理', icon: 'set', roles: ['管理员', '问题编辑员'] }
      },
      {
        path: 'data/:id(\\d+)',
        component: () => import('@/views/problem/data'),
        name: 'ProblemData',
        meta: { title: '数据管理', icon: 'set', roles: ['管理员', '问题编辑员'] },
        hidden: true
      }
    ]
  },
  {
    path: '/status',
    component: Layout,
    redirect: '/status/index',
    meta: { title: '判题中心', icon: 'skill' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/status/index'),
        name: 'Status',
        meta: { title: '状态', icon: 'skill' }
      },
      {
        path: 'rejudge',
        component: () => import('@/views/status/rejudge'),
        name: 'StatusRejudge',
        meta: { title: '重判', icon: 'refresh', roles: ['管理员'] }
      }
    ]
  },
  {
    path: '/ranklist',
    component: Layout,
    meta: { title: '排行榜', icon: 'chart' },
    redirect: '/ranklist/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/ranklist/index'),
        name: 'Ranklist',
        meta: { title: '刷题榜', icon: 'problem' }
      },
      {
        path: 'score',
        component: () => import('@/views/ranklist/score'),
        name: 'RanklistScore',
        meta: { title: '积分榜', icon: 'score' }
      }
    ]
  },
  {
    path: '/contest',
    component: Layout,
    meta: { title: '竞赛中心', icon: 'example' },
    redirect: '/contest/list',
    children: [
      {
        path: 'list',
        component: () => import('@/views/contest/list'),
        name: 'ContestList',
        meta: { title: '竞赛', icon: 'example' }
      },
      {
        path: 'score',
        component: () => import('@/views/contest/score'),
        name: 'ContestScore',
        meta: { title: '竞赛结果查询', icon: 'excel' }
      },
      {
        path: 'submit/:cid(\\d+)/:pid(\\d+)',
        component: () => import('@/views/contest/submit'),
        name: 'ContestSubmit',
        meta: { title: '提交 - 竞赛', activeMenu: '/contest/list' },
        hidden: true
      },
      {
        path: 'admin',
        component: () => import('@/views/contest/admin'),
        name: 'ContestAdmin',
        meta: { title: '竞赛管理', icon: 'set', roles: ['管理员', '问题编辑员'] }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/index',
    name: 'Article',
    meta: {
      title: '文章/博客中心',
      icon: 'education'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/article/index'),
        name: 'ArticleIndex',
        meta: { title: '文章/博客', icon: 'education' }
      },
      {
        path: 'detail/:id(\\d+)',
        component: () => import('@/views/article/detail'),
        name: 'ArticleDetail',
        hidden: true,
        meta: { title: '文章/博客详情' }
      }
    ]
  },
  {
    path: '/points',
    component: Layout,
    redirect: '/points/task',
    name: 'Score',
    meta: {
      title: '积分中心',
      icon: 'money'
    },
    children: [
      {
        path: 'task',
        component: () => import('@/views/points/task'),
        name: 'PointsTask',
        meta: { title: '任务中心', icon: 'edit', noCache: true }
      },
      {
        path: 'bag',
        component: () => import('@/views/points/bag'),
        name: 'PointsBag',
        meta: { title: '物品中心', icon: 'peoples', noCache: true }
      },
      {
        path: 'log',
        component: () => import('@/views/points/log'),
        name: 'PointsLog',
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
  },
  {
    path: '/news',
    component: Layout,
    redirect: '/news/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/news/index'),
        name: 'NewsIndex',
        meta: { title: '新闻管理', icon: 'news', roles: ['管理员'] }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    meta: { title: '用户中心', icon: 'user', roles: ['管理员'] },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/user/admin'),
        name: 'UserAdmin',
        meta: { title: '用户管理', icon: 'user', roles: ['管理员'] }
      },
      {
        path: 'privilege',
        component: () => import('@/views/user/privilege'),
        name: 'UserPrivilege',
        meta: { title: '权限管理', icon: 'role', roles: ['管理员'] }
      }
    ]
  },
  {
    path: '/help',
    component: Layout,
    meta: { title: '帮助中心', icon: 'education' },
    children: [
      {
        path: 'document',
        component: () => import('@/views/help/document'),
        name: 'HelpDocument',
        meta: { title: '使用文档', icon: 'documentation', noCache: true }
      },
      {
        path: 'faq',
        component: () => import('@/views/help/faq'),
        name: 'HelpFaq',
        meta: { title: '常见问答', icon: 'FAQ', noCache: true }
      },
      {
        path: 'donate',
        component: () => import('@/views/help/donate'),
        name: 'HelpDonate',
        meta: { title: '捐助', icon: 'money' }
      }
    ]
  },
  {
    path: '/about',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/about/index'),
        name: 'AboutIndex',
        hidden: true,
        meta: { title: '关于', noCache: true }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统管理', roles: ['管理员'], icon: 'set' },
    children: [
      {
        path: 'info',
        component: () => import('@/views/system/info'),
        name: 'SystemInfo',
        meta: { title: '系统信息', noCache: true }
      }
    ]
  },
  {
    path: '/develop',
    component: Layout,
    alwaysShow: true,
    meta: { title: '开发&调试工具', roles: ['管理员'], icon: 'bug' },
    children: [
      {
        path: 'request',
        component: () => import('@/views/develop/request'),
        name: 'DevelopRequest',
        meta: { title: '发送请求', icon: 'guide' }
      },
      {
        path: 'token',
        component: () => import('@/views/develop/token'),
        name: 'DevelopToken',
        meta: { title: '会话管理', icon: 'message' }
      },
      {
        path: 'test',
        component: () => import('@/views/develop/test'),
        name: 'DevelopTest',
        meta: { title: '调试专用页面', icon: 'skill' }
      }
    ]
  },
  {
    path: '/old',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/old/index'),
        name: 'OldIdex',
        meta: { title: '旧版界面', icon: 'link' }
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
