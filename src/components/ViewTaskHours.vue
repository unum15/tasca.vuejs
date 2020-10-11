<template>
    <div>
        <b-container>
            <b-row>
                <b-col class="label">Task#</b-col>
                <b-col class="data" cols="2">{{ task.id }}</b-col>
                <b-col class="label">Hours</b-col>
                <b-col class="data" cols="3">{{ task.task_hours }}</b-col>
                <b-col class="label">Crew Time</b-col>
                <b-col class="data" cols="3">{{ task.crew_hours }}</b-col>
                <b-col cols="3"><b-button @click="signIn" v-if="task_date_id && !sign_in_id">Clock In</b-button></b-col>
                <b-col cols="2"><b-button @click="signOut" v-if="sign_in_id">Clock Out</b-button></b-col>
            </b-row>
            <b-row>
                <b-col class="label">Task Description</b-col>
                <b-col class="data" cols="9">{{ task.description }}</b-col>
            </b-row>
            <b-row>
                <b-col class="header">Employee</b-col>
                <b-col class="header">Sign In</b-col>
                <b-col class="header">Sign Out</b-col>
                <b-col class="header">Hours</b-col>
                <b-col class="header">Labor Category</b-col>
            </b-row>
            <div v-for="sign_in in sign_ins" :key="sign_in.id">
                <b-row>
                    <b-col>{{ sign_in.contact.name }}</b-col>
                    <b-col>{{ formatTime(sign_in.sign_in) }}</b-col>
                    <b-col>{{ formatTime(sign_in.sign_out) }}</b-col>
                    <b-col>{{ timeDiff(sign_in.sign_in, sign_in.sign_out) }}</b-col>
                    <b-col></b-col>
                </b-row>
                <b-row>
                    <b-col class="label">Notes For The Day</b-col>
                    <b-col class="data"><b-form-input v-model="sign_in.notes" @input="saveNotes(sign_in)"></b-form-input></b-col>
                </b-row>
            </div>
            <b-row>
                <b-col class="label">
                    <b-form-checkbox v-model="completed" @input="markCompleted">
                        Completed
                    </b-form-checkbox>
                </b-col>
                <b-col class="label">
                    <b-form-checkbox v-model="invoiced" @input="markInvoiced">
                        Invoiced
                    </b-form-checkbox>
                </b-col>
                <b-col class="label">
                    <b-form-checkbox v-model="billed" @input="markBilled">
                        Billed
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
        task_id : { required:true },
        task_date_id : { default: null }
    },
    data() {
        return {
            task: { },
            billed: false,
            completed: false,
            invoiced: false,
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
            if(!this.task_date_id){
                return;
            }
            this.$http.get('/sign_ins?task_date_id=' + this.task_date_id).then((results) => {
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
        markInvoiced(){
            let task = {
                invoiced_date: this.invoiced ? moment().format('YYYY-MM-DD') : null
            }
            this.$http.patch('/task/' + this.task_id, task);
        },
        markBilled(){
            let task = {
                billed_date: this.billed ? moment().format('YYYY-MM-DD') : null
            }
            this.$http.patch('/task/' + this.task_id, task);
            if(this.billed&&!this.invoiced){
                this.invoiced=true;
                this.markInvoiced();
            }
            if(this.billed&&!this.completed){
                this.completed=true;
                this.markCompleted();
            }
        },
        editSignIn(sign_in,field){
            var new_value = null;
            var old_value = !sign_in[field] ? '' : sign_in[field];
            new_value = prompt('Change ' + field, old_value);
            if(new_value != null){
                sign_in[field] = new_value;
                this.$http.patch('/sign_in/' + sign_in.id, sign_in);
            }
        },
        signIn(){
            var sign_in;
            sign_in = prompt('Sign In Time', moment().format("YYYY-MM-DD h:mm:ss a"));
            if(sign_in !== null){
                this.$http.post('/sign_in', {task_date_id : this.task_date_id, sign_in: sign_in}).then(() => {
                    this.getSignIns();
                });
            }
        },
        signOut(){
            var sign_out;
            sign_out = prompt('Sign Out Time', moment().format("YYYY-MM-DD h:mm:ss a"));
            if(sign_out !== null){
                this.$http.patch('/sign_in/' + this.sign_in_id, {sign_out : sign_out}).then(() => {
                    this.getSignIns();
                });
            }
        },
        saveNotes(sign_in){
            this.$http.patch('/sign_in/' + sign_in.id, {notes : sign_in.notes})
        },
    },
    computed: {
        sign_in_id() {
            var id = null
            var my_id = localStorage.getItem('id')
            var ids = this.sign_ins.filter( si => (si.contact_id == my_id && si.sign_out == null))
            if(ids.length > 0){
                id = ids[0].id
            }
            return id;
        }
    },
}
</script>
<style scoped>
.label {
    text-align: left;
    font-weight: bold;
}

.header {
    font-weight: bold;
}

.data {
    text-align: left;
}
</style>