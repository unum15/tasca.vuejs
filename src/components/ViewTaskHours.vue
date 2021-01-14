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
                <b-col cols="3"><b-button @click="clockIn" v-if="appointment_id && !clock_in_id">Clock In</b-button></b-col>
                <b-col cols="2"><b-button @click="clockOut" v-if="clock_in_id">Clock Out</b-button></b-col>
            </b-row>
            <b-row>
                <b-col class="label">Task Description</b-col>
                <b-col class="data" cols="9">{{ task.description }}</b-col>
            </b-row>
            <b-row>
                <b-col class="header">Employee</b-col>
                <b-col class="header">Clock In</b-col>
                <b-col class="header">Clock Out</b-col>
                <b-col class="header">Hours</b-col>
                <b-col class="header">Labor Category</b-col>
            </b-row>
            <div v-for="clock_in in clock_ins" :key="clock_in.id">
                <b-row>
                    <b-col>{{ clock_in.contact.name }}</b-col>
                    <b-col>{{ formatTime(clock_in.clock_in) }}</b-col>
                    <b-col>{{ formatTime(clock_in.clock_out) }}</b-col>
                    <b-col>{{ timeDiff(clock_in.clock_in, clock_in.clock_out) }}</b-col>
                    <b-col></b-col>
                </b-row>
                <b-row>
                    <b-col class="label">Notes For The Day</b-col>
                    <b-col class="data"><b-form-input v-model="clock_in.notes" @input="saveNotes(clock_in)"></b-form-input></b-col>
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
        <ViewHours :id="task_id" type="task" :appointment_id="appointment_id">
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
        appointment_id : { default: null }
    },
    data() {
        return {
            task: { },
            billed: false,
            completed: false,
            invoiced: false,
            clock_ins: [],
            appointments: [],
            employees_hours: []
        };
    },
    created() {
        this.getTask();
        this.getEmployeesHours();
        this.getTaskDates();
        this.getClockIns();

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
            this.$http.get('/clock_ins/by_employee?task_id=' + this.task_id).then((results) => {
                this.employees_hours = results.data;
            });
        },
        getClockIns() {
            if(!this.appointment_id){
                return;
            }
            this.$http.get('/clock_ins?appointment_id=' + this.appointment_id).then((results) => {
                this.clock_ins = results.data;
            });
        },
        getTaskDates() {
            this.$http.get('/appointments?task_id=' + this.task_id).then((results) => {
                this.appointments = results.data;
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
        editClockIn(clock_in,field){
            var new_value = null;
            var old_value = !clock_in[field] ? '' : clock_in[field];
            new_value = prompt('Change ' + field, old_value);
            if(new_value != null){
                clock_in[field] = new_value;
                this.$http.patch('/clock_in/' + clock_in.id, clock_in);
            }
        },
        clockIn(){
            var clock_in;
            clock_in = prompt('Clock In Time', moment().format("YYYY-MM-DD h:mm:ss a"));
            if(clock_in !== null){
                this.$http.post('/clock_in', {appointment_id : this.appointment_id, clock_in: clock_in, contact_id: this.$store.state.user.id}).then(() => {
                    this.getClockIns();
                });
            }
        },
        clockOut(){
            var clock_out;
            clock_out = prompt('Clock Out Time', moment().format("YYYY-MM-DD h:mm:ss a"));
            if(clock_out !== null){
                this.$http.patch('/clock_in/' + this.clock_in_id, {clock_out : clock_out}).then(() => {
                    this.getClockIns();
                });
            }
        },
        saveNotes(clock_in){
            this.$http.patch('/clock_in/' + clock_in.id, {notes : clock_in.notes})
        },
    },
    computed: {
        clock_in_id() {
            var id = null
            var my_id = this.$store.state.user.id
            var ids = this.clock_ins.filter( si => (si.contact_id == my_id && si.clock_out == null))
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