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
                        :task_appointment_statuses="task_appointment_statuses"
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
            tabs: ['Current', 'All', 'Pending', 'Unapproved'],
            order_status_types: [],
            task_appointment_statuses: [],
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
        this.$http.get('/task_appointment_statuses').then(response => {
			this.task_appointment_statuses = response.data;
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
    },
    methods: {
        info (item, index, button) {
            this.modalInfo.title = `Order# ${item.order_id}`
            this.modalInfo.order_id = item.order_id
            this.$root.$emit('bv::show::modal', 'modalInfo', button)
        },
        resetModal () {
            this.modalInfo.title = ''
            this.modalInfo.content = ''
            this.modalInfo.order_id = null
        },
        addTask (task){
            var new_task = {
                order_id: task.id,
                billable: true
            };
            this.$http.post('/task', new_task).then(response => {
				this.tasks.push(response.data);
			})
        },
        clearScheduleData(task){
            task.day = null;
            task.date = null;
            task.time = null;
            task.task.sort_order = null;
            this.save(task);
        },
        save(item){
            var task_date = {
                day : item.day,
                date : item.date,
                time : item.time
            }
            if(item.id){
                this.$http.patch('/task_date/' + item.id, task_date);
            }
            else{
                this.$http.post('/task_date/', task_date).then(response =>{
                    item.id = response.id;
                })
            }
            var task = {
                sort_order : item.sort_order,
                task_appointment_status_id: item.task_appointment_status_id,
                task_category_id: item.task_category_id,
                task_status_id: item.task_status_id,
                task_action_id: item.task_action_id
            }
            this.$http.patch('/task/' + item.task_id, task);
        }
    }
}
</script>