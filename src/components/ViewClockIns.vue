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
            </b-container>
            <b-table
                small
                striped
                hover
                :filter="filter"
                :items="clock_ins"
                :fields="fields"
            >
                <template v-slot:cell(id)="data">
                    <a :href="'/clock_in/' + data.value"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(time)="data">
                    {{ getDiff(data.item.clock_in,data.item.clock_out) }}
                </template>
                <template v-slot:cell(order)="data">
                    {{ data.item.task_date ? data.item.task_date.task.order.name : data.overhead_assignment ?  data.overhead_assignment.name : ''}}
                </template>
                <template v-slot:cell(task)="data">
                    {{ data.item.task_date ? data.item.task_date.task.name : data.overhead_category ? data.overhead_category.name : ''}}
                </template>
            </b-table>
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
            clock_ins: [],
            filter: null,
            contact_id: null,
            contacts: [],
            start_date: null,
            stop_date: null,
            fields: [
                    {
                        key: 'id',
                        label: 'Id',
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
                    {
                        key: 'order',
                        label: 'Order',
                        sortable: true
                    },
                    {
                        key: 'task',
                        label: 'Task',
                        sortable: true
                    }
            ]
        }
    },
    created() {
        this.contact_id = localStorage.getItem('id');
        let last_sunday = moment().startOf('week');
        this.start_date = last_sunday.format('YYYY-MM-DD');
        this.stop_date = last_sunday.add('day', 6).format('YYYY-MM-DD');
        this.$http.get('/contacts?client_id=1').then(response => {
            this.contacts = response.data;
        });
    },
    methods: {
        getClockIns(){
            this.$http.get('/clock_ins?contact_id=' + this.contact_id + '&start_date=' + this.start_date + '&stop_date=' + this.stop_date).then(response => {
                this.clock_ins = response.data;
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
        }
    }
}
</script>

