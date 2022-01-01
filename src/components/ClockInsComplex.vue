<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Time Cards
        </head>
        <main>
            <b-container fluid="xl" style="max-width:1600px">
                <b-row>
                    <b-col>
                    <b-form-group label="Group By">
                        <b-form-select
                          v-model="group_by"
                          >
                           <b-form-select-option value="date">Date</b-form-select-option>
                           <b-form-select-option value="employee">Employee</b-form-select-option>
                           <b-form-select-option value="client">Client</b-form-select-option>
                           <b-form-select-option value="project">Project</b-form-select-option>
                           <b-form-select-option value="assignment">Assignment</b-form-select-option>
                        </b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Employee">
                        <b-form-select
                          :options="contacts"
                          value-field="id"
                          text-field="name"
                          v-model="contact_id"
                          @change="getClockIns"
                          >
                        </b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Start Date">
                        <b-form-input
                          type="date"
                          v-model="start_date"
                          >
                        </b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Stop Date">
                        <b-form-input
                          type="date"
                          v-model="stop_date"
                          >
                        </b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col>
                        <b-button @click="getClockIns">Submit Dates</b-button>
                  </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Client">
                            <b-form-input type="text" v-model="filters.client"></b-form-input>
                        </b-form-group>                            
                    </b-col>
                    <b-col>
                        <b-form-group label="Project">
                            <b-form-input type="text" v-model="filters.project"></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Order">
                            <b-form-input type="text" v-model="filters.order"></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Task">
                            <b-form-input type="text" v-model="filters.task"></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-button @click="reverseSort">{{sort_ascending ? 'Ascending' : 'Descending'}}</b-button>
                    </b-col>  
                </b-row>
                    <b-row>
                        <b-col>
                            Employee
                        </b-col>
                        <b-col>
                            Total Time
                        </b-col>
                        <b-col>
                            {{ total_time(groups) }}
                        </b-col>
                        <b-col>
                            Total {{ group_by }}s
                        </b-col>
                        <b-col>
                            {{ Object.keys(groups).length }}
                        </b-col>
                        <b-col>
                            Overhead Time
                        </b-col>
                        <b-col>
                            {{ overhead_time(groups) }}
                        </b-col>
                        <b-col>
                            Task Time
                        </b-col>
                        <b-col>
                            {{ task_time(groups) }}
                        </b-col>
                    </b-row>
            </b-container>
            <b-container v-for="(key) in sort_ascending ? Object.keys(groups).sort() : Object.keys(groups).sort().reverse()" :key="key"  style="max-width:1600px">
                <b-row>
                    <b-col style="font-weight:bold;font-size:150%;">
                        {{ key }}
                    </b-col>
                </b-row>
                <b-row>
                    <b-table
                        small
                        striped
                        outlined
                        hover
                        :items="groups[key]"
                        :fields="fields"
                        style="text-align:right"
                    >
                        <template v-slot:cell(id)="data">
                            <a :href="'/clock_in/' + data.value"> {{ data.value }} </a>
                        </template>
                    </b-table>
                </b-row>
                <b-row>
                    <b-col>
                        Overhead
                    </b-col>
                    <b-col>
                        {{ overhead_date(groups[key]) }}
                    </b-col>
                    <b-col>
                        Task
                    </b-col>
                    <b-col>
                        {{ appointment(groups[key]) }}
                    </b-col>
                    <b-col style="font-weight:bold;">
                        Total
                    </b-col>
                    <b-col>
                        {{ total_date(groups[key]) }}
                    </b-col>
                </b-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import moment from 'moment';
