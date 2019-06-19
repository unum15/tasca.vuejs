<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Scheduler
        </head>
        <main>
            <b-tabs :key="order_status_types.length">
                <b-tab v-for="tab in tabs" :key="tab" :title="tab + ' Tasks'">
                    <ScheduleTab
                        :tab="tab"
						:task_actions="task_actions"
                        :task_categories="task_categories"
                        :task_statuses="task_statuses"
                        :task_types="task_types"
                        :appointment_statuses="appointment_statuses"
                    >
                    </ScheduleTab>
                </b-tab>
                <b-tab title="Completed Orders">
                    <CompletedTab>
                    </CompletedTab>
                </b-tab>
            </b-tabs>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
import ScheduleTab from './ScheduleTab';
import CompletedTab from './CompletedTab';
export default {
    name: 'ViewSchedule',
    components: {
        'TopMenu': TopMenu,
        'ScheduleTab': ScheduleTab,
        'CompletedTab': CompletedTab
    },
    data() {
        return {
            tabs: ['Current', 'All', 'Pending', 'On Hold'],
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