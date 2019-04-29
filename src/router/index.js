import Vue from 'vue'
import Router from 'vue-router'
import EditClient from '@/components/EditClient'
import QuickClient from '@/components/QuickClient'
import QuickOrder from '@/components/QuickOrder'
import ViewClients from '@/components/ViewClients'
import ViewContacts from '@/components/ViewContacts'
import ViewProperties from '@/components/ViewProperties'
import ViewProjects from '@/components/ViewProjects'
import EditProjects from '@/components/EditProjects'
import ViewOrders from '@/components/ViewOrders'
import ViewTasks from '@/components/ViewTasks'
import LoginForm from '@/components/LoginForm'
import ViewSchedule from '@/components/ViewSchedule'
import ViewAssignments from '@/components/ViewAssignments'
import EditHours from '@/components/EditHours'
import EditList from '@/components/EditList'
import EditProfile from '@/components/EditProfile'
import GoogleCalendar from '@/components/GoogleCalendar'
import PhreeBooksContacts from '@/components/PhreeBooksContacts'
import PhreeBooksAddresses from '@/components/PhreeBooksAddresses'


Vue.use(Router)

var router = new Router({
  mode: 'history',
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
      path: '/quick_order',
      name: 'QuickOrder',
      component: QuickOrder
    },
    {
      path: '/client/:client_id',
      name: 'EditClient',
      component: EditClient,
      props: true,
      meta: {
        title: 'Edit Client'
      },
      children: [
        {
          path: 'project/:project_id/order/:order_id',
          component: EditClient
        },
        {
          path: 'contact/:contact_id',
          component: EditClient
        },
        {
          path: 'property/:property_id',
          component: EditClient
        },
        {
          path: 'project/:project_id',
          component: EditClient
        },
        {
          path: 'project/:project_id/order/:order_id/task/:task_id',
          component: EditClient
        },
        {
          path: 'projects',
          component: EditProjects
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
      path: '/phree_books/contacts',
      name: 'PhreeBooksContacts',
      component: PhreeBooksContacts
    },
    {
      path: '/phree_books/addresses',
      name: 'PhreeBooksAddresses',
      component: PhreeBooksAddresses
    },
    {
      path: '/properties',
      name: 'ViewProperties',
      component: ViewProperties
    },
    {
      path: '/projects/view',
      name: 'ViewProjects',
      component: ViewProjects
    },
    {
      path: '/projects/edit',
      name: 'EditProjects',
      component: EditProjects
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
      component: ViewSchedule,
      meta: {
        title: 'Scheduler'
      }
    },
    {
      path: '/assignments',
      name: 'ViewAssignments',
      component: ViewAssignments,
      meta: {
        title: 'Assigments'
      },
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
      path: '/crews',
      name: 'EditCrews',
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



router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;
  next();
});


export default router;