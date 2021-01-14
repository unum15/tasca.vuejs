<template>
	<b-container fluid-width>
        <b-row>
            <b-col>
                <b-form-group label="Labor Type">
                    <b-form-radio-group
						@change="save();change_defaults();"
						:options="labor_types"
						value-field="id"
                        text-field="name"
						v-model="my_task.labor_type_id"
						:state="my_task.labor_type_id != null"
						required
					>
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
                <b-form-group label="Assignment">
                    <b-form-select
                        :options="current_categories"
						@change="save"
                        value-field="id"
                        text-field="name"
                        v-model="my_task.labor_assignment_id"
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
           <EditAppointments :task_id="my_task.id"></EditAppointments>
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
import EditAppointments from './EditAppointments';
export default {
    name: 'EditTask',
	components: {
		'EditAppointments': EditAppointments
	},	
	props: {
		task: {required: true},
		labor_types: {required: true},
		task_statuses: {required: true},
		task_actions: {required: true},
		labor_assignments: {required: true},
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
			if(this.my_task.name === null){
				return;
			}
			if(this.my_task.id === null){
				this.$http.post('/task',this.my_task).then(response => {
					this.my_task.id = response.data.data.id;
				})
			}
			else{
				this.$http.patch('/task/'+this.my_task.id,this.my_task);
			}
		},
		change_defaults(){
			if(this.my_task.labor_type_id == 2){
				this.my_task.labor_assignment_id = this.settings.default_nonbilling_labor_assignment_id;
				this.my_task.task_status_id = this.settings.default_nonbilling_task_status_id;
				this.my_task.task_action_id = this.settings.default_nonbilling_task_action_id;
			}
			else{
				this.my_task.labor_assignment_id = this.settings.default_billing_labor_assignment_id;
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
			return this.labor_assignments.filter(category => {
                for (var i=0; i < category.labor_types.length; i++) {
                  if (category.labor_types[i].id == this.my_task.labor_type_id) {
                        return true;
                    }
                }
				return false;
			})
		},
		current_statuses() {
			return this.task_statuses.filter(status => {
                for (var i=0; i < status.labor_types.length; i++) {
                    if (status.labor_types[i].id == this.my_task.labor_type_id) {
                        return true;
                    }
                }
				return false;
			})
		},
		current_actions() {
			return this.task_actions.filter(action => {
                for (var i=0; i < action.labor_types.length; i++) {
                    if (action.labor_types[i].id == this.my_task.labor_type_id) {
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