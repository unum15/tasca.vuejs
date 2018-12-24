<template>
	<b-container>
        <b-row>
            <b-col>
                <b-form-group label="Task Type">
                    <b-form-radio-group
						@change="save"
						v-model="my_task.task_type_id"
						:state="my_task.task_type_id != null"
						required
					>
                        <b-form-radio value="1">Service Order</b-form-radio>
                        <b-form-radio value="2">Work Order</b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
			<b-col>
                <b-form-group label="Name">
                    <b-form-input
                        type="text"
						@change="save"
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
                <b-form-group label="Status">
                    <b-form-select
                        :options="task_statuses"
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
                        :options="task_actions"
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
                <b-form-group label="Day">
                    <b-form-input
                        type="text"
						@change="save"
                        v-model="my_task.day"
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Date">
                    <b-form-input
                        type="date"
						@change="save"
                        v-model="my_task.date"
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Time">
                    <b-form-input
                        type="text"
						@change="save"
                        v-model="my_task.time"
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-group label="Group">
                    <b-form-select
                        :options="task_group_options"
						@change="save"
                        v-model="my_task.group"
                        >
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Sort Order">
                    <b-form-select
						:options="task_sort_options"
						@change="save"
                        v-model="my_task.sort_order"
                    >
                    </b-form-select>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
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
			<b-button variant="danger" size="sm" @click="deleteTask(task)">Delete Task</b-button>
        </b-row>
	</b-container>
</template>
<script>
export default {
    name: 'EditTask',
	props: {
		task: {required: true},
		task_types: {required: true},
		task_statuses: {required: true},
		task_actions: {required: true},
	},
	data: function() {
		return {
			my_task: {},
            crews: []
		};
	},
	created() {
        this.my_task = this.task;
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
				this.$http.patch('/task/'+this.my_task.id,this.my_task).then(response => {
					this.my_task.id = response.data.id;
				})
			}
		}
	},
	computed: {
		task_sort_options : function (){
			// Chrome can't handle this yet
			//return [for (i of Array(100).keys()) i+1];
			var options = Array();
			for(var x=1;x<=100;x++){
				options.push(x);
			}
			return options;
		},
		task_group_options : function (){
			// Chrome can't handle this yet
			//return [for (i of Array(26).keys()) String.fromCharCode(65 + i)];
			var options = Array();
			for(var x=65;x<91;x++){
				options.push(String.fromCharCode(x));
			}
			return options;
		}
	}
}
</script>