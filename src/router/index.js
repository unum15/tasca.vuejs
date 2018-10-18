import Vue from 'vue'
import Router from 'vue-router'
import EditClient from '@/components/EditClient'
import ViewClients from '@/components/ViewClients'
import ViewContacts from '@/components/ViewContacts'
import ViewProperties from '@/components/ViewProperties'
import LoginForm from '@/components/LoginForm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginForm
    },
    {
      path: '/client',
      name: 'NewClient',
      component: EditClient
    },
    {
      path: '/client/:client_id',
      name: 'EditClient',
      component: EditClient,
      props: true
    },
    {
      path: '/clients',
      name: 'ViewClients',
      component: ViewClients
    },
    {
      path: '/contacts',
      name: 'ViewContacts',
      component: ViewContacts
    },
    {
      path: '/properties',
      name: 'ViewProperties',
      component: ViewProperties
    },
    {
      path: '/projects',
      name: 'ViewProjects',
      component: ViewProperties
    },
    {
      path: '/service_orders',
      name: 'ViewServiceOrders',
      component: ViewProperties
    },
    {
      path: '/work_orders',
      name: 'ViewWorkOrders',
      component: ViewProperties
    },
    {
      path: '/tasks',
      name: 'ViewTasks',
      component: ViewProperties
    },
  ]
})
