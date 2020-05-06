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
                    Clocked In At: {{ formatDateTime(clock_in.clock_in) }}
                    <b-button @click="showClockOut">Clock Out</b-button>
                </span>
                <b-button @click="showClockIn" v-show="!clock_in">Clock In</b-button>
                <b-modal ref="modal-clock-in"  @ok="clockIn" :title="modal_clock_in.title">
                    <b-container fluid>
                        <b-row>
                            <b-col>
                                <b-form-group label="Date" class="mb-0">
                                    <b-form-input type="date" v-model='modal_clock_in.date' />
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="Time" class="mb-0">
                                    <b-form-input type="time" v-model='modal_clock_in.time' />
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-modal>
            </div>
            <div v-show="clock_in">
                <span v-if="sign_in">
                    Signed In At: {{ formatDateTime(sign_in.sign_in) }}
                    Signed In To: {{ sign_in.task_date ? sign_in.task_date.task.name : sign_in.overhead_assignment.name + ' - ' + sign_in.overhead_category.name }}
                </span>
                <span v-else>
                    Not Signed In
                </span>
                <b-button @click="showSignInOverhead">Sign In - Overhead</b-button>
                <b-modal ref="modal-sign-in-overhead" @ok="signInOverhead" :title="modal_overhead.title">
                    <b-container fluid>
                        <b-row>
                            <b-col>
                                <b-form-group label="Date" class="mb-0">
                                    <b-form-input type="date" v-model="modal_overhead.date" />
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="Time" class="mb-0">
                                    <b-form-input type="time" v-model="modal_overhead.time" />
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="Assignment">
                                    <Treeselect :options="assignments" :normalizer="treeNormalizer" v-model="modal_overhead.overhead_assignment_id"/>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="Category">
                                    <Treeselect :options="filtered_categories" :normalizer="treeNormalizer" v-model="modal_overhead.overhead_category_id"/>
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
                <template v-slot:cell(order_id)="data">
                    <a :href="'/client/' + data.item.client_id + '/project/' + data.item.project_id + '/order/' + data.value"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(client)="data">
                    <a href="/scheduler" @click.stop.prevent="info(data.item, data.index, $event.target)"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(date)="data">
                    {{ formatDate(data.value) }}
                </template>
                <template v-slot:cell(time)="data">
                    {{ formatTime(data.value) }}
                </template>
                <template v-slot:cell(name)="data">
                    <span :id="'name_' + data.item.id">{{ data.value }}</span>
                    <b-popover
                        :target="'name_' + data.item.id"
                        triggers="hover"
                        :content="data.item.description"
                    />
                </template>
            </b-table>
            <b-modal size="xl" scrollable ref="modalInfo" id="modalInfo" @hide="resetModal" :title="modal_info.title" ok-only>
                <ViewTaskDate
                     v-if="modal_info.id"
                    :task_date_id="modal_info.id"
                    :clock_in_id="clock_in.id"
                >
                </ViewTaskDate>
            </b-modal>
        </main>
    </div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import TopMenu from './TopMenu';
import ViewTaskDate from './ViewTaskDate';
import moment from 'moment';
export default {
    name: 'ViewAssignments',
    components: {
        TopMenu,
        ViewTaskDate,
        Treeselect
    },
    data() {
        return {
            order_status_types: [],
            crews: [],
            contact_name: null,
            crew_id: null,
            tasks: [],
            text_filter: null,
            modal_info: { title: '', content: '', id: null },
            date: null,
            sort_by: 'time',
            modal_clock_in: {
                date: null,
                time: null,
                title: null
            },
            clock_in: null,
            sign_in: null,
            modal_overhead: {
                date: null,
                time: null,
                overhead_assignment_id: null,
                overhead_category_id: null,
                title: 'Sign In - Overhead'
            },
            categories: [],
            assignments: [],
            fields: [
                {
                    key: 'order_id',
                    label: 'S/WO#',
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
			this.clock_in = response.data.data;
		});
        this.$http.get('/sign_in/current').then(response => {
			this.sign_in = response.data;
		});
        this.$http.get('/overhead_assignments').then(response => {
			this.assignments = response.data.data;
		});
        this.$http.get('/overhead_categories').then(response => {
			this.categories = response.data.data;
		});
        this.getTasks();
        this.contact_name = localStorage.getItem('name');
    },
    methods: {
        getTasks(){
            this.$http.get('/schedule?status=today&date='+this.date).then((results) => {
                this.tasks = results.data;
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
            this.modal_info.title = `Order# ${item.order_id}`
            this.modal_info.id = item.id
            this.$refs['modalInfo'].show()
        },
        resetModal() {
            this.modal_info.title = ''
            this.modal_info.content = ''
            this.modal_info.id = null
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
                var value = this.sortCompare(a, b, 'date');
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
        showSignInOverhead(){
            this.modal_overhead.date = moment().format('YYYY-MM-DD');
            this.modal_overhead.time = moment().format('HH:mm');
            this.$refs['modal-sign-in-overhead'].show();
        },
        showClockIn(){
            this.modal_clock_in.title="Clock In";
            this.modal_clock_in.date = moment().format('YYYY-MM-DD');
            this.modal_clock_in.time = moment().format('HH:mm');
            this.$refs['modal-clock-in'].show();
        },
        showClockOut(){
            this.modal_clock_in.title="Clock Out";
            this.modal_clock_in.date = moment().format('YYYY-MM-DD');
            this.modal_clock_in.time = moment().format('HH:mm');
            this.$refs['modal-clock-in'].show();
        },
        signInOverhead(event){
            event.preventDefault();
            if(!this.modal_overhead.overhead_assignment_id){
                alert('Please select assignment.');
                return;
            }
            if(!this.modal_overhead.overhead_category_id){
                alert('Please select category.');
                return;
            }
            if(this.sign_in){
                let sign_in = {
                    sign_out : this.modal_overhead.date + ' ' + this.modal_overhead.time
                };
                this.$http.patch('/sign_in/'+this.sign_in.id, sign_in);
            }
            let sign_in = {
                clock_in_id : this.clock_in.id,
                sign_in : this.modal_overhead.date + ' ' + this.modal_overhead.time,
                overhead_assignment_id: this.modal_overhead.overhead_assignment_id,
                overhead_category_id: this.modal_overhead.overhead_category_id
            };
            this.$http.post('/sign_in', sign_in).then(response => {
                this.sign_in = response.data;
                this.$refs['modal-sign-in-overhead'].hide();
            });
        },
        clockIn(){
            if(!this.clock_in){
                let clock_in = {
                    clock_in : this.modal_clock_in.date + ' ' + this.modal_clock_in.time
                };
                this.$http.post('/clock_in', clock_in).then(response => {
                    this.clock_in = response.data.data;
                });
            }
            else{
                let clock_in = {
                    clock_out : this.modal_clock_in.date + ' ' + this.modal_clock_in.time
                };
                this.$http.patch('/clock_in/'+this.clock_in.id, clock_in).then(() => {
                    this.clock_in = null;
                });
            }
        },
        treeNormalizer(node){
            return {
                id: node.id,
                label: node.name,
                children: node.children,
            }
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
        filtered_categories(){
            if(this.modal_overhead.overhead_assignment_id){
                let selected_assignments = this.assignments.filter(a => a.id == this.modal_overhead.overhead_assignment_id);
                let assignment = selected_assignments[0];
                return this.categories.filter(c => (assignment.overhead_categories.filter(ac => (ac.id == c.id)).length));
            }
            return [];
        }
    }
}
</script>