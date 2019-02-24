<template>
		<div>
			<b-container fluid>
			<b-form-row>
				<b-col>
          <b-form-group horizontal :label-cols="10" label="Show Completed">
            <b-form-checkbox
              v-model="filter.completed"
            >
            </b-form-checkbox>
          </b-form-group>
				</b-col>
			</b-form-row>
    </b-container>
			<b-tabs vertical pills v-model="current_tab">
				<b-tab
					v-for="task in tasks"
					:key="task.id"
					:title="task.name !== null ? task.name : 'Task ' + (task.id !== null ? task.id : 'New')"
					v-if="showTab(task)"
				>
					<EditTask
						:order="order"
						:task="task"
						:task_types="task_types"
						:task_statuses="task_statuses"
						:task_actions="task_actions"
						:task_categories="task_categories"
						:settings="settings"
						@remove-task="removeTask"
					></EditTask>
				</b-tab>
			</b-tabs>
			<b-button variant="secondary" @click="newTask(null)">Add New Task</b-button>
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
		task_types: {required: true},
		task_statuses: {required: true},
		task_actions: {required: true},
		task_categories: {required: true},
		settings: {required: true}
	},
	data: function() {
		return {
			tasks: [],
			current_tab: 0,
			change_tab: false,
			filter: {
				completed: false
			}
		}
	},
	created() {
     this.$http.get('/tasks?order_id=' + this.order.id).then(response => {
      this.tasks = response.data
			if(this.tasks.length == 0){
				console.log("on:"+this.order.name);
				this.newTask(this.order.name);
			}
    })
  },
	methods: {
		newTask(name=null){
			console.log('name:'+name);
			var task = {
				id: null,
				order_id: this.order.id,
				task_type_id: 2,
				dates: [ {date: null, time:null, day: null}],
				name: name,
				description: name,
				approval_date: null,
				completion_date: null,
				expiration_date: null,
				task_category_id: this.settings.default_billing_task_category_id,
				task_status_id: this.settings.default_billing_task_status_id,
				task_action_id: this.settings.default_billing_task_action_id,
				notes: null,
				job_hours: null,
				crew_hours: null
			};
			this.tasks.push(task);
			this.change_tab = true;
		},
		removeTask: function(task){
			this.tasks = this.tasks.filter(t => t.id !== task.id);
		},
		showTab(task){
			var show = true;
			if((!this.filter.completed)&&(task.completion_date != null)){
				show = false;
			}
			return show;
		}
  },
	updated() {
		if(this.change_tab){
			this.current_tab = this.tasks.length-1;
			this.change_tab =  false;
		}
  },
	watch:{
		order_name(){
			console.log(this.order_name)
		}
	}
}
</script>