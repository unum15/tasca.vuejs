import Vue from 'vue'
import Router from 'vue-router'
import EditClient from '@/components/EditClient'
import QuickClient from '@/components/QuickClient'
import ViewClients from '@/components/ViewClients'
import ViewContacts from '@/components/ViewContacts'
import ViewProperties from '@/components/ViewProperties'
import ViewProjects from '@/components/ViewProjects'
import ViewOrders from '@/components/ViewOrders'
import ViewTasks from '@/components/ViewTasks'
import LoginForm from '@/components/LoginForm'
import ViewSchedule from '@/components/ViewSchedule'
import EditHours from '@/components/EditHours'
import EditList from '@/components/EditList'
import EditProfile from '@/components/EditProfile'
import GoogleCalendar from '@/components/GoogleCalendar'


Vue.use(Router)

export default new Router({
//  mode: 'history',
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
      path: '/quick_client',
      name: 'QuickClient',
      component: QuickClient
    },
    {
      path: '/client/:client_id',
      name: 'EditClient',
      component: EditClient,
      props: true,
      children: [
        {
          path: 'order/:order_id',
          component: EditClient
        }
      ]
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
      path: '/orders',
      name: 'ViewOrders',
      component: ViewOrders
    },
    {
      path: '/tasks',
      name: 'ViewTasks',
      component: ViewTasks
    },
    {
      path: '/scheduler',
      name: 'ViewSchedule',
      component: ViewSchedule
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
    
    
    
    
    
    
    
    
    {
      path: '/hours',
      name: 'EditHours',
      component: EditHours
    },
    {
      path: '/activity_levels',
      name: 'EditActivityLevels',
      component: EditList
    },
    {
      path: '/client_types',
      name: 'EditClientTypes',
      component: EditList
    },
    {
      path: '/contact_methods',
      name: 'EditContactMethods',
      component: EditList
    },
    {
      path: '/contact_types',
      name: 'EditContactTypes',
      component: EditList
    },
    {
      path: '/email_types',
      name: 'EditEmailTypes',
      component: EditList
    },
    {
      path: '/order_actions',
      name: 'EditOrderActions',
      component: EditList
    },
    {
      path: '/order_billing_types',
      name: 'EditOrderBillingTypes',
      component: EditList
    },
    {
      path: '/order_categories',
      name: 'EditOrderCategories',
      component: EditList
    },
    {
      path: '/order_priorities',
      name: 'EditOrderPriorities',
      component: EditList
    },
    {
      path: '/order_statuses',
      name: 'EditOrderStatuses',
      component: EditList
    },
    {
      path: '/order_types',
      name: 'EditOrderTypes',
      component: EditList
    },
    {
      path: '/phone_number_types',
      name: 'EditPhoneNumberTypes',
      component: EditList
    },
    {
      path: '/property_types',
      name: 'EditPropertyTypes',
      component: EditList
    },
    {
      path: '/task_actions',
      name: 'EditTaskActions',
      component: EditList
    },
    {
      path: '/task_appointment_statuses',
      name: 'EditTaskAppointmentStatuses',
      component: EditList
    },
    {
      path: '/task_categories',
      name: 'EditTaskCategories',
      component: EditList
    },
    {
      path: '/task_statuses',
      name: 'EditTaskStatuses',
      component: EditList
    },
    {
      path: '/task_types',
      name: 'EditTaskTypes',
      component: EditList
    },
    {
      path: '/work_types',
      name: 'EditWorkTypes',
      component: EditList
    },
    {
      path: '/profile',
      name: 'EditProfile',
      component: EditProfile
    },
    {
      path: '/calendar',
      name: 'GoogleCalendar',
      component: GoogleCalendar
    }
  ]
})
