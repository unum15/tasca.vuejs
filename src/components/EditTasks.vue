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
			<b-tabs vertical pills v-model="current_tab">
				<b-tab
					v-for="(task, index) in tasks"
					:key="task.id"
					v-if="showTab(task)"
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
						:task_types="task_types"
						:task_statuses="task_statuses"
						:task_actions="task_actions"
						:task_categories="task_categories"
						:crews="crews"
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
		task_types: {required: true},
		task_statuses: {required: true},
		task_actions: {required: true},
		task_categories: {required: true},
		crews: {required: true},
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
				//console.log("on:"+this.order.name);
				this.newTask(this.order.name);
			}
			else{
				this.sortTasks();
			}
    })
  },
	methods: {
		newTask(name=null){
			//console.log('name:'+name);
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
				closed_date: null,
				billed_date: null,
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
			if((!this.filter.completed)&&((task.closed_date != null)&&((task.closed_date != '')))&&(task.closed_date < moment().subtract(400, 'days').format('YYYY-MM-DD'))){
				show = false;
			}
			return show;
		},
		isActive(index){
      if((this.change_tab)&&(index == this.tasks.length -1)){
        return true
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
				if((a.dates.length == 0) && (b.dates.length > 0)){
					return 1;
				}
				if((a.dates.length > 0) && (b.dates.length == 0)){
					return -1;
				}
				if((a.dates.length == 0) && (b.dates.length == 0)){
					return 0;
				}
				if(a.dates[0].date > b.dates[0].date){
					return 1;
				}
				if(a.dates[0].date < b.dates[0].date){
					return -1;
				}
				return 0;
			});
		}
  },
}
</script>
<style>
	.billed {
		color: #9b59b6;
	}
</style>