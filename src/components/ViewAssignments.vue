<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            {{ contact_name }}
        </head>
        <main>
            <h2>Assignments for {{ contact_name }}</h2>
            <div>
                <span v-if="clock_in">
                    <b-button @click="showClockInOverhead">Change</b-button>
                    <b-button @click="showClockOutOverhead">Clock Out</b-button>
                    Clocked: {{ formatDateTimeToTime(clock_in.clock_in) }} - {{ clock_in.appointment.task.labor_assignment ? clock_in.appointment.task.labor_assignment.name:'Unassigned'}} - {{ clock_in.labor_activity ? clock_in.labor_activity.name: 'Unassigned'  }}
                </span>
                <b-button @click="showClockInOverhead" v-show="!clock_in">Clock In</b-button>
                <b-modal ref="modal-clock-in-overhead" @ok="clockInOverhead" :title="modal_overhead.title">
                    <b-container fluid>
                        <b-row v-if="clock_in">
                            <b-col style="text-align:center;font-weight:bold;">
                                Current Clock In
                            </b-col>
                        </b-row>
                        <b-row v-if="clock_in">
                            <b-col>
                                <b-form-group label="Date" class="mb-0">
                                    <b-form-input type="date" v-model="modal_overhead.current.date" />
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="Time" class="mb-0">
                                    <b-form-input type="time" v-model="modal_overhead.current.time" />
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="Assignment">
                                    <Treeselect :options="assignments" :normalizer="treeNormalizer" v-model="modal_overhead.current.labor_assignment_id" @input="modal_overhead.current.labor_activity_id=null"/>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="Activity">
                                    <Treeselect :options="filtered_current_activities" :normalizer="treeNormalizer" v-model="modal_overhead.current.labor_activity_id"/>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row v-if="clock_in">
                            <b-col>
                                <b-form-group label="Notes" class="mb-0">
                                    <b-form-input type="text" v-model="modal_overhead.current.notes" />
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row v-if="modal_overhead.clock_in">
                            <b-col style="text-align:center;font-weight:bold;">
                                New Clock In
                            </b-col>
                        </b-row>
                        <b-row v-if="!modal_overhead.clock_in">
                            <b-col style="text-align:center;font-weight:bold;">
                                Clock Out
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <b-form-group label="Date" class="mb-0">
                                    <b-form-input type="date" v-model="modal_overhead.new.date" />
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="Time" class="mb-0">
                                    <b-form-input type="time" v-model="modal_overhead.new.time" />
                                </b-form-group>
                            </b-col>
                            <b-col v-if="modal_overhead.clock_in">
                                <b-form-group label="Assignment">
                                    <Treeselect :options="assignments" :normalizer="treeNormalizer" v-model="modal_overhead.new.labor_assignment_id" @input="modal_overhead.new.labor_activity_id=null"/>
                                </b-form-group>
                            </b-col>
                            <b-col v-if="modal_overhead.clock_in">
                                <b-form-group label="Activity">
                                    <Treeselect :options="filtered_new_activities" :normalizer="treeNormalizer" v-model="modal_overhead.new.labor_activity_id"/>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-modal>
            </div>
            <b-container fluid>
                <b-row>
                    <b-col>
                        <b-form-group label="Date" class="mb-0">
                          <b-input-group>
                            <img src="@/assets/previous.png" v-b-tooltip.hover title="Previous Date" @click="previousDate" fluid alt="PD" style="width:25px;height:25px;" />
                            <b-form-input type="date" v-model="date" @input="getTasks()" />
                            <img src="@/assets/next.png" v-b-tooltip.hover title="Next Date" @click="nextDate" fluid alt="ND" style="width:25px;height:25px;" />
                          </b-input-group>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Crew">
                            <b-form-select
                                @change="filterByCrew"
                                :options="crews"
                                value-field="id"
                                text-field="name"
                                v-model="crew_id"
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Filter" class="mb-0">
                          <b-input-group>
                            <b-form-input v-model="text_filter" placeholder="Type to Search" />
                            <b-input-group-append>
                                <b-btn :disabled="!text_filter" @click="text_filter = null">Clear</b-btn>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
            </b-container>
            <b-table
                small
                striped
                hover
                foot-clone
                :items="tasks"
                :fields="fields"
                :filter="filter"
                :filter-function="filterTasks"
                :sort-by="sort_by"
                class="text-left"
                :sort-compare="sortCompare"
                >
                <template v-slot:cell(order_name)="data">
                    <a href="/scheduler" @click.stop.prevent="info(data.item, data.index, $event.target)"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(client)="data">
                    <a :href="'/client/' + data.item.client_id + '/project/' + data.item.project_id + '/order/' + data.item.order_id"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(date)="data">
                    {{ formatDate(data.value) }}
                </template>
                <template v-slot:cell(time)="data">
                    {{ formatTime(data.value) }}
                </template>
                <template v-slot:cell(name)="data">
                    <a :href="'/client/' + data.item.client_id + '/project/' + data.item.project_id + '/order/' + data.item.order_id + '/task/' + data.item.id" target="_blank">
                        <span :id="'name_' + data.item.id">{{ data.value }}</span>
                        <b-popover
                            :target="'name_' + data.item.id"
                            triggers="hover"
                            :content="data.item.description"
                        />
                    </a>
                </template>
            </b-table>
            <b-modal size="xl" scrollable ref="modalInfo" id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
                <ViewAppointment
                     v-if="modalInfo.id"
                    :appointment_id="modalInfo.id"
                    :labor_activities="activities"
                >
                </ViewAppointment>
            </b-modal>
        </main>
    </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import TopMenu from './TopMenu';
