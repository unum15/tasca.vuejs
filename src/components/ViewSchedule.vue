<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Scheduler
        </head>
        <main>
            <b-tabs :key="order_status_types.length" v-model="tab_index">
                <b-tab v-for="(index,tab) in tabs" :key="tab" :title="tab + ' Tasks'">
                    <ViewScheduleTasksTab
                        :tab="tab"
                        :task_actions="task_actions"
                        :labor_assignments="labor_assignments"
                        :task_statuses="task_statuses"
                        :labor_types="labor_types"
                        :appointment_statuses="appointment_statuses"
                        :labor_activities="labor_activities"
                    >
                    </ViewScheduleTasksTab>
                </b-tab>
                <b-tab v-for="(tab_data,tab) in order_tabs" :key="tab" :title="tab_data.title">
                    <ViewScheduleOrdersTab
                        :tab="tab"
                        :labor_activities="labor_activities"
                    >
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
            tabs: {'Service': 0, 'On Hold' : 1, 'All' : 2,  'Pending' : 3, 'Current' : 4},
            order_tabs: {'Non-Completed' : {title: 'Partly Completed Orders', index: 5}, 'Billing' : {title: 'Orders to Bill', index: 6}, 'Completed' : {title: 'Completed Orders', index: 7}},
            order_status_types: [],
            appointment_statuses: [],
            labor_assignments: [],
            labor_activities: [],
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
        this.$http.get('/labor_activities').then(response => {
			this.labor_activities = response.data.data;
		});
        this.$http.get('/labor_assignments').then(response => {
			this.labor_assignments = response.data.data;
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