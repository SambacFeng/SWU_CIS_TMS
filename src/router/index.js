import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/dashboard',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
          meta: { title: '系统首页' }
        },
        {
          path: '/home',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Home.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/icon',
          component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
          meta: { title: '自定义图标' }
        },
        {
          path: '/students',
          component: () => import(/* webpackChunkName: "table" */ '../components/page/Students.vue'),
          meta: { title: '学生管理' }
        },
        {
          path: '/tutors',
          component: () => import(/* webpackChunkName: "table" */ '../components/page/Tutors.vue'),
          meta: { title: '导师管理' }
        },
        {
          path: '/records',
          component: () => import(/* webpackChunkName: "table" */ '../components/page/Records.vue'),
          meta: { title: '指导记录' }
        },
        {
          path: '/tutorSelect',
          component: () => import(/* webpackChunkName: "table" */ '../components/page/TutorSelect.vue'),
          meta: { title: '导师选择' }
        },
        {
          path: '/tutorConfirm',
          component: () => import(/* webpackChunkName: "table" */ '../components/page/TutorConfirm.vue'),
          meta: { title: '学生选择' }
        },
        {
          path: '/createRecord',
          component: () => import(/* webpackChunkName: "table" */ '../components/page/CreateRecord.vue'),
          meta: { title: '新增指导记录' }
        },
        {
          path: '/evaluation',
          component: () => import(/* webpackChunkName: "table" */ '../components/page/Evaluation.vue'),
          meta: { title: '导师评价' }
        },
        {
          path: '/tabs',
          component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
          meta: { title: 'tab选项卡' }
        },
        {
          path: '/form',
          component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
          meta: { title: '基本表单' }
        },
        {
          // vue-schart组件
          path: '/charts',
          component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
          meta: { title: 'schart图表' }
        },
        {
          // 权限页面
          path: '/permission',
          component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
          meta: { title: '权限测试', permission: true }
        },
        {
          path: '/404',
          component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
          meta: { title: '404' }
        },
        {
          path: '/403',
          component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
          meta: { title: '403' }
        },
        {
          path: '/modify',
          component: () => import(/* webpackChunkName: "modify" */ '../components/page/Modify.vue'),
          meta: { title: '修改密码' }
        }
      ]
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
