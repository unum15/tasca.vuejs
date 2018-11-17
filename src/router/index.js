import Vue from 'vue'
import Router from 'vue-router'
import EditClient from '@/components/EditClient'
import ViewClients from '@/components/ViewClients'
import ViewContacts from '@/components/ViewContacts'
import ViewProperties from '@/components/ViewProperties'
import ViewProjects from '@/components/ViewProjects'
import ViewServiceOrders from '@/components/ViewServiceOrders'
import ViewWorkOrders from '@/components/ViewWorkOrders'
import ViewTasks from '@/components/ViewTasks'
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
      component: ViewProjects
    },
    {
      path: '/service_orders',
      name: 'ViewServiceOrders',
      component: ViewServiceOrders
    },
    {
      path: '/work_orders',
      name: 'ViewWorkOrders',
      component: ViewWorkOrders
    },
    {
      path: '/tasks',
      name: 'ViewTasks',
      component: ViewTasks
    },
    {
      path: '/client/:client_id/contact/:contact_id',
      name: 'EditContact',
      component: EditClient,
      props: true
    },
    {
      path: '/client/:client_id/property/:property_id',
      name: 'EditProperty',
      component: EditClient,
      props: true
    },
    {
      path: '/client/:client_id/project/:project_id',
      name: 'EditProject',
      component: EditClient,
      props: true
    },
    {
      path: '/client/:client_id/service_order/:service_order_id',
      name: 'EditServiceOrder',
      component: EditClient,
      props: true
    },
    {
      path: '/client/:client_id/work_order/:work_order_id',
      name: 'EditWorkOrder',
      component: EditClient,
      props: true
    },
    {
      path: '/client/:client_id/task/:task_id',
      name: 'EditTask',
      component: EditClient,
      props: true
    },
  ]
})
