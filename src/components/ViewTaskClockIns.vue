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
                    <b-form-group label="Orders">
                        <b-form-select
                          :options="orders"
                          value-field="id"
                          text-field="name"
                          v-model="order_id"
                          @change="getClockIns"
                          >
                        </b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Tasks">
                        <b-form-select
                          :options="tasks"
                          value-field="id"
                          text-field="name"
                          v-model="task_id"
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
                        {{ total_time }}
                    </b-col>
                    <b-col>
                        Total Clock Ins
                    </b-col>
                    <b-col>
                        {{ clock_ins.length }}
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
                    {{ data.item.appointment ? data.item.appointment.task.order.name : data.item.overhead_assignment ?  data.item.overhead_assignment.name : ''}}
                </template>
                <template v-slot:cell(task)="data">
                    {{ data.item.appointment ? data.item.appointment.task.name : data.item.overhead_category ? data.item.overhead_category.name : ''}}
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import moment from 'moment';
import TopMenu from './TopMenu';
export default {
    name: 'ViewTaskClockIns',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            clock_ins: [],
            filter: null,
            order_id: null,
            task_id: null,
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
            ],
            settings: {},
            clock_in_type: 'all'
        }
    },
    created() {
        let last_sunday = moment().startOf('week');
        this.start_date = last_sunday.format('YYYY-MM-DD');
        this.stop_date = last_sunday.add('day', 6).format('YYYY-MM-DD');
        this.getClockIns();
    },
    methods: {
        getClockIns(){
            let params = '?start_date=' + this.start_date + '&stop_date=' + this.stop_date + '&type=task';
            if(this.order_id){
                params += '&order_id=' + this.order_id;
            }
            if(this.task_id){
                params += '&task_id=' + this.task_id;
            }
            this.$http.get('/clock_ins' + params).then(response => {
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
    },
    computed: {
        total_time(){
            let time = 0;
            this.clock_ins.map( c =>{
                time += this.getDiff(c.clock_in, c.clock_out);
            });
            return Math.round(time*100)/100;
        },
        orders(){
            let orders = [];
            this.clock_ins.map( c =>{
                if(!orders.includes(c.appointment.task.order)){
                    orders.push(c.appointment.task.order);
                }
            });
            return orders;
        },
        tasks(){
            let tasks = [];
            this.clock_ins.map( c =>{
                if(!tasks.includes(c.appointment.task)){
                    tasks.push(c.appointment.task);
                }
            });
            return tasks;
        }
    }
}
</script>

