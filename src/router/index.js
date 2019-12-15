import Vue from 'vue';
import Router from 'vue-router';
import EditClient from '@/components/EditClient';
import QuickClient from '@/components/QuickClient';
import QuickOrder from '@/components/QuickOrder';
import ViewClients from '@/components/ViewClients';
import ViewContacts from '@/components/ViewContacts';
import ViewProperties from '@/components/ViewProperties';
import ViewProjects from '@/components/ViewProjects';
import EditProjects from '@/components/EditProjects';
import ViewOrders from '@/components/ViewOrders';
import ViewTasks from '@/components/ViewTasks';
import LoginForm from '@/components/LoginForm';
import ViewSchedule from '@/components/ViewSchedule';
import ViewAssignments from '@/components/ViewAssignments';
import EditHours from '@/components/EditHours';
import EditList from '@/components/EditList';
import EditProfile from '@/components/EditProfile';
import ViewVehicles from '@/components/ViewVehicles';
import EditVehicle from '@/components/EditVehicle';
import EditFueling from '@/components/EditFueling';
import ViewFuelings from '@/components/ViewFuelings';
import EditService from '@/components/EditService';
import ViewServices from '@/components/ViewServices';
import EditPart from '@/components/EditPart';
import ViewParts from '@/components/ViewParts';
import EditRepair from '@/components/EditRepair';
import ViewRepairs from '@/components/ViewRepairs';
import EditMaintenance from '@/components/EditMaintenance';
import ViewMaintenances from '@/components/ViewMaintenances';
import GoogleCalendar from '@/components/GoogleCalendar';
import EditBackflowAssembly from '@/components/EditBackflowAssembly';
import ViewBackflowAssemblies from '@/components/ViewBackflowAssemblies';
import CreateBackflowTestReport from '@/components/CreateBackflowTestReport';
import EditBackflowTestReport from '@/components/EditBackflowTestReport';
import ViewBackflowTestReports from '@/components/ViewBackflowTestReports';

Vue.use(Router);

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
      path: '/appointment_statuses',
      name: 'EditAppointmentStatuses',
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
      path: '/vehicle_types',
      name: 'EditVehicleTypes',
      component: EditList
    },
    {
      path: '/service_types',
      name: 'EditServiceTypes',
      component: EditList
    },
    {
      path: '/usage_types',
      name: 'EditUsageTypes',
      component: EditList
    },
    {
      path: '/profile',
      name: 'EditProfile',
      component: EditProfile
    },
    {
      path: '/vehicles',
      name: 'ViewVehicles',
      component: ViewVehicles,
      meta: {
        title: 'View Vehicles'
      }
    },
    {
      path: '/vehicle/:vehicle_id',
      name: 'EditVehicle',
      component: EditVehicle,
      props: true,
      meta: {
        title: 'Edit Vehicle'
      }
    },
    {
      path: '/vehicle',
      name: 'NewVehicle',
      component: EditVehicle,
      meta: {
        title: 'New Vehicle'
      }
    },
    {
      path: '/fueling',
      name: 'NewFueling',
      component: EditFueling,
      meta: {
        title: 'New Fueling'
      }
    },
    {
      path: '/fueling/:fueling_id',
      name: 'EditFueling',
      props: true,
      component: EditFueling,
      meta: {
        title: 'Edit Fueling'
      }
    },
    {
      path: '/fuelings',
      name: 'ViewFuelings',
      component: ViewFuelings,
      meta: {
        title: 'View Fuelings'
      }
    },
    {
        path: '/service',
        name: 'NewService',
        component: EditService,
        meta: {
            title: 'New Service'
        }
    },
    {
        path: '/service/:service_id',
        name: 'EditService',
        component: EditService,
        props: true,
        meta: {
            title: 'Edit Service'
        }
    },
    {
      path: '/services',
      name: 'ViewServices',
      component: ViewServices,
      meta: {
        title: 'View Services'
      }
    },
    {
        path: '/part',
        name: 'NewPart',
        component: EditPart,
        meta: {
            title: 'New Part'
        }
    },
    {
        path: '/part/:part_id',
        name: 'EditPart',
        component: EditPart,
        props: true,
        meta: {
            title: 'Edit Part'
        }
    },
    {
      path: '/parts',
      name: 'ViewParts',
      component: ViewParts,
      meta: {
        title: 'View Parts'
      }
    },
    {
        path: '/repair',
        name: 'NewRepair',
        component: EditRepair,
        meta: {
            title: 'New Repair'
        }
    },
    {
        path: '/repair/:repair_id',
        name: 'EditRepair',
        component: EditRepair,
        props: true,
        meta: {
            title: 'Edit Repair'
        }
    },
    {
      path: '/repairs',
      name: 'ViewRepairs',
      component: ViewRepairs,
      meta: {
        title: 'View Repairs'
      }
    },
    {
        path: '/maintenance',
        name: 'NewMaintenance',
        component: EditMaintenance,
        meta: {
            title: 'New Maintenance'
        }
    },
    {
        path: '/maintenance/:maintenance_id',
        name: 'EditMaintenance',
        component: EditMaintenance,
        props: true,
        meta: {
            title: 'Edit Maintenance'
        }
    },
    {
      path: '/maintenances',
      name: 'ViewMaintenances',
      component: ViewMaintenances,
      meta: {
        title: 'View Maintenances'
      }
    },
    {
      path: '/calendar',
      name: 'GoogleCalendar',
      component: GoogleCalendar
    },
    {
        path: '/backflow_assembly',
        name: 'NewBackflowAssembly',
        component: EditBackflowAssembly,
        meta: {
            title: 'New Backflow Assembly'
        }
    },
    {
        path: '/backflow_assembly/:backflow_assembly_id',
        name: 'EditBackflowAssembly',
        component: EditBackflowAssembly,
        props: true,
        meta: {
            title: 'Edit Backflow Assembly'
        }
    },
    {
      path: '/backflow_assemblies',
      name: 'ViewBackflowAssemblies',
      component: ViewBackflowAssemblies,
      meta: {
        title: 'View Backflow Assemblies'
      }
    },
    {
        path: '/backflow_test_report/quick/:group',
        name: 'NewBackflowTestReports',
        component: CreateBackflowTestReport,
        meta: {
            title: 'New Backflow Test Reports'
        }
    },
    {
        path: '/backflow_test_report',
        name: 'NewBackflowTestReport',
        component: EditBackflowTestReport,
        meta: {
            title: 'Edit Backflow Test Reports'
        }
    },
    {
        path: '/backflow_test_report/:backflow_test_report_id',
        name: 'EditBackflowTestReport',
        component: EditBackflowTestReport,
        props: true,
        meta: {
            title: 'Edit Backflow Test Reports'
        }
    },
    {
      path: '/backflow_test_reports',
      name: 'ViewBackflowTestReports',
      component: ViewBackflowTestReports,
      meta: {
        title: 'View Backflow Test Reports'
      }
    },
  ]
});



router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;
  next();
});


export default router;