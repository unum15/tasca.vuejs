<template>
    <div>
        <b-navbar toggleable="md" type="dark" variant="dark">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand href="/">Tasca</b-navbar-brand>
            <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav>
                <b-nav-item href="/quick_order">Quick Order Form</b-nav-item>
                <b-nav-item href="/projects/edit">List Projects</b-nav-item>
                <b-nav-item href="/assignments">Assignments</b-nav-item>
                <b-nav-item href="/scheduler">Scheduler</b-nav-item>
                <b-nav-item-dropdown>
                    <template slot="button-content">
                      <em>Clients</em>
                    </template>
                    <b-dropdown-item href="/clients">Clients</b-dropdown-item>
                    <b-dropdown-item href="/client/quick">New Client</b-dropdown-item>
                    <b-dropdown-item href="/client">New Client - Full</b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item-dropdown>
                    <template slot="button-content">
                      <em>Lists</em>
                    </template>
                    <b-dropdown-item href="/clients">Clients</b-dropdown-item>
                    <b-dropdown-item href="/contacts">Contacts</b-dropdown-item>
                    <b-dropdown-item href="/properties">Properties</b-dropdown-item>
                    <b-dropdown-item href="/projects/view">Projects</b-dropdown-item>
                    <b-dropdown-item href="/orders">Orders</b-dropdown-item>
                    <b-dropdown-item href="/tasks">Tasks</b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item-dropdown>
                    <template slot="button-content">
                      <em>Hours</em>
                    </template>
                    <b-dropdown-item href="/clock_ins">Overview</b-dropdown-item>
                    <b-dropdown-item href="/timecard">Individual Timecards</b-dropdown-item>
                    <b-dropdown-item href="/hours">All</b-dropdown-item>
                    <b-dropdown-item href="/clock_in">New Clock In</b-dropdown-item>
                    <b-dropdown-item href="/timecard">Timecard</b-dropdown-item>
                    <b-dropdown-item href="/clock_ins/tasks">Tasks</b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item-dropdown v-if="phreebooks == 'true'">
                    <template slot="button-content">
                      <em>Phree Books</em>
                    </template>
                    <b-dropdown-item href="/phree_books/clients">Clients</b-dropdown-item>
                    <b-dropdown-item href="/phree_books/contacts">Contacts</b-dropdown-item>
                    <b-dropdown-item href="/phree_books/addresses">Addresses</b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item-dropdown>
                    <template slot="button-content">
                      <em>Garage</em>
                    </template>
                    <b-dropdown-item href="/asset_fueling">New Fueling</b-dropdown-item>
                    <b-dropdown-item href="/asset_fuelings">View Fuelings</b-dropdown-item>
                    <b-dropdown-item href="/asset_service">New Service</b-dropdown-item>
                    <b-dropdown-item href="/asset_services">View Services</b-dropdown-item>
                    <b-dropdown-item href="/asset_part">New Part</b-dropdown-item>
                    <b-dropdown-item href="/asset_parts">View Parts</b-dropdown-item>
                    <b-dropdown-item href="/asset_repair">New Repair</b-dropdown-item>
                    <b-dropdown-item href="/asset_repairs">View Repairs</b-dropdown-item>
                    <b-dropdown-item href="/asset_maintenance">New Maintenance</b-dropdown-item>
                    <b-dropdown-item href="/asset_maintenances">View Maintenances</b-dropdown-item>
                    <b-dropdown-item href="/asset">New Asset</b-dropdown-item>
                    <b-dropdown-item href="/assets">View Assets</b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item-dropdown v-if="backflows == 'true'">
                    <template slot="button-content">
                      <em>Backflows</em>
                    </template>
                    <b-dropdown-item href="/backflow_assembly">New Backflow Assembly</b-dropdown-item>
                    <b-dropdown-item href="/backflow_assemblies">View Backflow Assemblies</b-dropdown-item>
                    <b-dropdown-item href="/backflow_test_report/quick/property">Quick Test Results by Property</b-dropdown-item>
                    <b-dropdown-item href="/backflow_test_report/quick/date">Quick Test Results by Date</b-dropdown-item>
                    <b-dropdown-item href="/backflow_test_report">Edit Backflow Test Reports</b-dropdown-item>
                    <b-dropdown-item href="/backflow_test_reports">View Backflow Test Reports</b-dropdown-item>
                    <b-dropdown-item href="/backflow_old">View Backflow Old</b-dropdown-item>
                    <b-dropdown-item href="/backflow_water_system">New Backflow Water System</b-dropdown-item>
                    <b-dropdown-item href="/backflow_water_systems">View Backflow Water Systems</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                    <template slot="button-content">
                      <em>Settings</em>
                    </template>
                    <b-dropdown-item href="/settings" v-if="false">General</b-dropdown-item>
                    <b-dropdown-item href="/activity_levels">Activity Levels</b-dropdown-item>
                    <b-dropdown-item href="/appointment_statuses">Appointment Statuses</b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-group header="Assets">
                        <b-dropdown-item href="/asset_service_types">Asset Service Types</b-dropdown-item>
                        <b-dropdown-item href="/asset_usage_types">Asset Usage Types</b-dropdown-item>
                        <b-dropdown-item href="/asset_units">Asset Units</b-dropdown-item>
                        <b-dropdown-item href="/asset_time_units">Asset Time Units</b-dropdown-item>
                        <b-dropdown-item href="/asset_locations">Asset Locations</b-dropdown-item>
                        <b-dropdown-item href="/asset_types">Asset Types</b-dropdown-item>
                    </b-dropdown-group>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item href="/client_types">Client Types</b-dropdown-item>
                    <b-dropdown-item href="/contact_methods">Contact Methods</b-dropdown-item>
                    <b-dropdown-item href="/contact_types">Contact Types</b-dropdown-item>
                    <b-dropdown-item href="/crews">Crews</b-dropdown-item>
                    <b-dropdown-item href="/email_types">Email Types</b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-group header="Orders">
                    <b-dropdown-item href="/order_actions">Order Actions</b-dropdown-item>
                    <b-dropdown-item href="/order_categories">Order Categories</b-dropdown-item>
                    <b-dropdown-item href="/order_priorities">Order Priorities</b-dropdown-item>
                    <b-dropdown-item href="/order_statuses">Order Statuses</b-dropdown-item>
                    <b-dropdown-item href="/order_types">Order Types</b-dropdown-item>
                    </b-dropdown-group>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-item href="/phone_number_types">Phone Number Types</b-dropdown-item>
                    <b-dropdown-item href="/property_types">Property Types</b-dropdown-item>
                    <b-dropdown-item href="/roles">Roles</b-dropdown-item>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-group header="Tasks">
                    <b-dropdown-item href="/task_actions">Task Actions</b-dropdown-item>
                    <b-dropdown-item href="/task_statuses">Task Statuses</b-dropdown-item>
                    </b-dropdown-group>
                    <b-dropdown-divider></b-dropdown-divider>
                    <b-dropdown-group header="Labor">
                    <b-dropdown-item href="/labor">Labor Mappings</b-dropdown-item>
                    <b-dropdown-item href="/labor_assignments">Labor Assignments</b-dropdown-item>
                    <b-dropdown-item href="/labor_types">Labor Types</b-dropdown-item>
                    </b-dropdown-group>
                    <b-dropdown-divider></b-dropdown-divider>
                </b-nav-item-dropdown>
                <b-nav-item-dropdown right>
                    <template slot="button-content">
                      <em>User</em>
                    </template>
                    <b-dropdown-item href="/profile">Profile</b-dropdown-item>
                    <b-dropdown-item href="/calendar">Calendar</b-dropdown-item>
                    <b-dropdown-item @click="signOut">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    export default {
        name: 'TopMenu',
        methods: {
            signOut(){
				this.$http.post('/unauth')
				.then(() => {
					localStorage.clear();
                    this.$router.push('/');
				})
			},
        },
        computed: {
            ...mapState({
                backflows: state => state.settings.backflows,
                phreebooks: state => state.settings.phreebooks,
            }),
        }
    };
</script>
