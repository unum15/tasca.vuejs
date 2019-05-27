<template>
    <div>
        <b-container>
            <b-row>
                <b-col class="label">Task</b-col>
                <b-col class="data">{{ task.name }}</b-col>
                <b-col class="label">Hours</b-col>
                <b-col class="data">{{ task.task_hours }}</b-col>
                <b-col class="label">Crew Time</b-col>
                <b-col class="data">{{ task.crew_hours }}</b-col>
            </b-row>
            <b-row>
                <b-col class="label">Task Description</b-col>
                <b-col class="data" cols="10">{{ task.description }}</b-col>
            </b-row>
            <b-row>
                <b-col class="label">Completed</b-col>
                <b-col>
                    <b-form-checkbox v-model="completed" @input="markCompleted">
                    </b-form-checkbox>
                </b-col>
                <b-col class="label">Billed</b-col>
                <b-col>
                    <b-form-checkbox v-model="billed" @input="markBilled">
                    </b-form-checkbox>
                </b-col>
            </b-row>
        </b-container>
        <ViewHours :id="task_id" type="task">
        </ViewHours>
    </div>
</template>
<script>
import moment from 'moment'
import ViewHours from './ViewHours'
export default {
    name: 'ViewTaskHours',
    components: {
        'ViewHours': ViewHours,
    },
    props: {
        task_id : { required:true }
    },
    data() {
        return {
            task: { },
            billed: false,
            completed: false,
            sign_ins: [],
            task_dates: [],
            employees_hours: []
        };
    },
    created() {
        this.getTask();
        this.getEmployeesHours();
        this.getTaskDates();
        this.getSignIns();

    },
    methods: {
        getTask() {
            this.$http.get('/task/' + this.task_id).then((results) => {
                this.task = results.data;
                this.completed = this.task.completion_date != null;
                this.billed = this.task.billed_date != null;
            });
        },
        getEmployeesHours() {
            this.$http.get('/sign_ins/by_employee?task_id=' + this.task_id).then((results) => {
                this.employees_hours = results.data;
            });
        },
        getSignIns() {
            this.$http.get('/sign_ins?task_id=' + this.task_id).then((results) => {
                this.sign_ins = results.data;
            });
        },
        getTaskDates() {
            this.$http.get('/task_dates?task_id=' + this.task_id).then((results) => {
                this.task_dates = results.data;
            });
        },
        timeDiff(start_time, stop_time){
            var start = moment(start_time)
            var stop = moment();
            if(stop_time){
                stop = moment(stop_time)
            }
            var diff = Math.round(stop.diff(start)/36000)/100
            
            return diff
        },
        formatTime(time){
            if(time == null){
                return "";
            }
            return moment(time).format('MM-DD hh:mm')
        },
        markCompleted(){
            let task = {
                completion_date: this.completed ? moment().format('YYYY-MM-DD') : null
            }
            this.$http.patch('/task/' + this.task_id, task);
        },
        markBilled(){
            let task = {
                billed_date: this.billed ? moment().format('YYYY-MM-DD') : null
            }
            this.$http.patch('/task/' + this.task_id, task);
        },
        editSignIn(sign_in,field){
            var new_value = null;
            var old_value = !sign_in[field] ? '' : sign_in[field];
            new_value = prompt('Change ' + field, old_value);
            if(new_value != null){
                sign_in[field] = new_value;
                this.$http.patch('/sign_in/' + sign_in.id, sign_in);
            }
        }
    },
    computed: {
    },
}
</script>
<style scoped>
.label {
    text-align: right;
    font-weight: bold;
}

.header {
    font-weight: bold;
}

.data {
    text-align: left;
}
</style>