<template>
	<b-container fluid-width>
        <b-row>
            <b-col>
                <b-form-group label="Task Type">
                    <b-form-radio-group
						@change="save();change_defaults();"
						v-model="my_task.task_type_id"
						:state="my_task.task_type_id != null"
						required
					>
                        <b-form-radio value="1">Non Billing</b-form-radio>
                        <b-form-radio value="2">Billing</b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
			<b-col>
                <b-form-group label="Name">
                    <b-form-input
                        type="text"
						@change="name_changed();save();"
                        v-model="my_task.name"
						:state="my_task.name != null"
                        required
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
		</b-row>
		<b-row>
            <b-col>
                <b-form-group label="Description">
                    <b-form-input
                        type="text"
						@change="save"
                        v-model="my_task.description"
						:state="my_task.description != null"
                        required
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
			<b-col>
                <b-form-group label="Category">
                    <b-form-select
                        :options="current_categories"
						@change="save"
                        value-field="id"
                        text-field="name"
                        v-model="my_task.task_category_id"
                        >
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Status">
                    <b-form-select
                        :options="current_statuses"
						@change="save"
                        value-field="id"
                        text-field="name"
                        v-model="my_task.task_status_id"
                        >
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Action">
                    <b-form-select
                        :options="current_actions"
						@change="save"
                        value-field="id"
                        text-field="name"
                        v-model="my_task.task_action_id"
                        >
                    </b-form-select>
                </b-form-group>
            </b-col>
        </b-row>
		<b-row>
			<b-col>
                <b-form-group label="Hold Date">
                    <b-form-input
                        type="date"
						@change="save"
                        v-model="my_task.hold_date"
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
			<b-col>
                <b-form-group label="Job Hours">
                    <b-form-input
                        type="text"
						@change="save"
                        v-model="my_task.job_hours"
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
			<b-col>
                <b-form-group label="Crew">
                    <b-form-select
                        :options="crews"
						@change="save"
                        value-field="id"
                        text-field="name"
                        v-model="my_task.crew_id"
                        >
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Crew Hours">
                    <b-form-input
                        type="text"
						@change="save"
                        v-model="my_task.crew_hours"
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
           <EditTaskDates :task_id="my_task.id"></EditTaskDates>
        </b-row>
        <b-row>
            <b-col>
                <b-form-group label="Group">
                    <b-form-input
						type="text"
						@change="save"
                        v-model="my_task.group"
                        >
                    </b-form-input>
                </b-form-group>
            </b-col>
			<b-col>
                <b-form-group label="Completion Date">
                    <b-form-input
                        type="date"
						@change="save"
                        v-model="my_task.completion_date"
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
			<b-col>
                <b-form-group label="Invoiced Date">
                    <b-form-input
                        type="date"
						@change="save"
                        v-model="my_task.invoiced_date"
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
			<b-col>
                <b-form-group label="Billed Date">
                    <b-form-input
                        type="date"
						@change="save"
                        v-model="my_task.billed_date"
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
			<b-col>
                <b-form-group label="Close Date">
                    <b-form-input
                        type="date"
						@change="save"
                        v-model="my_task.closed_date"
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
			<b-button variant="danger" size="sm" @click="deleteTask(task)">Delete Task</b-button>
        </b-row>
	</b-container>
</template>
<script>
import EditTaskDates from './EditTaskDates';
export default {
    name: 'EditTask',
	components: {
		'EditTaskDates': EditTaskDates
	},	
	props: {
		task: {required: true},
		task_types: {required: true},
		task_statuses: {required: true},
		task_actions: {required: true},
		task_categories: {required: true},
		crews: {required: true},
		project_close_date: {default: null},
		settings: {required: true}
	},
	data: function() {
		return {
			my_task: {}
		};
	},
	created() {
        this.my_task = this.task;
		this.save();
    },
	methods: {
		deleteTask() {
			this.$http.delete('/task/' + this.my_task.id);
			this.$emit('remove-task', this.my_task);
		},
		save() {
			if(this.my_task.billable === null){
				return;
			}
			if(this.my_task.id === null){
				this.$http.post('/task',this.my_task).then(response => {
					this.my_task.id = response.data.id;
				})
			}
			else{
				this.$http.patch('/task/'+this.my_task.id,this.my_task);
			}
		},
		change_defaults(){
			if(this.my_task.task_type_id == 2){
				this.my_task.task_category_id = this.settings.default_nonbilling_task_category_id;
				this.my_task.task_status_id = this.settings.default_nonbilling_task_status_id;
				this.my_task.task_action_id = this.settings.default_nonbilling_task_action_id;
			}
			else{
				this.my_task.task_category_id = this.settings.default_billing_task_category_id;
				this.my_task.task_status_id = this.settings.default_billing_task_status_id;
				this.my_task.task_action_id = this.settings.default_billing_task_action_id;
			}
		},
		name_changed(){
			if(this.my_task.description === null){
				this.my_task.description = this.my_task.name;
			}
		}
	},
	computed: {
		current_categories() {
			return this.task_categories.filter(category => {
                for (var i=0; i < category.task_types.length; i++) {
                  if (category.task_types[i].id == this.my_task.task_type_id) {
                        return true;
                    }
                }
				return false;
			})
		},
		current_statuses() {
			return this.task_statuses.filter(status => {
                for (var i=0; i < status.task_types.length; i++) {
                    if (status.task_types[i].id == this.my_task.task_type_id) {
                        return true;
                    }
                }
				return false;
			})
		},
		current_actions() {
			return this.task_actions.filter(action => {
                for (var i=0; i < action.task_types.length; i++) {
                    if (action.task_types[i].id == this.my_task.task_type_id) {
                        return true;
                    }
                }
				return false;
			})
		}
	},
    watch:{
        project_close_date(date){
            if(!this.my_task.closed_date){
                this.my_task.closed_date = date;
            }
        }
    }
}
</script>