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
                  <b-col>
                    <b-form-group label="Type">
                        <b-form-select
                          v-model="clock_in_type"
                          @change="getClockIns"
                          >
                            <b-form-select-option value="all">
                                All
                            </b-form-select-option>
                            <b-form-select-option value="task">
                                Task
                            </b-form-select-option>
                            <b-form-select-option value="overhead">
                                Overhead
                            </b-form-select-option>
                        </b-form-select>
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
                    <b-col>
                        Overhead Time
                    </b-col>
                    <b-col>
                        {{ overhead_time }}
                    </b-col>
                    <b-col>
                        Task Time
                    </b-col>
                    <b-col>
                        {{ task_time }}
                    </b-col>
                </b-row>
            </b-container>
            <b-table
                small
                striped
                hover
                :filter="filter"
                :items="variant_clock_ins"
                :fields="fields"
            >
                <template v-slot:[cell(id)]="data">
                    <a :href="'/clock_in/' + data.value"> {{ data.value }} </a>
                </template>
                <template v-slot:[cell(time)]="data">
                    {{ getDiff(data.item.clock_in,data.item.clock_out) }}
                </template>
                <template v-slot:[cell(order)]="data">
                    {{ data.item.appointment ? data.item.appointment.task.order.name : data.item.overhead_assignment ?  data.item.overhead_assignment.name : ''}}
                </template>
                <template v-slot:[cell(task)]="data">
                    {{ data.item.appointment ? data.item.appointment.task.name : data.item.overhead_category ? data.item.overhead_category.name : ''}}
                </template>
                <template v-slot:[cell(labor_activity.name)]="data">
                    <a href="/clock_ins" @click.stop.prevent="editClockIn(data.item, data.index, $event.target)"> {{ data.value }} </a>
                </template>
                <template v-slot:[cell(notes)]="data">
                     <img v-if="data.value" src="@/assets/details.png" v-b-tooltip.hover :title="data.value" fluid alt="DTS" style="width:20px;" />
                </template>
            </b-table>
        </main>
        <b-modal ref="modalEditClockIn" @ok="updateClockIn" title="Edit Clock In">
            <b-container fluid="md">
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Clock In" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="clock_in.clock_in"
                                type="datetime"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Clock Out" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="clock_in.clock_out"
                                type="datetime"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Activity" label-cols="4" label-align="right">
                            <Treeselect :options="filtered_labor_activities" :normalizer="treeNormalizer" v-model="clock_in.labor_activity_id"/>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Notes" label-cols="4" label-align="right">
                            <b-form-textarea
                                v-model="clock_in.notes"
                                type="text"
                            >
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </b-container>
        </b-modal>
    </div>
</template>
<script>
import moment from 'moment';
import TopMenu from './TopMenu';
import { mapState } from 'vuex';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import treeNormalizer from '../common/TreeNormalizer.js';
import treeFilter from '../common/TreeFilter.js';
export default {
    name: 'ViewClockIns',
    components: {
        TopMenu,
        Treeselect
    },
    data() {
        return {
            clock_ins: [],
            filter: null,
            contact_id: null,
            contacts: [{id: null, name: 'All'}],
            start_date: null,
            stop_date: null,
            clock_in:{
                index: null,
                clock_in: null,
                clock_out: null,
                notes: null,
                labor_activity_id: null,
                appointment: null
            },
            fields: [
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
                    {
                        key: 'notes',
                        label: 'Notes'
                    },
            ],
            settings: {},
            clock_in_type: 'all',
            labor_activities: []
        }
    },
    created() {
        this.$http.get('/labor_activities').then(response => {
            this.labor_activities = response.data.data;
        });
        this.start_date = moment().format('YYYY-MM-DD');
        this.stop_date = moment().format('YYYY-MM-DD');
        this.getContacts();
        this.getClockIns();
    },
    methods: {
        treeNormalizer,
        treeFilter,
        getContacts(){
            if(this.operator_id){
                this.$http.get('/contacts?client_id=' + this.operator_id).then(response => {
                    this.contacts = this.contacts.concat(response.data);
                });
            }
        },
        getClockIns(){
            let params = '?start_date=' + this.start_date + '&stop_date=' + this.stop_date + '&type=' + this.clock_in_type;
            if(this.contact_id){
                params += '&contact_id=' + this.contact_id;
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
        },
        editClockIn(clock_in,index){
            this.clock_in = clock_in;
            this.clock_in.index = index;
            this.$refs['modalEditClockIn'].show();
        },
        updateClockIn(){
            this.$http.patch('/clock_in/' + this.clock_in.id, this.clock_in).then(response => {
                this.clock_ins[this.clock_in.index] = response.data;
            });
        },
    },
    computed: {
        total_time(){
            let time = 0;
            this.clock_ins.map( c =>{
                time += this.getDiff(c.clock_in, c.clock_out);
            });
            return Math.round(time*100)/100;
        },
        overhead_time(){
            let time = 0;
            this.clock_ins.map( c =>{
                if(c.overhead_assignment_id){
                    time += this.getDiff(c.clock_in, c.clock_out);
                }
            });
            return Math.round(time*100)/100;
        },
        task_time(){
            let time = 0;
            this.clock_ins.map( c =>{
                if(c.appointment_id){
                    time += this.getDiff(c.clock_in, c.clock_out);
                }
            });
            return Math.round(time*100)/100;
        },
        ...mapState({
          user_id: state => state.user.id,
          operator_id: state => state.settings.operating_company_client_id
        }),
        variant_clock_ins(){
            let clock_ins = [];
            this.clock_ins.map(c => {
                if(!c.clock_out){
                    c._rowVariant = 'warning';
                }
                clock_ins.push(c);
            });
            return clock_ins;
        },
        filtered_labor_activities(){
            if(this.clock_in.appointment && this.clock_in.appointment.task.labor_assignment_id){
                return this.treeFilter(this.clock_in.appointment.task.labor_assignment_id,this.labor_activities);
            }
            return [];
        },
    },
    watch:{
        operator_id(){
            this.getContacts();
        }
    }
}
</script>

