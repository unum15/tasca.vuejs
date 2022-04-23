<template>
    <div>
        <b-container>
            <b-row>
                <b-col class="label">Task Description</b-col>
                <b-col class="data" cols="9">{{ task.description }}</b-col>
            </b-row>
            <b-row>
                <b-col cols="3" v-for="appointment in filtered_appointments" :key="appointment.id" :class="{highlight: appointment.date == today, blue: appointment.date != today}">
                    {{ formatAppointmentTime(appointment) }}
                </b-col>
            </b-row>
            <b-row>
                <b-col class="label">Task#</b-col>
                <b-col class="data">{{ task.id }}</b-col>
                <b-col class="label">Hours</b-col>
                <b-col class="data">{{ task.task_hours }}</b-col>
                <b-col class="label">Crew Time</b-col>
                <b-col class="data">{{ task.crew_hours }}</b-col>
                <b-col class="label">Assignment</b-col>
                <b-col class="data">{{ task.labor_assignment.name }}</b-col>
                <b-col class="label">Labor Type</b-col>
                <b-col class="data">{{ task.labor_type.name }}</b-col>
            </b-row>
            <b-row>
                <b-col cols="3"><b-button @click="showChange" v-if="appointment_id && clock_in.id">Change</b-button></b-col>
                <b-col cols="3"><b-button @click="showClockIn" v-if="appointment_id && !clock_in.id">Clock In</b-button></b-col>
                <b-col cols="2"><b-button @click="showClockOut" v-if="clock_in.id">Clock Out</b-button></b-col>
            </b-row>
            <b-row>
                <b-col class="header">Employee</b-col>
                <b-col class="header">Clock In</b-col>
                <b-col class="header">Clock Out</b-col>
                <b-col class="header">Hours</b-col>
                <b-col class="header">Labor Activity</b-col>
            </b-row>
            <div v-for="clock_in in clock_ins" :key="clock_in.id">
                <b-row>
                    <b-col>{{ clock_in.contact.name }}</b-col>
                    <b-col>{{ formatTime(clock_in.clock_in) }}</b-col>
                    <b-col>{{ formatTime(clock_in.clock_out) }}</b-col>
                    <b-col>{{ timeDiff(clock_in.clock_in, clock_in.clock_out) }}</b-col>
                    <b-col>{{ clock_in.labor_activity ? clock_in.labor_activity.name : '' }} </b-col>
                </b-row>
                <b-row>
                    <b-col class="label" cols="2">Notes For The Day</b-col>
                    <b-col class="data" cols="10"><b-form-input v-model="clock_in.notes" @input="saveNotes(clock_in)" style="height:75%;"></b-form-input></b-col>
                </b-row>
            </div>
            <b-row style="padding-top:20px;padding-bottom:20px;">
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
        <b-modal ref="modal-clock-in" @ok="clockIn" :title="modal_clock_in.title">
            <b-container fluid>
                <b-row v-if="clock_in.id">
                    <b-col style="text-align:center;font-weight:bold;">
                        Clock Out
                    </b-col>
                </b-row>
                <b-row v-if="clock_in.id">
                    <b-col>
                        <b-form-group label="Date" class="mb-0">
                            <b-form-input type="date" v-model="modal_clock_in.current.date" />
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Time" class="mb-0">
                            <b-form-input type="time" v-model="modal_clock_in.current.time" />
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Activity">
                            <Treeselect :options="filtered_labor_activities" :normalizer="treeNormalizer" v-model="modal_clock_in.current.labor_activity_id"/>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row v-if="clock_in.id">
                    <b-col>
                        <b-form-group label="Notes" class="mb-0">
                            <b-form-input type="text" v-model="modal_clock_in.current.notes" />
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row v-if="modal_clock_in.clock_in">
                    <b-col style="text-align:center;font-weight:bold;">
                        Clock In
                    </b-col>
                </b-row>
                <b-row v-if="modal_clock_in.clock_in">
                    <b-col>
                        <b-form-group label="Date" class="mb-0">
                            <b-form-input type="date" v-model="modal_clock_in.new.date" />
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Time" class="mb-0">
                            <b-form-input type="time" v-model="modal_clock_in.new.time" />
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Activity">
                            <Treeselect :options="filtered_labor_activities" :normalizer="treeNormalizer" v-model="modal_clock_in.new.labor_activity_id"/>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
    </div>
