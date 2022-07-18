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
                        <b-button @click="getClockIns">Submit Dates</b-button><br />
                        <b-button @click="exportClockIns">Export</b-button>
                        <b-button @click="newClockIn">Add Clock In</b-button>
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
                        <b-form-group label="Labor Type">
                            <b-form-input type="text" v-model="filters.labor_type"></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Assignment">
                            <b-form-input type="text" v-model="filters.labor_assignment"></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Activity">
                            <b-form-input type="text" v-model="filters.labor_activity"></b-form-input>
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
                            Total {{ group_by }}s
                        </b-col>
                        <b-col>
                            {{ Object.keys(groups).length }}
                        </b-col>
                        <template v-for="labor_type in labor_types.slice().sort((a,b) => (a.name > b.name))">
                            <b-col  :key="labor_type.id + '-name'">
                                {{ labor_type.name }}
                            </b-col>
                            <b-col :key="labor_type.id + '-total'">
                                {{ labor_type_time(groups,labor_type.id) }}
                            </b-col>
                        </template>
                        <b-col>
                            Total Time
                        </b-col>
                        <b-col>
                            {{ total_time(groups) }}
                        </b-col>
                    </b-row>
            </b-container>
            <b-container v-for="(key) in sort_ascending ? Object.keys(groups).sort() : Object.keys(groups).sort().reverse()" :key="key"  style="max-width:1600px">
                <b-row>
                    <b-col style="font-weight:bold;font-size:150%;text-align:left;">
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
                        :tbody-tr-class="clockInClass"
                    >
                        <template v-slot:cell(contact)="data">
                            <a href="/scheduler" @click.stop.prevent="editClockIn(data.item, data.index, $event.target)">
                                {{ data.value.name }}
                            </a>
                        </template>
                        <template v-slot:cell(id)="data">
                            <a :href="'/clock_in/' + data.value"> {{ data.value }} </a>
                        </template>
                        <template v-slot:cell(actions)="data">
                            <img src="@/assets/delete.png" @click.stop="removeClockIn(data.item)" fluid alt="-" style="width:20px;cursor:pointer;"/>
                        </template>
                    </b-table>
                </b-row>
                <b-row>
                    <template v-for="labor_type in labor_types">
                        <b-col :key="labor_type.id + '-name'">
                            {{ labor_type.name }}
                        </b-col>
                        <b-col :key="labor_type.id + '-total'">
                            {{ group_labor_type_time(groups[key],labor_type.id) }}
                        </b-col>
                    </template>
                    <b-col style="font-weight:bold;">
                        Total
                    </b-col>
                    <b-col>
                        {{ total_date(groups[key]) }}
                    </b-col>
                </b-row>
            </b-container>
        </main>
        <b-modal size="xl" scrollable ref="modalEditClockIn" id="modalEditClockIn" title="Edit Clock In" >
            <ClockInComplex
                :clock_in="edit_clock_in"
                :contacts="contacts"
                @remove-clock-in="removeClockIn"
                @saved="modalEditClockIn"
            >
            </ClockInComplex>
        </b-modal>
    </div>
