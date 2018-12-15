<template>
		<div>
			<b-tabs vertical pills v-model="tasks_tab_index">
				<b-tab v-for="task in tasks" :key="task.id" :title="task.name !== null ? task.name : 'Task ' + (task.id !== null ? task.id : 'New')">
					<EditTask :order="order" :task="task" :task_types="task_types" :task_statuses="task_statuses" :task_actions="task_actions"></EditTask>
				</b-tab>
			</b-tabs>
			<b-button variant="secondary" @click="newTask">Add New Task</b-button>
		</div>
</template>
<script>
import EditTask from './EditTask'
export default {
    name: 'EditTasks',
    components: {
        'EditTask': EditTask
    },
	props: {
		order: {required: true},
		order_type: {required: true},
		task_types: {required: true},
		task_statuses: {required: true},
		task_actions: {required: true},
	},
	data: function() {
		return {
			tasks: [],
			tasks_tab_index: 0
		};
	},
	created() {
     this.$http.get('/tasks?' +this.order_type + '_id=' + this.order.id).then(response => {
      this.tasks = response.data
    })
  },
	methods: {
		newTask: function(){
			this.new_tasks++;
			var task = {
				id: null,
				order_id: this.order.id,
				billable: true,
				date: null,
				name: null,
				approval_date: null,
				completion_date: null,
				expiration_date: null,
				description: null,
				priority_id: null,
				notes: null,
				job_hours: null,
				crew_hours: null
			};
			this.tasks.push(task);
		},
		deleteTask: function(task){
			this.tasks = this.my_tasks.filter(x => x !== task);
		},
  },
}
</script>