</template>
<script>
import moment from 'moment';
import ViewHours from './ViewHours';
import { mapState } from 'vuex';
import Treeselect from '@riophae/vue-treeselect';
import treeFilter from '../common/TreeFilter.js';
import treeNormalizer from '../common/TreeNormalizer.js';
export default {
    name: 'ViewTaskHours',
    components: {
        'ViewHours': ViewHours,
        'Treeselect': Treeselect
    },
    props: {
        task_id : { required:true },
        appointment_id : { default: null },
        labor_activities: { default: (() => ([]))}
    },
    data() {
        return {
            task: { labor_assignment: {}, labor_type: {}},
            billed: false,
            completed: false,
            invoiced: false,
            clock_ins: [],
            appointments: [],
            employees_hours: [],
            modal_clock_in: {
                clock_in : true,
                title: 'Clock In',
                new: {
                    date: null,
                    time: null,
                    labor_assignment_id: null,
                    labor_activity_id: null,
                    
                },
                current: {
                    date: null,
                    time: null,
                    labor_assignment_id: null,
                    labor_activity_id: null,
                    notes: null
                },
            },
        };
    },
    created() {
        this.getTask();
        this.getEmployeesHours();
        this.getAppointments();
        this.getClockIns();
    },
    methods: {
        treeFilter,
        treeNormalizer,
        getTask() {
            this.$http.get('/task/' + this.task_id).then((results) => {
                this.task = results.data;
                this.completed = this.task.completion_date != null;
                this.billed = this.task.billed_date != null;
                this.invoiced = this.task.invoiced_date != null;
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
        getAppointments() {
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
        formatAppointmentTime(appointment){
            let time = appointment.date ? appointment.time ? appointment.date+' '+appointment.time : appointment.date : null;
            if(time == null){
                return "";
            }
            return moment(time).format('ddd MM-DD hh:mm a')
        },
        formatTime(time){
            if(time == null){
                return "";
            }
            return moment(time).format('MM-DD hh:mm a')
        },
        markCompleted(){
            if(this.completed && this.task.completion_date){
                return;
            }
            let task = {
                completion_date: this.completed ? moment().format('YYYY-MM-DD') : null
            }
            this.$http.patch('/task/' + this.task_id, task);
        },
        markInvoiced(){
            if(this.invoiced && this.task.invoiced_date){
                return;
            }
            let task = {
                invoiced_date: this.invoiced ? moment().format('YYYY-MM-DD') : null
            }
            this.$http.patch('/task/' + this.task_id, task);
        },
        markBilled(){
            if(this.billed && this.task.billed_date){
                return;
            }
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
        showClockIn(){
            this.modal_clock_in.current.date = null;
            this.modal_clock_in.current.time = null;
            this.modal_clock_in.new.date = moment().format('YYYY-MM-DD');
            this.modal_clock_in.new.time = moment().format('HH:mm');
            //this.modal_clock_in.new.labor_activity_id = this.default_activity_id;
            this.modal_clock_in.title = 'Clock In';
            this.modal_clock_in.clock_in = true;
            this.$refs['modal-clock-in'].show();
        },
        showClockOut(){
            this.modal_clock_in.current.date = moment().format('YYYY-MM-DD');
            this.modal_clock_in.current.time = moment().format('HH:mm');
            this.modal_clock_in.current.labor_activity_id = this.clock_in.labor_activity_id;
            this.modal_clock_in.current.notes = this.clock_in.notes;
            this.modal_clock_in.title = 'Clock Out';
            this.modal_clock_in.clock_in = false;
            this.$refs['modal-clock-in'].show();
        },
        showChange(){
            this.modal_clock_in.current.date = moment().format('YYYY-MM-DD');
            this.modal_clock_in.current.time = moment().format('HH:mm');
            this.modal_clock_in.current.labor_activity_id = this.clock_in.labor_activity_id;
            this.modal_clock_in.current.notes = null;
            this.modal_clock_in.new.date = moment().format('YYYY-MM-DD');
            this.modal_clock_in.new.time = moment().format('HH:mm');
            this.modal_clock_in.title = 'Change Clock In';
            this.modal_clock_in.clock_in = true;
            this.$refs['modal-clock-in'].show();
        },

        clockIn(e){
            if((this.modal_clock_in.current.time)&&(!this.modal_clock_in.current.labor_activity_id)){
                e.preventDefault();
                alert('Must select activity.');
                return;
            }
            if(this.modal_clock_in.clock_in){
                var clock_in = {
                    appointment_id : this.appointment_id,
                    clock_in: this.modal_clock_in.new.date+' '+this.modal_clock_in.new.time,
                    labor_activity_id: this.modal_clock_in.new.labor_activity_id,
                    contact_id: this.user_id
                }
                this.$http.post('/clock_in', clock_in).then(() => {
                    this.getClockIns();
                });
            }
            if(this.modal_clock_in.current.time){
                var clock_out = {
                    clock_out: this.modal_clock_in.current.date+' '+this.modal_clock_in.current.time,
                    labor_activity_id: this.modal_clock_in.current.labor_activity_id,
                    notes: this.modal_clock_in.current.notes
                }
                this.$http.patch('/clock_in/' + this.clock_in.id, clock_out).then(() => {
                    this.getClockIns();
                });
            }
        },
        saveNotes(clock_in){
            this.$http.patch('/clock_in/' + clock_in.id, {notes : clock_in.notes})
        },
    },
    computed: {
        clock_in() {
            let clock_ins = this.clock_ins.filter( si => (si.contact_id == this.user_id && si.clock_out == null))
            if(!clock_ins.length){
                return {id: null};
            }
            return clock_ins[0];
        },
        ...mapState({
            user_id: state => state.user.id,
            default_activity_id: state => state.settings.default_labor_activity_id
        }),
        filtered_labor_activities(){
            if(this.task.labor_assignment_id){
                return this.treeFilter(this.task.labor_assignment_id,this.labor_activities);
            }
            return [];
        },
        filtered_appointments(){
            return this.appointments;//.filter(appointment => (appointment.date>=this.today));
        },
        today(){
            return moment().format('YYYY-MM-DD');
        }
    },
}
</script>
<style scoped>
.label {
    text-align: left;
    font-weight: bold;
    white-space: nowrap;
}

.header {
    font-weight: bold;
}

.data {
    text-align: left;
}

.highlight {
    background-color: yellow;
}

.blue {
    background-color: #AAEEFF;
}
</style>