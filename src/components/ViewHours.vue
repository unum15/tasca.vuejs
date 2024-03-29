<template>
    <div>
        <b-container class="text-center">
            <b-row>
                <b-col class="header">Employee</b-col>
                <b-col class="header">Hours</b-col>
                <b-col class="header">Rate</b-col>
                <b-col class="header">Total</b-col>
                <b-col>
                     <b-button v-b-modal="'clock_ins-' + this.type + '-' + this.id">On-Site Hours</b-button>
                </b-col>
                <b-col>
                     <b-button v-b-modal="'dates-' + this.type + '-' + this.id">Scheduled Dates</b-button>
                </b-col>
            </b-row>
            <b-row v-for="employee in employees_hours" :key="employee.id" :id="'employee-' + employee.id">
                <b-col>{{ employee.name }}</b-col>
                <b-col>{{ employee.hours }}</b-col>
                <b-col><b-form-input type="text" v-model="employee.rate"></b-form-input></b-col>
                <b-col>{{ (employee.hours * employee.rate).toFixed(2) }}</b-col>
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
            <div v-if="type=='task'">
                <b-row v-for="appointment in filtered_appointments" :key="appointment.id">
                    <b-col class="data" :class="{highlight: appointment.id == appointment_id}">{{ formatTime(appointment.date,appointment.time) }}</b-col>
                </b-row>
            </div>
        </b-container>
        <b-modal :id="'clock_ins-' + this.type + '-' + this.id" title="Clock Ins" size="lg" ok-only>
            <b-container>
                <div v-for="employee in employees_hours" :key="employee.id" :id="'employee-clock_ins-' + employee.id">
                    <b-row>
                        <b-col class="header">{{ employee.name }}</b-col>
                        <b-col class="header">{{ employee.hours }}</b-col>
                    </b-row>
                    <ViewClockInsPopup :type="type" :id="id" :contact_id="employee.id"></ViewClockInsPopup>
                </div>
                <b-row>
                    <b-col class="header">Total</b-col>
                    <b-col></b-col>
                    <b-col></b-col>
                    <b-col>{{ total_hours }}</b-col>
                    <b-col></b-col>
                </b-row>
            </b-container>
        </b-modal>
        <b-modal :id="'dates-' + this.type + '-' + this.id" title="Dates" ok-only>
            <b-container>
                <b-row>
                    <b-col class="header">Task Dates</b-col>
                </b-row>
                <div v-for="appointment in appointments" :key="appointment.id">
                    <b-row>
                        <b-col class="label">Schedule Date & Time</b-col>
                        <b-col class="data">{{ formatTime(appointment.date,appointment.time) }}</b-col>
                    </b-row>
                    <b-row>
                        <b-col class="label">Day Notes</b-col>
                        <b-col class="data">{{ appointment.notes }}</b-col>
                    </b-row>
                </div>
            </b-container>
        </b-modal>
    </div>
</template>
<script>
import moment from 'moment'
import ViewClockInsPopup from './ViewClockInsPopup'
export default {
    name: 'ViewHours',
    components: {
        'ViewClockInsPopup': ViewClockInsPopup,
    },
    props: {
        id : { required: true },
        appointment_id : { default: null },
        type : { required: true }
    },
    data() {
        return {
            clock_ins: [],
            appointments: [],
            employees_hours: []
        };
    },
    created() {
        this.getEmployeesHours();
        this.getTaskDates();
        this.getClockIns();
    },
    methods: {
        getEmployeesHours() {
            this.$http.get('/clock_ins/by_employee?' + this.type + '_id=' + this.id).then((results) => {
                this.employees_hours = results.data;
            });
        },
        getClockIns() {
            this.$http.get('/clock_ins?' + this.type + '_id=' + this.id).then((results) => {
                this.clock_ins = results.data;
                this.clock_ins.sort((a, b) => {
                    if(a.contact.name != b.contact.name){
                        return a.contact.name > b.contact.name;
                    }
                    return a.clock_in > b.clock_in;
                });
            });
        },
        getTaskDates() {
            this.$http.get('/appointments?' + this.type + '_id=' + this.id).then((results) => {
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
        formatTime(date,time){
            if((!date)&&(!time)){
                return "";
            }
            if((date)&&(!time)){
                return moment(date).format('dddd MM-DD')
            }
            if((!date)&&(time)){
                return moment('2020-01-01 ' + time).format('hh:mm A')
            }
            return moment(date+' '+time).format('dddd MM-DD hh:mm A')
        },
        editClockIn(clock_in,field){
            var new_value = null;
            var old_value = !clock_in[field] ? '' : clock_in[field];
            new_value = prompt('Change ' + field, old_value);
            if(new_value != null){
                clock_in[field] = new_value;
                this.$http.patch('/clock_in/' + clock_in.id, clock_in);
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
        },
        today(){
            return moment().format('YYYY-MM-DD')
        },
        filtered_appointments(){
            return this.appointments.filter(appointment => (appointment.date>=this.today));
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
.highlight {
    background-color: yellow;
}
</style>