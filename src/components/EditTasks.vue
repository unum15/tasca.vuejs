<template>
		<div>
			<b-tabs vertical pills v-model="tasks_tab_index">
				<b-tab v-for="task in my_tasks" :key="task.id" :title="task.id">
					<TaskForm :task="task" :task_types="task_types" :task_statuses="task_statuses" :task_actions="task_actions"></TaskForm>
				</b-tab>
			</b-tabs>
			<b-button variant="secondary" @click="newTask">Add New Task</b-button>
		</div>
</template>
<script>
import TaskForm from './TaskForm'
export default {
    name: 'EditTasks',
    components: {
        'TaskForm': TaskForm
    },
	props: {
		tasks: {required: true},
		task_types: {required: true},
		task_statuses: {required: true},
		task_actions: {required: true},
	},
	data: function() {
		return {
			tasks_tab_index: 0,
			new_tasks: 0,
			my_tasks: []
		};
	},
	created() {
        this.my_tasks = this.tasks;
    },
	methods: {
		newTask: function(){
			this.new_tasks++;
			var task = {
				id: 'New Task '+this.new_tasks,
				date: null,
				approval_date: null,
				completion_date: null,
				expiration_date: null,
				description: '',
				priority_id: null,
				notes: '',
				job_hours: 0,
				crew_hours: 0
			};
			this.my_tasks.push(task);
		},
		deleteTask: function(task){
			this.my_tasks = this.my_tasks.filter(x => x !== task);
		},
  },
}
</script>