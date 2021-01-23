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
                <b-col cols="3"><b-button @click="showClockIn" v-if="appointment_id && !clock_in_id">Clock In</b-button></b-col>
                <b-col cols="2"><b-button @click="showClockOut" v-if="clock_in_id">Clock Out</b-button></b-col>
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
        <b-modal ref="modal-clock-in" @ok="clockIn" title="Clock In">
            <b-container fluid>
                <b-row>
                    <b-col>
                        <b-form-group label="Date" class="mb-0">
                            <b-form-input type="date" v-model="new_clock_in.date" />
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Time" class="mb-0">
                            <b-form-input type="time" v-model="new_clock_in.time" />
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Activity">
                            <Treeselect :options="filtered_labor_activities" :normalizer="treeNormalizer" v-model="new_clock_in.labor_activity_id"/>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
        <b-modal ref="modal-clock-out" @ok="clockOut" title="Clock Out">
            <b-container fluid>
                <b-row>
                    <b-col>
                        <b-form-group label="Date" class="mb-0">
                            <b-form-input type="date" v-model="new_clock_out.date" />
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Time" class="mb-0">
                            <b-form-input type="time" v-model="new_clock_out.time" />
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Activity">
                            <Treeselect :options="filtered_labor_activities" :normalizer="treeNormalizer" v-model="new_clock_out.labor_activity_id"/>
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
            task: { },
            billed: false,
            completed: false,
            invoiced: false,
            clock_ins: [],
            appointments: [],
            employees_hours: [],
            new_clock_in: {date: null, time: null, labor_activity_id: null},
            new_clock_out: {date: null, time: null, labor_activity_id: null}
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
        showClockIn(){
            this.new_clock_in.date = moment().format('YYYY-MM-DD');
            this.new_clock_in.time = moment().format('HH:mm');
            //this.new_clock_in.labor_activity_id = this.default_activity_id;
            this.$refs['modal-clock-in'].show();
        },
        clockIn(){
            var clock_in = {
                appointment_id : this.appointment_id,
                clock_in: this.new_clock_in.date+' '+this.new_clock_in.time,
                labor_activity_id: this.new_clock_in.labor_activity_id,
                contact_id: this.user_id
            }
            this.$http.post('/clock_in', clock_in).then(() => {
                this.getClockIns();
            });
        },
        showClockOut(){
            this.new_clock_out.date = moment().format('YYYY-MM-DD');
            this.new_clock_out.time = moment().format('HH:mm');
            this.$refs['modal-clock-out'].show();
        },
        clockOut(){
            var clock_in = {
                clock_out: this.new_clock_out.date+' '+this.new_clock_out.time,
                labor_activity_id: this.new_clock_out.labor_activity_id,
            }
            this.$http.patch('/clock_in/' + this.clock_in_id, clock_in).then(() => {
                this.getClockIns();
            });
        },
        saveNotes(clock_in){
            this.$http.patch('/clock_in/' + clock_in.id, {notes : clock_in.notes})
        },
        treeNormalizer(node){
            return {
                id: node.id,
                label: node.name,
                children: node.children && node.children.length ? node.children : undefined,
            }
        },
        findSelectedActivities(id,activities){
            let filtered_activities = [];
            activities.map(c => {
                if(c.labor_assignments.filter(a => (a.id == id)).length){
                    let cat = JSON.parse(JSON.stringify(c));
                    if(c.children && c.children.length){
                        let children = this.findSelectedActivities(id,c.children);
                        cat.children = children;
                    }
                    filtered_activities.push(cat);
                }
                else{
                    if(c.children){
                        let children = this.findSelectedActivities(id,c.children);
                        filtered_activities = filtered_activities.concat(children);
                    }
                }
            });
            return filtered_activities;
        },
    },
    computed: {
        clock_in_id() {
            var id = null
            var my_id = this.user_id
            var ids = this.clock_ins.filter( si => (si.contact_id == my_id && si.clock_out == null))
            if(ids.length > 0){
                id = ids[0].id
            }
            return id;
        },
        ...mapState({
            user_id: state => state.user.id,
            default_activity_id: state => state.settings.default_labor_activity_id
        }),
        filtered_labor_activities(){
            if(this.task.labor_assignment_id){
                return this.findSelectedActivities(this.task.labor_assignment_id,this.labor_activities);
            }
            return [];
        },
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