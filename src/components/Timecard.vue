<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Time Cards
        </head>
        <main>
            <b-container fluid>
                <b-row>
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
                          @change="getClockIns"
                          >
                        </b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Stop Date">
                        <b-form-input
                          type="date"
                          v-model="stop_date"
                          @change="getClockIns"
                          >
                        </b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                    <b-row>
                        <b-col>
                            Total Time
                        </b-col>
                        <b-col>
                            {{ total_time(dates) }}
                        </b-col>
                        <b-col>
                            Total Dates
                        </b-col>
                        <b-col>
                            {{ Object.keys(dates).length }}
                        </b-col>
                        <b-col>
                            Overhead Time
                        </b-col>
                        <b-col>
                            {{ overhead_time(dates) }}
                        </b-col>
                        <b-col>
                            Task Time
                        </b-col>
                        <b-col>
                            {{ task_time(dates) }}
                        </b-col>
                    </b-row>
            </b-container>
            <b-container v-for="(clock_ins,date) in dates" :key="date">
                <b-row>
                    <b-col style="font-weight:bold;font-size:150%;">
                        {{ date }}
                    </b-col>
                </b-row>
                <b-row>
                    <b-table
                        small
                        striped
                        outlined
                        hover
                        :items="clock_ins"
                        :fields="fields"
                    >
                        <template v-slot:cell(id)="data">
                            <a :href="'/clock_in/' + data.value"> {{ data.value }} </a>
                        </template>
                        <template v-slot:cell(clock_in)="data">
                            {{ format_time(data.value) }}
                        </template>
                        <template v-slot:cell(clock_out)="data">
                            {{ format_time(data.value) }}
                        </template>
                        <template v-slot:cell(time)="data">
                            {{ getDiff(data.item.clock_in,data.item.clock_out) }}
                        </template>
                        <template v-slot:cell(order)="data">
                            {{ data.item.task_date ? data.item.task_date.task.order.name : data.item.overhead_assignment ?  data.item.overhead_assignment.name : ''}}
                        </template>
                        <template v-slot:cell(task)="data">
                            {{ data.item.task_date ? data.item.task_date.task.name : data.item.overhead_category ? data.item.overhead_category.name : ''}}
                        </template>
                    </b-table>
                </b-row>
                <b-row>
                    <b-col>
                        Overhead
                    </b-col>
                    <b-col>
                        {{ overhead_date(clock_ins) }}
                    </b-col>
                    <b-col>
                        Task
                    </b-col>
                    <b-col>
                        {{ task_date(clock_ins) }}
                    </b-col>
                    <b-col style="font-weight:bold;">
                        Total
                    </b-col>
                    <b-col>
                        {{ total_date(clock_ins) }}
                    </b-col>
                </b-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import moment from 'moment';
import TopMenu from './TopMenu';
export default {
    name: 'ViewClockIns',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            contact_id: null,
            contacts: [],
            start_date: null,
            stop_date: null,
            dates: {},
            fields: [
                    {
                        key: 'order',
                        label: 'Order',
                        sortable: true
                    },
                    {
                        key: 'task',
                        label: 'Task',
                        sortable: true
                    },
                    {
                        key: 'clock_in',
                        label: 'Clock In',
                        sortable: true
                    },
                    {
                        key: 'clock_out',
                        label: 'Clock Out',
                        sortable: true
                    },
                    {
                        key: 'time',
                        label: 'Time',
                        sortable: true
                    },
                    
            ],
            settings: {}
        }
    },
    created() {
        this.contact_id = localStorage.getItem('id');
        let last_sunday = moment().startOf('week');
        this.start_date = last_sunday.format('YYYY-MM-DD');
        this.stop_date = last_sunday.add(6, 'day').format('YYYY-MM-DD');
        this.$http.get('/settings').then(response => {
            this.settings = response.data;
            if(this.settings.operating_company_client_id){
                this.$http.get('/contacts?client_id=' + this.settings.operating_company_client_id).then(response => {
                    this.contacts = response.data;
                    this.contact_id = localStorage.getItem('id');
                    this.getClockIns();
                });
            }
        })
    },
    methods: {
        getClockIns(){
            for(let date=moment(this.stop_date);date.format('YYYY-MM-DD')>=this.start_date;date.subtract(1, 'day') ){
                this.dates[date.format('YYYY-MM-DD')] = [];
            }
            Object.keys(this.dates).map(d => {
                this.$http.get('/clock_ins?contact_id=' + this.contact_id + '&start_date=' + d + '&stop_date=' + d ).then(response => {
                    this.dates[d] = response.data;
                    this.$forceUpdate();
                });
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
        overhead_date(clock_ins){
            let time = 0;
            clock_ins.map( c =>{
                if(c.overhead_assignment_id){
                    time += this.getDiff(c.clock_in, c.clock_out);
                }
            });
            return Math.round(time*100)/100;
        },
        task_date(clock_ins){
            let time = 0;
            clock_ins.map( c =>{
                if(c.task_date_id){
                    time += this.getDiff(c.clock_in, c.clock_out);
                }
            });
            return Math.round(time*100)/100;
        },
        format_time(time){
            return moment(time).format('hh:mm A');
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
                    if(c.task_date_id){
                        time += this.getDiff(c.clock_in, c.clock_out);
                    }
                });
            });
            return Math.round(time*100)/100;
        }
    }
}
</script>