import TopMenu from './TopMenu';
import { mapState } from 'vuex';
export default {
    name: 'ViewClockIns',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            clock_ins: [],
            contact_id: null,
            contacts: [],
            start_date: null,
            stop_date: null,
            group_by: 'date',
            filters: {
                client: null,
                project: null,
                order: null,
                task: null
            },
            sort_ascending: true,
            fields: [
                    {
                        key: 'contact.name',
                        label: 'Employee',
                        sortable: true
                    },
                    {
                        key: 'appointment.task.order.project.client.name',
                        label: 'Client',
                        sortable: true
                    },
                    {
                        key: 'appointment.task.order.project.name',
                        label: 'Project',
                        sortable: true
                    },
                    {
                        key: 'appointment.task.order.name',
                        label: 'Order',
                        sortable: true
                    },
                    {
                        key: 'appointment.task.name',
                        label: 'Task',
                        sortable: true
                    },
                    {
                        key: 'appointment.task.labor_assignment.name',
                        label: 'Assignment',
                        sortable: true
                    },
                    {
                        key: 'labor_activity.name',
                        label: 'Activity',
                        sortable: true
                    },
                    {
                        key: 'clock_in',
                        label: 'Clock In',
                        sortable: true,
                        formatter: 'formatTime',
                        sortByFormatted : true
                    },
                    {
                        key: 'clock_out',
                        label: 'Clock Out',
                        sortable: true,
                        formatter: 'formatTime',
                        sortByFormatted : true
                    },
                    {
                        key: 'time',
                        label: 'Time',
                        sortable: true,
                        formatter: 'timeColumn',
                        sortByFormatted : true
                    },
                    
            ],
            settings: {}
        }
    },
    created() {
        let last_sunday = moment().startOf('week');
        this.start_date = last_sunday.format('YYYY-MM-DD');
        this.stop_date = last_sunday.add(6, 'day').format('YYYY-MM-DD');
        this.getContacts();
        this.getClockIns();
    },
    methods: {
        getClockIns(){
            let contact = '';
            if(this.contact_id){
                contact = 'contact_id=' + this.contact_id + '&';
            }
           this.$http.get('/clock_ins?' + contact + 'start_date=' + this.start_date + '&stop_date=' + this.stop_date ).then(response => {
                    this.clock_ins = response.data;
            });
        },
        getContacts(){
            if(this.operator_id){
                this.$http.get('/contacts?client_id=' + this.operator_id).then(response => {
                    this.contacts = response.data;
                    this.contacts.unshift({id: null, name: "All"});
                });
            }
        },
        getDiff(clock_in,clock_out){
            var start = moment(clock_in);
            var stop = moment();
            if(clock_out){
                stop = moment(clock_out);
            }
            var diff = Math.round(stop.diff(start)/36000)/100;
            return diff;
        },
        total_date(clock_ins){
            let time = 0;
            clock_ins.map( c =>{
                time += this.getDiff(c.clock_in, c.clock_out);
            });
            return Math.round(time*100)/100;
        },
        overhead_date(clock_ins){
            let time = 0;
            clock_ins.map( c =>{
                if(c.overhead_assignment_id){
                    time += this.getDiff(c.clock_in, c.clock_out);
                }
            });
            return Math.round(time*100)/100;
        },
        appointment(clock_ins){
            let time = 0;
            clock_ins.map( c =>{
                if(c.appointment_id){
                    time += this.getDiff(c.clock_in, c.clock_out);
                }
            });
            return Math.round(time*100)/100;
        },
        formatTime(time){
            return moment(time).format('MM/DD hh:mm A');
        },
        total_time(dates){
            let time = 0;
            Object.keys(dates).map(d => {
                dates[d].map( c =>{
                    time += this.getDiff(c.clock_in, c.clock_out);
                });
            });
            return Math.round(time*100)/100;
        },
        overhead_time(dates){
            let time = 0;
            Object.keys(dates).map( d => {
                dates[d].map( c =>{
                    if(c.overhead_assignment_id){
                        time += this.getDiff(c.clock_in, c.clock_out);
                    }
                });
            });
            return Math.round(time*100)/100;
        },
        task_time(dates){
            let time = 0;
            Object.keys(dates).map( d => {
                dates[d].map( c =>{
                    if(c.appointment_id){
                        time += this.getDiff(c.clock_in, c.clock_out);
                    }
                });
            });
            return Math.round(time*100)/100;
        },
        timeColumn(value, key, item){
            return this.getDiff(item.clock_in,item.clock_out);
        },
        reverseSort(){
            this.sort_ascending = ! this.sort_ascending;
        }
    },
    computed:{
        groups(){
            let groups = {};
            this.clock_ins.map(clock_in => {
                if(this.filters.client && (!clock_in.appointment.task.order.project.client.name.toLowerCase().includes(this.filters.client.toLowerCase()))){
                    return;
                }
                if(this.filters.project && (!clock_in.appointment.task.order.project.name.toLowerCase().includes(this.filters.project.toLowerCase()))){
                    return;
                }
                if(this.filters.order && (!clock_in.appointment.task.order.name.toLowerCase().includes(this.filters.order.toLowerCase()))){
                    return;
                }
                if(this.filters.task && (!clock_in.appointment.task.name.toLowerCase().includes(this.filters.task.toLowerCase()))){
                    return;
                }
                let key = clock_in.contact.name;
                let clock_in_time = null;
                switch(this.group_by){
                    case 'date' :
                        clock_in_time = new moment(clock_in.clock_in);
                        key = clock_in_time.format('YYYY-MM-DD');
                        break;
                    case 'client' :
                        key = clock_in.appointment.task.order.project.client.name;
                        break;
                    case 'project' :
                        key = clock_in.appointment.task.order.project.name;
                        break;
                    case 'assignment' :
                        key = clock_in.appointment.task.labor_assignment.name;
                        break;
                }
                if(!groups[key]){
                    groups[key] = [];
                }
                groups[key].push(clock_in);
            });
            return groups;
        },
        ...mapState({
          user_id: state => state.user.id,
          operator_id: state => state.settings.operating_company_client_id
        }),
    },
    watch:{
        operator_id(){
            this.getContacts();
        }
    }
}
</script>