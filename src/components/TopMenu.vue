<template>
    <div>
        <b-navbar toggleable="md" type="dark" variant="dark">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand href="#">Tasca</b-navbar-brand>
            <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav>
                <b-nav-item href="#/scheduler">Scheduler</b-nav-item>
                <b-nav-item-dropdown>
                    <template slot="button-content">
                      <em>Clients</em>
                    </template>
                    <b-dropdown-item href="#/clients">Clients</b-dropdown-item>
                    <b-dropdown-item href="#/quick_client">New Quick Form</b-dropdown-item>
                    <b-dropdown-item href="#/client">New Full Form</b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item-dropdown>
                    <template slot="button-content">
                      <em>Lists</em>
                    </template>
                    <b-dropdown-item href="#/clients">Clients</b-dropdown-item>
                    <b-dropdown-item href="#/contacts">Contacts</b-dropdown-item>
                    <b-dropdown-item href="#/properties">Properties</b-dropdown-item>
                    <b-dropdown-item href="#/projects">Projects</b-dropdown-item>
                    <b-dropdown-item href="#/orders">Orders</b-dropdown-item>
                    <b-dropdown-item href="#/tasks">Tasks</b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item-dropdown>
                    <template slot="button-content">
                      <em>Time Cards</em>
                    </template>
                    <b-dropdown-item href="#/hours">Hours</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
            
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                    <template slot="button-content">
                      <em>Settings</em>
                    </template>
                    <b-dropdown-item href="#/activity_levels">Activity Levels</b-dropdown-item>
                    <b-dropdown-item href="#/client_types">Client Types</b-dropdown-item>
                    <b-dropdown-item href="#/contact_methods">Contact Methods</b-dropdown-item>
                    <b-dropdown-item href="#/contact_types">Contact Types</b-dropdown-item>
                    <b-dropdown-item href="#/email_types">Email Types</b-dropdown-item>
                    <b-dropdown-item href="#/order_actions">Order Actions</b-dropdown-item>
                    <b-dropdown-item href="#/order_categories">Order Categories</b-dropdown-item>
                    <b-dropdown-item href="#/order_priorities">Order Priorities</b-dropdown-item>
                    <b-dropdown-item href="#/order_statuses">Order Statuses</b-dropdown-item>
                    <b-dropdown-item href="#/order_types">Order Types</b-dropdown-item>
                    <b-dropdown-item href="#/phone_number_types">Phone Number Types</b-dropdown-item>
                    <b-dropdown-item href="#/property_types">Property Types</b-dropdown-item>
                    <b-dropdown-item href="#/task_actions">Task Actions</b-dropdown-item>
                    <b-dropdown-item href="#/task_appointment_statuses">Task Appointment Statuses</b-dropdown-item>
                    <b-dropdown-item href="#/task_categories">Task Categories</b-dropdown-item>
                    <b-dropdown-item href="#/task_statuses">Task Statuses</b-dropdown-item>
                    <b-dropdown-item href="#/task_types">Task Types</b-dropdown-item>
                    <b-dropdown-item href="#/work_types">Work Types</b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item-dropdown right>
                    <template slot="button-content">
                      <em>User</em>
                    </template>
                    <b-dropdown-item href="#/profile">Profile</b-dropdown-item>
                    <b-dropdown-item href="#/calendar">Calendar</b-dropdown-item>
                    <b-dropdown-item @click="signOut">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
</template>
<script>
    export default {
        name: 'TopMenu',
        methods: {
            signOut(){
				this.$router.push('/');
				this.$http.post('/unauth')
				.then(request => {
					localStorage.clear();
				})
			},
        }
    };
</script>