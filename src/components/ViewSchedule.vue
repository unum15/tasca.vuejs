<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Scheduler
        </head>
        <main>
            <b-tabs :key="order_status_types.length">
                <b-tab v-for="tab in tabs" :key="tab" :title="tab + ' Tasks'">
                    <ViewScheduleTasksTab
                        :tab="tab"
                        :task_actions="task_actions"
                        :task_categories="task_categories"
                        :task_statuses="task_statuses"
                        :task_types="task_types"
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
            tabs: ['Current', 'All', 'Service', 'Pending', 'On Hold'],
            order_tabs: {'Non-Completed' : 'Partly Completed Orders', 'Completed' : 'Completed Orders'},
            order_status_types: [],
            appointment_statuses: [],
            task_categories: [],
            task_statuses: [],
            task_actions: [],
            task_types: []
        }
    },
    created() {
        this.$http.get('/order_status_types').then(response => {
			this.order_status_types = response.data;
		});
        this.$http.get('/appointment_statuses').then(response => {
			this.appointment_statuses = response.data;
		});
        this.$http.get('/task_categories').then(response => {
			this.task_categories = response.data;
		});
		this.$http.get('/task_statuses').then(response => {
			this.task_statuses = response.data;
		});
		this.$http.get('/task_actions').then(response => {
			this.task_actions = response.data;
		});
        this.$http.get('/task_types').then(response => {
			this.task_types = response.data;
		});
    }
}
</script>