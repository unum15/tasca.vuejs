<template>
    <div>
        <b-container class="text-center">
            <b-row>
                <b-col class="header">Employee</b-col>
                <b-col class="header">Hours</b-col>
                <b-col class="header">Rate</b-col>
                <b-col class="header">Total</b-col>
                <b-col>
                     <b-button v-b-modal="'sign_ins-' + this.type + '-' + this.id">On-Site Hours</b-button>
                </b-col>
                <b-col>
                     <b-button v-b-modal="'dates-' + this.type + '-' + this.id">Scheduled Dates</b-button>
                </b-col>
            </b-row>
            <b-row v-for="employee in employees_hours" :key="employee.id" :id="'employee-' + employee.id">
                <b-col>{{ employee.name }}</b-col>
                <b-col>{{ employee.hours }}</b-col>
                <b-col><b-form-input type="text" v-model="employee.rate"></b-form-input></b-col>
                <b-col>{{ employee.hours * employee.rate }}</b-col>
                <b-col></b-col>
                <b-col></b-col>
            </b-row>
            <b-row>
                <b-col class="header">Total</b-col>
                <b-col>{{ total_hours }}</b-col>
                <b-col></b-col>
                <b-col></b-col>
                <b-col></b-col>
                <b-col></b-col>
            </b-row>
        </b-container>
        <b-modal :id="'sign_ins-' + this.type + '-' + this.id" title="Sign Ins" size="lg" ok-only>
            <b-container>
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
                        <b-col @click="editSignIn(sign_in, 'sign_in')" style="cursor:pointer;">{{ formatTime(sign_in.sign_in) }}</b-col>
                        <b-col @click="editSignIn(sign_in, 'sign_out')" style="cursor:pointer;">{{ sign_in.sign_out ? formatTime(sign_in.sign_out) : 'Click to add.' }}</b-col>
                        <b-col>{{ timeDiff(sign_in.sign_in, sign_in.sign_out) }}</b-col>
                        <b-col></b-col>
                    </b-row>
                    <b-row>
                        <b-col class="label">Notes For The Day</b-col>
                        <b-col  @click="editSignIn(sign_in, 'notes')" style="cursor:pointer;" class="data" cols="9">{{ sign_in.notes ? sign_in.notes : 'Click to add.' }}</b-col>
                    </b-row>
                </div>
            </b-container>
        </b-modal>
        <b-modal :id="'dates-' + this.type + '-' + this.id" title="Dates" ok-only>
            <b-container>
                <b-row>
                    <b-col class="header">Task Dates</b-col>
                </b-row>
                <div v-for="task_date in task_dates" :key="task_date.id">
                    <b-row>
                        <b-col class="label">Schedule Date & Time</b-col>
                        <b-col class="data">{{ task_date.date }} {{ task_date.time }}</b-col>
                    </b-row>
                    <b-row>
                        <b-col class="label">Day Notes</b-col>
                        <b-col class="data">{{ task_date.notes }}</b-col>
                    </b-row>
                </div>
            </b-container>
        </b-modal>
    </div>
</template>
<script>
import moment from 'moment'
export default {
    name: 'ViewHours',
    props: {
        id : { required:true },
        type : { required:true }
    },
    data() {
        return {
            sign_ins: [],
            task_dates: [],
            employees_hours: []
        };
    },
    created() {
        this.getEmployeesHours();
        this.getTaskDates();
        this.getSignIns();
    },
    methods: {
        getEmployeesHours() {
            this.$http.get('/sign_ins/by_employee?' + this.type + '_id=' + this.id).then((results) => {
                this.employees_hours = results.data;
            });
        },
        getSignIns() {
            this.$http.get('/sign_ins?' + this.type + '_id=' + this.id).then((results) => {
                this.sign_ins = results.data;
                this.sign_ins.sort((a, b) => {
                    if(a.contact.name != b.contact.name){
                        return a.contact.name > b.contact.name;
                    }
                    return a.sign_in > b.sign_in;
                });
            });
        },
        getTaskDates() {
            this.$http.get('/task_dates?' + this.type + '_id=' + this.id).then((results) => {
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
    computed:{
        total_hours(){
            var time = 0;
            for(var x = 0; x< this.employees_hours.length; x++){
                time+=parseFloat(this.employees_hours[x].hours);
            }
            return time.toFixed(2);
        }
    }
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