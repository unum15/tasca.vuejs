<template>
	<b-container>
        <b-row>
            <b-col>
                <b-form-group label="Task Type">
                    <b-form-radio-group id="task_type" v-model="task.type" required>
                        <b-form-radio value="service_order">Service Order</b-form-radio>
                        <b-form-radio value="work_order">Work Order</b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-group label="Description">
                    <b-form-input
                        type="text"
                        v-model="task.description"
                        required
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-group label="Type">
                    <b-form-select
                        :options="task_types"
                        value-field="id"
                        text-field="name"
                        v-model="task.task_type_id"
                        required
                        >
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Status">
                    <b-form-select
                        :options="task_statuses"
                        value-field="id"
                        text-field="name"
                        v-model="task.task_status_id"
                        required
                        >
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Action">
                    <b-form-select
                        :options="task_actions"
                        value-field="id"
                        text-field="name"
                        v-model="task.task_action_id"
                        required
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
                        v-model="task.day"
                        required
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Date">
                    <b-form-input
                        type="date"
                        v-model="task.date"
                        required
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Time">
                    <b-form-input
                        type="text"
                        v-model="task.time"
                        required
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
                        v-model="task.task_group"
                        >
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Sort">
                    <b-form-select
                        :options="task_sort_options"
                        v-model="task.task_sort"
                        >
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Sort Order">
                    <b-form-input
                        type="text"
                        v-model="task.sort_order"
                        required
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-group label="Crew">
                    <b-form-select
                        :options="crews"
                        value-field="id"
                        text-field="name"
                        v-model="task.crew_id"
                        required
                        >
                    </b-form-select>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Job Hours">
                    <b-form-input
                        type="text"
                        v-model="task.job_hours"
                        required
                    >
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Crew Hours">
                    <b-form-input
                        type="text"
                        v-model="task.crew_hours"
                        required
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
    name: 'TaskForm',
	props: {
		task: {required: true},
		task_types: {required: true},
		task_statuses: {required: true},
		task_actions: {required: true},
	},
	data: function() {
		return {
            crews: []
		};
	},
	created() {
        this.my_task = this.task;
    },
	methods: {
		deleteTask: function(task){
			this.my_tasks = this.my_tasks.filter(x => x !== task);
		},
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