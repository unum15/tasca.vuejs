<template>
		<div>
			<b-container fluid>
			<b-form-row>
				<b-col>
          <b-form-group  :label-cols="10" label="Show Closed Greater Than 400 Days">
            <b-form-checkbox
              v-model="filter.completed"
            >
            </b-form-checkbox>
          </b-form-group>
				</b-col>
			</b-form-row>
    </b-container>
			<b-tabs vertical pills v-model="current_tab" :key="tasks.length">
				<b-tab
					v-for="(task, index) in filtered_tasks"
					:key="index"
					:active="isActive(index)"
				>
					<template slot="title" style="text-align:left">
						<div class="text-left" v-bind:class="{'text-danger': task.closed_date, 'billed': task.billed_date || task.completion_date}">
							{{ task.name !== null ? task.name : 'Task ' + (task.id !== null ? task.id : 'New') }}
						</div>
					</template>
					<EditTask
						:order="order"
						:task="task"
						:labor_types="labor_types"
						:task_statuses="task_statuses"
						:task_actions="task_actions"
						:labor_assignments="labor_assignments"
						:crews="crews"
						:project_close_date="project_close_date"
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
import moment from 'moment'
export default {
    name: 'EditTasks',
    components: {
        'EditTask': EditTask
    },
	props: {
		order: {required: true},
		labor_types: {required: true},
		task_statuses: {required: true},
		task_actions: {required: true},
		labor_assignments: {required: true},
		crews: {required: true},
		project_close_date: {default: null},
		task_id: {default: null},
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
				this.newTask(this.order.name);
			}
			else{
				this.sortTasks();
			}
    })
  },
	methods: {
		newTask(name=null){
			var task = {
				id: null,
				order_id: this.order.id,
				labor_type_id: this.settings.default_labor_type_id,
				appointments: [ {date: null, time:null, day: null}],
				name: name,
				description: name,
				approval_date: null,
				completion_date: null,
				expiration_date: null,
				closed_date: null,
				billed_date: null,
				labor_assignment_id: this.settings['default_labor_assignment_id-labor_type_id-' + this.settings.default_labor_type_id],
				task_status_id: this.settings['default_task_status_id-labor_type_id-' + this.settings.default_labor_type_id],
				task_action_id: this.settings['default_task_action_id-labor_type_id-' + this.settings.default_labor_type_id],
				notes: null,
				task_hours: null,
				crew_hours: null
			};
			this.tasks.push(task);
			this.change_tab = true;
		},
		removeTask: function(task){
			this.tasks = this.tasks.filter(t => t.id !== task.id);
		},
		isActive(index){
      if((this.change_tab)&&(index == this.tasks.length -1)){
        return true
      }
			if(this.task_id == this.tasks[index].id){
				this.$emit('set-task-tab', this.tasks[index])
        return true;
      }
      return false
    },
		sortTasks(){
			this.tasks = this.tasks.sort((a, b) => {
				if(((a.closed_date == null) || (a.closed_date == '')) && ((b.closed_date != null) && (b.closed_date != ''))){
					return -1;
				}
				if(((a.closed_date != null) && (a.closed_date != '')) && ((b.closed_date == null) || (b.closed_date == ''))){
					return 1;
				}
				if(a.closed_date > b.closed_date){
					return 1;
				}
				if(a.closed_date < b.closed_date){
					return -1;
				}
				if((a.appointments.length == 0) && (b.appointments.length > 0)){
					return 1;
				}
				if((a.appointments.length > 0) && (b.appointments.length == 0)){
					return -1;
				}
				if((a.appointments.length == 0) && (b.appointments.length == 0)){
					return 0;
				}
				if(a.appointments[0].date > b.appointments[0].date){
					return 1;
				}
				if(a.appointments[0].date < b.appointments[0].date){
					return -1;
				}
				return 0;
			});
		}
  },
	computed: {
		filtered_tasks(){
			return this.tasks.filter(task => {
				var show = true;
				if((!this.filter.completed)&&((task.closed_date != null)&&((task.closed_date != '')))&&(task.closed_date < moment().subtract(400, 'days').format('YYYY-MM-DD'))){
					show = false;
				}
				return show;
			});
		}
	}
}
</script>
<style>
	.billed {
		color: #9b59b6;
	}
</style>