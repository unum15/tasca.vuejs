<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Scheduler
        </head>
        <main>
            <b-tabs :key="order_status_types.length" v-model="tab_index">
                <b-tab v-for="tab in tabs" :key="tab" :title="tab + ' Tasks'">
                    <ViewScheduleTasksTab
                        :tab="tab"
                        :task_actions="task_actions"
                        :labor_assignments="labor_assignments"
                        :task_statuses="task_statuses"
                        :labor_types="labor_types"
                        :appointment_statuses="appointment_statuses"
                    >
                    </ViewScheduleTasksTab>
                </b-tab>
                <b-tab v-for="(title,tab) in order_tabs" :key="tab" :title="title">
                    <ViewScheduleOrdersTab :tab="tab">
                    </ViewScheduleOrdersTab>
                </b-tab>
            </b-tabs>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
import ViewScheduleTasksTab from './ViewScheduleTasksTab';
import ViewScheduleOrdersTab from './ViewScheduleOrdersTab';
export default {
    name: 'ViewSchedule',
    components: {
        'TopMenu': TopMenu,
        'ViewScheduleTasksTab': ViewScheduleTasksTab,
        'ViewScheduleOrdersTab': ViewScheduleOrdersTab
    },
    data() {
        return {
            tabs: ['Service', 'On Hold', 'All',  'Pending', 'Current'],
            order_tabs: {'Non-Completed' : 'Partly Completed Orders', 'Completed' : 'Completed Orders'},
            order_status_types: [],
            appointment_statuses: [],
            labor_assignments: [],
            task_statuses: [],
            task_actions: [],
            labor_types: [],
            tab_index: 4
        }
    },
    created() {
        this.$http.get('/order_status_types').then(response => {
			this.order_status_types = response.data;
		});
        this.$http.get('/appointment_statuses').then(response => {
			this.appointment_statuses = response.data;
		});
        this.$http.get('/labor_assignments').then(response => {
			this.labor_assignments = response.data;
		});
		this.$http.get('/task_statuses').then(response => {
			this.task_statuses = response.data;
		});
		this.$http.get('/task_actions').then(response => {
			this.task_actions = response.data;
		});
        this.$http.get('/labor_types').then(response => {
			this.labor_types = response.data;
		});
    }
}
</script>