</template>
<script>
import moment from 'moment';
import TopMenu from './TopMenu';
import FileSaver from 'file-saver';
import { mapState } from 'vuex';
import ClockInComplex from './ClockInComplex';
export default {
    name: 'ViewClockIns',
    components: {
        TopMenu,
        ClockInComplex
    },
    data() {
        return {
            edit_clock_in: {},
            clock_ins: [],
            contact_id: null,
            contacts: [],
            start_date: null,
            stop_date: null,
            group_by: 'date',
            labor_types: [],
            filters: {
                client: null,
                project: null,
                order: null,
                task: null
            },
            sort_ascending: true,
            fields: [
                    {
                        key: 'contact',
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
                        key: 'appointment.task.labor_type.name',
                        label: 'Labor Type',
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
                    {
                        key:'actions',
                        label: '',
                        sortable: false
                    }
            ],
            settings: {}
        }
    },
    created() {
        let last_sunday = moment().startOf('week');
        this.start_date = last_sunday.format('YYYY-MM-DD');
        this.stop_date = last_sunday.add(6, 'day').format('YYYY-MM-DD');
        this.getLaborTypes();
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
        getLaborTypes(){
            this.$http.get('/labor_types').then(response => {
                this.labor_types = response.data.data;
            });
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
        group_labor_type_time(clock_ins, labor_type_id){
            let time = 0;
            clock_ins.map( c =>{
                if(c.appointment.task.labor_type_id == labor_type_id){
                    time += this.getDiff(c.clock_in, c.clock_out);
                }
            });
            return Math.round(time*100)/100;
        },
        formatTime(time){
            return moment(time).format('MM/DD hh:mm A');
        },
        total_time(groups){
            let time = 0;
            Object.keys(groups).map(g => {
                groups[g].map( c =>{
                    time += this.getDiff(c.clock_in, c.clock_out);
                });
            });
            return Math.round(time*100)/100;
        },
        labor_type_time(groups,labor_type_id){
            let time = 0;
            Object.keys(groups).map( g => {
                groups[g].map( c =>{
                    if(c.appointment.task.labor_type_id == labor_type_id){
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
        },
        exportClockIns(){
            let text = "";
            for (let group in this.groups) {
                this.groups[group].map( c => {
                    this.fields.map ( f => {
                        if(f.key.indexOf('.')>0){
                            let subs = f.key.split('.');
                            let val = c;
                            subs.map(s => {
                                val = val[s];
                            });
                            text += '"' + val + '",';
                        }
                        else{
                            if(f.key == 'time'){
                                text += '"' + this.timeColumn(null,'time',c) + '",';
                            }                        
                            else{
                                text += '"' + c[f.key] + '",';
                            }
                        }
                        
                    });
                    text += '\n';
                });
            }
            var blob = new Blob([text], {type: "text/csv;charset=utf-8"});
            let group_by = this.group_by.charAt(0).toUpperCase() + this.group_by.slice(1);
            let contacts = this.contacts.filter(c => (c.id == this.contact_id));
            let contact = "All";
            if(contacts.length){
                contact = contacts[0].name;
            }
            FileSaver.saveAs(blob, `Time Card ${group_by} ${contact} ${this.start_date} ${this.stop_date}.csv`);
        },
        editClockIn(clock_in){
            this.edit_clock_in = clock_in;
            this.$refs['modalEditClockIn'].show();
        },
        newClockIn(){
           this.edit_clock_in = {};
           this.$refs['modalEditClockIn'].show();
        },
        removeClockIn(clock_in){
            this.$http.delete('/clock_in/' + clock_in.id).then(()=> {
                this.getClockIns();
            });
        },
        modalEditClockIn(){
            this.getClockIns();
        },
        clockInClass(clock_in){
            let classes = '';
            if(!clock_in.clock_out){
                classes += 'open ';
            }
            let clock_in_time = new moment(clock_in.clock_in);
            let clock_out_time = new moment(clock_in.clock_out);
            if(clock_out_time.diff(clock_in_time, 'hours') > 4){
                classes += 'over ';
            }
            if(clock_in_time.format('YYY-MM-DD') != clock_in_time.format('YYY-MM-DD')){
                classes += 'dates';
            }
            this.clock_ins.map(c =>{
                if((clock_in.employee_id = c.employee_id)&&((clock_in.clock_in < c.clock_out) && (clock_in.clock_out > c.clock_in))){
                    classes += 'overlap';
                }
            })
            return classes;
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
                if(this.filters.labor_type && (!clock_in.appointment.task.labor_type.name.toLowerCase().includes(this.filters.labor_type.toLowerCase()))){
                    return;
                }
                if(this.filters.labor_assignment && (!clock_in.appointment.task.labor_assignment.name.toLowerCase().includes(this.filters.labor_assignment.toLowerCase()))){
                    return;
                }
                if(this.filters.labor_activity && (!clock_in.labor_activity.name.toLowerCase().includes(this.filters.labor_activity.toLowerCase()))){
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
          operator_id: state => state.settings.operating_company_client_id,
          clock_in_reminder_minutes: state => state.settings.clock_in_reminder_minutes,
          clock_in_reminder_color: state => state.settings.clock_in_reminder_color,
          clock_in_current_color: state => state.settings.clock_in_current_color
        }),
    },
    watch:{
        operator_id(){
            this.getContacts();
        }
    }
}
</script>
<style>
.open{
    background-color: yellow;
}
.over{
    color: red;
}
.dates{
    background-color: blue;
}
.overlap{
    background-color: purple;
}
</style>