import ViewAppointment from './ViewAppointment';
import moment from 'moment';
import { mapState } from 'vuex';
export default {
    name: 'ViewAssignments',
    components: {
        TopMenu,
        ViewAppointment,
        Treeselect
    },
    data() {
        return {
            order_status_types: [],
            crews: [],
            crew_id: null,
            tasks: [],
            text_filter: null,
            modalInfo: { title: '', content: '', id: null },
            date: null,
            sort_by: 'time',
            clock_in: null,
            modal_overhead: {
                clock_in : true,
                new: {
                    date: null,
                    time: null,
                    labor_assignment_id: null,
                    labor_activity_id: null,
                    title: 'Clock In - Overhead'
                },
                current: {
                    date: null,
                    time: null,
                    labor_assignment_id: null,
                    labor_activity_id: null,
                    title: 'Clock In - Overhead',
                    notes: null
                },
            },
            activities: [],
            assignments: [],
            fields: [
                {
                    key: 'order_name',
                    label: 'S/WO',
                    sortable: true
                },
                {
                    key: 'appointment_status',
                    label: 'C',
                    sortable: true
                },
                {
                    key: 'client',
                    label: 'Client',
                    sortable: true
                },
                {
                    key: 'property',
                    label: 'Property',
                    sortable: true
                },
                {
                    key: 'name',
                    label: 'Name',
                    sortable: true
                },
                {
                    key: 'date',
                    label: 'Date',
                    sortable: true
                },
                {
                    key: 'sort_order',
                    label: 'Order',
                    sortable: true
                },
                {
                    key: 'time',
                    label: 'Time',
                    sortable: true
                },
                {
                    key: 'notes',
                    label: 'Notes',
                    sortable: true
                },
                {
                    key: 'completion_date',
                    label: 'Completed',
                    sortable: true
                },
                {
                    key: 'billed_date',
                    label: 'Billed',
                    sortable: true
                }
            ]
        }
    },
    created() {
        this.date = moment().format('YYYY-MM-DD');
        this.$http.get('/order_status_types').then(response => {
			this.order_status_types = response.data;
		});
        this.$http.get('/crews').then(response => {
			this.crews = response.data;
            this.crews.unshift({id: null, name: 'All'});
		});
        this.$http.get('/clock_in/current').then(response => {
			this.clock_in = response.data;
            this.clockInToCurrent();
		});
        this.$http.get('/labor_activities').then(response => {
			this.activities = response.data.data;
		});
        this.getTasks();
        this.getAssignments();
    },
    methods: {
        getTasks(){
            this.$http.get('/schedule?status=today&date='+this.date).then((results) => {
                this.tasks = results.data;
            });
        },
        getAssignments(){
            this.$http.get('/labor_assignments?assigned=true').then(response => {
                this.assignments = response.data.data;
            });
        },
        previousDate(){
            this.date = moment(this.date).subtract(1, 'day').format('YYYY-MM-DD');
            this.getTasks();
        },
        nextDate(){
            this.date = moment(this.date).add(1, 'day').format('YYYY-MM-DD');
            this.getTasks();
        },
        filterByCrew(){
        
        },
        info(item) {
            this.modalInfo.title = `${item.order_name} -- ${item.name}`
            this.modalInfo.id = item.id
            this.$refs['modalInfo'].show()
        },
        resetModal() {
            this.$http.get('/clock_in/current').then(response => {
                this.clock_in = response.data;
                this.clockInToCurrent();
            });
            this.modalInfo.title = ''
            this.modalInfo.content = ''
            this.modalInfo.id = null
        },
        filterTasks(record, filter){
            if((filter.crew_id != null) && (record.crew_id != filter.crew_id)) {
                return false;
            }
            if(filter.text_filter != null){
                var regex = new RegExp(filter.text_filter, 'i');
                var has_match = false;
                for(var field in record) {
                    if((record.hasOwnProperty(field)) && (typeof(record[field]) == "string") && (record[field].match(regex))) {
                        has_match = true;
                        break;
                    }
                }
                if(!has_match){
                  return false;
                }
            }
            return true;
        },
        sortCompare(a, b, key) {
            if (key == 'time'){
                let value = this.sortCompare(a, b, 'date');
                if(value === 0){
                    value = this.sortCompare(a, b, 'sort_order');
                    if(value != 0){
                        return value;
                    }
                }
                else{
                    return value;
                }
            }
            if (typeof a[key] === 'number' && typeof b[key] === 'number') {
              // If both compared fields are native numbers
              return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
            } else {
              // Stringify the field data and use String.localeCompare
              return this.toString(a[key]).localeCompare(this.toString(b[key]), undefined, {
                numeric: true
              })
            }
        },
        toString(value) {
            if (!value) {
              return ''
            } else if (value instanceof Object) {
              return Array.keys(value)
                .sort()
                .map(key => toString(value[key]))
                .join(' ')
            }
            return String(value)
        },
        formatDate(value){
            if(!value){
                return '';
            }
            return moment(value).format('MM-DD');
        },
        formatTime(value){
            if(value){
                return moment('2019-01-01 ' + value).format('hh:mm A');
            }
            return null;
        },
        formatDateTime(value){
            if(value){
                return moment(value).format('MM/DD hh:mm A');
            }
            return null;
        },
        formatDateTimeToTime(value){
            if(value){
                return moment(value).format('hh:mm A');
            }
            return null;
        },
        showClockInOverhead(){
            this.modal_overhead.clock_in = true;
            this.modal_overhead.new.date = moment().format('YYYY-MM-DD');
            this.modal_overhead.new.time = moment().format('HH:mm');
            this.modal_overhead.new.labor_assignment_id = this.$store.state.settings['default_labor_assignment_id-labor_type_id-'+this.overhead_labor_type_id];
            this.modal_overhead.new.labor_activity_id = this.default_activity_id;
            if(this.clock_in){
                this.modal_overhead.title = "Clock In";
            }
            else{
                this.modal_overhead.title = "Change Clock In";
            }
            this.$refs['modal-clock-in-overhead'].show();
        },
        showClockOutOverhead(){
            this.modal_overhead.clock_in = false;
            this.modal_overhead.title = "Clock Out";
            this.modal_overhead.new.date = moment().format('YYYY-MM-DD');
            this.modal_overhead.new.time = moment().format('HH:mm');
            this.modal_overhead.new.labor_assignment_id = null;
            this.modal_overhead.new.labor_activity_id = null;
            this.modal_overhead.current.notes = null;
            this.$refs['modal-clock-in-overhead'].show();
        },
        clockInOverhead(event){
            event.preventDefault();
            if(this.clock_in){
                if(!this.modal_overhead.current.labor_assignment_id){
                   alert('Please select current assignment.');
                   return;
                }
                if(!this.modal_overhead.current.labor_activity_id){
                   alert('Please select current activity.');
                   return;
                }
                let assignment = this.getAssignmentName(this.modal_overhead.current.labor_assignment_id);
                if(!assignment.order_id){
                   alert('This labor assignment has no associated order_id please update in labor mappings');
                   return;
                }                    
                let clock_in = {
                    clock_in : this.modal_overhead.current.date + ' ' + this.modal_overhead.current.time,
                    labor_assignment_id: this.modal_overhead.current.labor_assignment_id,
                    labor_activity_id: this.modal_overhead.current.labor_activity_id,
                    clock_out : this.modal_overhead.new.date + ' ' + this.modal_overhead.new.time,
                    notes: this.modal_overhead.current.notes
                };
                this.$http.patch('/clock_out/assigned/'+this.clock_in.id, clock_in).then(() => {
                    if(!this.modal_overhead.clock_in){
                        this.clock_in = null;
                    }
                    if(this.modal_overhead.clock_in){
                        this.postClockIn();
                    }
                    else{
                        this.$refs['modal-clock-in-overhead'].hide();
                    }
                });
            }
            else{
                if(this.modal_overhead.clock_in){
                    this.postClockIn();
                }
            }            
        },
        postClockIn(){
            if(!this.modal_overhead.new.labor_assignment_id){
                alert('Please select new assignment.');
                return;
             }
             if(!this.modal_overhead.new.labor_activity_id){
                alert('Please select new activity.');
                return;
             }
             let assignment = this.getAssignmentName(this.modal_overhead.new.labor_assignment_id);
             if(!assignment.order_id){
                alert('This labor assignment has no associated order_id please update in labor mappings');
                return;
             }                    
             let clock_in = {
                 clock_in : this.modal_overhead.new.date + ' ' + this.modal_overhead.new.time,
                 labor_assignment_id: this.modal_overhead.new.labor_assignment_id,
                 labor_activity_id: this.modal_overhead.new.labor_activity_id,
                 contact_id: this.$store.state.user.id
             };
             this.$http.post('/clock_in/assigned', clock_in).then(response => {
                 this.clock_in = response.data.data;
                 this.clockInToCurrent();
                 this.$refs['modal-clock-in-overhead'].hide();
             });
        },
        clockInToCurrent(){
            this.modal_overhead.current.date = moment(this.clock_in.clock_in).format('YYYY-MM-DD');
            this.modal_overhead.current.time = moment(this.clock_in.clock_in).format('HH:mm');
            this.modal_overhead.current.labor_assignment_id = this.clock_in.appointment.task.labor_assignment_id;
            this.modal_overhead.current.labor_activity_id = this.clock_in.labor_activity_id;
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
        getAssignmentName(id){
            let assignments = this.assignments.filter(a => a.id == id);
            if(!assignments.length){
                return;
            }
            return assignments[0];
        }
    },
    computed:{
        filter(){
            //we should return null when no filter is set
            return {
                text_filter: this.text_filter,
                crew_id: this.crew_id
            };
        },
        filtered_current_activities(){
            if(this.modal_overhead.current.labor_assignment_id){
                return this.findSelectedActivities(this.modal_overhead.current.labor_assignment_id,this.activities);
            }
            return [];
        },
        filtered_new_activities(){
            if(this.modal_overhead.new.labor_assignment_id){
                return this.findSelectedActivities(this.modal_overhead.new.labor_assignment_id,this.activities);
            }
            return [];
        },
        ...mapState({
          contact_name: state => state.user.name,
          overhead_labor_type_id: state => state.settings.overhead_labor_type_id,
          default_activity_id: state => state.settings.default_labor_activity_id
        })
    },
    watch:{
        overhead_labor_type_id(){
            this.getAssignments();
        }
    }
}
</script>
<style>
.modal-header {
    padding-bottom: 0px;
}
</style>