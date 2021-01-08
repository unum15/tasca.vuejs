import Vue from 'vue';
import Router from 'vue-router';
import Privacy from '@/components/Privacy';
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
import PasswordReset from '@/components/PasswordReset';
import ViewSchedule from '@/components/ViewSchedule';
import ViewAssignments from '@/components/ViewAssignments';
import EditHours from '@/components/EditHours';
import EditList from '@/components/EditList';
import EditProfile from '@/components/EditProfile';
import ViewAssets from '@/components/ViewAssets';
import EditAsset from '@/components/EditAsset';
import EditAssetFueling from '@/components/EditAssetFueling';
import ViewAssetFuelings from '@/components/ViewAssetFuelings';
import EditAssetService from '@/components/EditAssetService';
import ViewAssetServices from '@/components/ViewAssetServices';
import EditAssetPart from '@/components/EditAssetPart';
import ViewAssetParts from '@/components/ViewAssetParts';
import EditAssetRepair from '@/components/EditAssetRepair';
import ViewAssetRepairs from '@/components/ViewAssetRepairs';
import EditAssetMaintenance from '@/components/EditAssetMaintenance';
import ViewAssetMaintenances from '@/components/ViewAssetMaintenances';
import GoogleCalendar from '@/components/GoogleCalendar';
import EditBackflowAssembly from '@/components/EditBackflowAssembly';
import ViewBackflowAssemblies from '@/components/ViewBackflowAssemblies';
import CreateBackflowTestReportProperty from '@/components/CreateBackflowTestReportProperty';
import CreateBackflowTestReportDate from '@/components/CreateBackflowTestReportDate';
import EditBackflowTestReport from '@/components/EditBackflowTestReport';
import ViewBackflowTestReports from '@/components/ViewBackflowTestReports';
import PhreeBooksClients from '@/components/PhreeBooksClients';
import PhreeBooksContacts from '@/components/PhreeBooksContacts';
import PhreeBooksAddresses from '@/components/PhreeBooksAddresses';
import ViewBackflowOld from '@/components/ViewBackflowOld';
import EditClockIn from '@/components/EditClockIn';
import ViewClockIns from '@/components/ViewClockIns';
import Timecard from '@/components/Timecard';
import ViewTaskClockIns from '@/components/ViewTaskClockIns';
import ViewOverheadClockIns from '@/components/ViewOverheadClockIns';
import EditOverhead from '@/components/EditOverhead';
import EditSettings from '@/components/EditSettings';

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
      path: '/settings',
      name: 'EditSettings',
      component: EditSettings
    },
    {
      path: '/auth/password/reset',
      name: 'PasswordReset',
      component: PasswordReset
    },
    {
      path: '/client',
      name: 'NewClient',
      component: EditClient,
      meta: {
        title: 'New Client'
      },
    },
    {
      path: '/quick_client',
      name: 'QuickClient',
      component: QuickClient,
      meta: {
        title: 'Quick Client'
      },
    },
    {
      path: '/quick_order',
      name: 'QuickOrder',
      component: QuickOrder,
      meta: {
        title: 'New Order'
      },
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
      path: '/phree_books/clients',
      name: 'PhreeBooksClients',
      component: PhreeBooksClients
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
        title: 'Assignments'
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
      path: '/asset_types',
      name: 'EditAssetTypes',
      component: EditList
    },
    {
      path: '/asset_service_types',
      name: 'EditAssetServiceTypes',
      component: EditList
    },
    {
      path: '/asset_usage_types',
      name: 'EditAssetUsageTypes',
      component: EditList
    },
    {
      path: '/asset_units',
      name: 'EditAssetUnits',
      component: EditList
    },
    {
      path: '/asset_time_units',
      name: 'EditAssetTimeUnits',
      component: EditList
    },
    {
      path: '/asset_locations',
      name: 'EditAssetLocations',
      component: EditList
    },
    {
      path: '/profile',
      name: 'EditProfile',
      component: EditProfile
    },
    {
      path: '/assets',
      name: 'ViewAssets',
      component: ViewAssets,
      meta: {
        title: 'View Assets'
      }
    },
    {
      path: '/asset/:asset_id',
      name: 'EditAsset',
      component: EditAsset,
      props: true,
      meta: {
        title: 'Edit Asset'
      }
    },
    {
      path: '/asset',
      name: 'NewAsset',
      component: EditAsset,
      meta: {
        title: 'New Asset'
      }
    },
    {
      path: '/asset_fueling',
      name: 'NewAssetFueling',
      component: EditAssetFueling,
      meta: {
        title: 'New Fueling'
      }
    },
    {
      path: '/asset_fueling/:asset_fueling_id',
      name: 'EditAssetFueling',
      props: true,
      component: EditAssetFueling,
      meta: {
        title: 'Edit Fueling'
      }
    },
    {
      path: '/asset_fuelings',
      name: 'ViewAssetFuelings',
      component: ViewAssetFuelings,
      meta: {
        title: 'View Fuelings'
      }
    },
    {
        path: '/asset_service',
        name: 'NewAssetService',
        component: EditAssetService,
        meta: {
            title: 'New Service'
        }
    },
    {
        path: '/asset_service/:asset_service_id',
        name: 'EditAssetService',
        component: EditAssetService,
        props: true,
        meta: {
            title: 'Edit Service'
        }
    },
    {
      path: '/asset_services',
      name: 'ViewAssetServices',
      component: ViewAssetServices,
      meta: {
        title: 'View Services'
      }
    },
    {
        path: '/asset_part',
        name: 'NewAssetPart',
        component: EditAssetPart,
        meta: {
            title: 'New Part'
        }
    },
    {
        path: '/asset_part/:asset_part_id',
        name: 'EditAssetPart',
        component: EditAssetPart,
        props: true,
        meta: {
            title: 'Edit Part'
        }
    },
    {
      path: '/asset_parts',
      name: 'ViewAssetParts',
      component: ViewAssetParts,
      meta: {
        title: 'View Parts'
      }
    },
    {
        path: '/asset_repair',
        name: 'NewAssetRepair',
        component: EditAssetRepair,
        meta: {
            title: 'New Repair'
        }
    },
    {
        path: '/asset_repair/:asset_repair_id',
        name: 'EditAssetRepair',
        component: EditAssetRepair,
        props: true,
        meta: {
            title: 'Edit Repair'
        }
    },
    {
      path: '/asset_repairs',
      name: 'ViewAssetRepairs',
      component: ViewAssetRepairs,
      meta: {
        title: 'View Repairs'
      }
    },
    {
        path: '/asset_maintenance',
        name: 'NewAssetMaintenance',
        component: EditAssetMaintenance,
        meta: {
            title: 'New Maintenance'
        }
    },
    {
        path: '/asset_maintenance/:asset_maintenance_id',
        name: 'EditAssetMaintenance',
        component: EditAssetMaintenance,
        props: true,
        meta: {
            title: 'Edit Maintenance'
        }
    },
    {
      path: '/asset_maintenances',
      name: 'ViewAssetMaintenances',
      component: ViewAssetMaintenances,
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
        path: '/backflow_test_report/quick/property',
        name: 'NewBackflowTestReportProperty',
        component: CreateBackflowTestReportProperty,
        meta: {
            title: 'New Backflow Test Reports'
        }
    },
    {
        path: '/backflow_test_report/quick/date',
        name: 'NewBackflowTestReportDate',
        component: CreateBackflowTestReportDate,
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
    {
      path: '/backflow_old',
      name: 'ViewBackflowOld',
      component: ViewBackflowOld,
      meta: {
        title: 'View Backflow Old'
      }
    },
    {
        path: '/clock_in',
        name: 'NewClockIn',
        component: EditClockIn,
        meta: {
            title: 'New Clock In'
        }
    },
    {
        path: '/clock_in/:clock_in_id',
        name: 'EditClockIn',
        component: EditClockIn,
        props: true,
        meta: {
            title: 'Edit Clock In'
        }
    },
    {
      path: '/clock_ins',
      name: 'ViewClockIns',
      component: ViewClockIns,
      meta: {
        title: 'View Employee Clock Ins'
      }
    },
    {
      path: '/timecard',
      name: 'Timecard',
      component: Timecard,
      meta: {
        title: 'Timecard'
      }
    },
    {
      path: '/clock_ins/tasks',
      name: 'ViewTaskClockIns',
      component: ViewTaskClockIns,
      meta: {
        title: 'View Task Clock Ins'
      }
    },
    {
      path: '/clock_ins/overhead',
      name: 'ViewOverheadClockIns',
      component: ViewOverheadClockIns,
      meta: {
        title: 'View Overhead Clock Ins'
      }
    },
    {
      path: '/overhead',
      name: 'EditOverhead',
      component: EditOverhead,
      meta: {
        title: 'Edit Overhead'
      }
    },
    {
        path: '/privacy',
        name: 'Privacy',
        component: Privacy,
        meta: {
            title: 'Privacy Policy'
        }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;
  next();
});


export default router;
