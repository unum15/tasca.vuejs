<template>
    <div>
            <b-container fluid>
                <b-row>
                    <b-col>
                        <b-form-group label="Crew">
                            <b-form-select
                                @change="filterColumns"
                                :options="crews"
                                value-field="id"
                                text-field="name"
                                v-model="crew_id"
                                @input="getTasks()"
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col md="6" class="my-1">
                      <b-form-group label="Filter" class="mb-0">
                        <b-input-group>
                          <b-form-input v-model="filter" placeholder="Type to Search" />
                          <b-input-group-append>
                            <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
                          </b-input-group-append>
                        </b-input-group>
                      </b-form-group>
                    </b-col>
                    <b-col v-if="['Current', 'Pending', 'All', 'On Hold'].includes(tab)">
                        <b-form-group label="Date" class="mb-0">
                          <b-input-group>
                            <img src="@/assets/previous.png" v-b-tooltip.hover title="Previous Date" @click="previousDate" fluid alt="PD" style="width:25px;height:25px;" />
                            <b-form-input type="date" v-model="date" @input="getTasks()" />
                            <img src="@/assets/next.png" v-b-tooltip.hover title="Next Date" @click="nextDate" fluid alt="ND" style="width:25px;height:25px;" />
                          </b-input-group>
                        </b-form-group>
                    </b-col>
                    <b-col v-if="['Current', 'Pending'].includes(tab)">
                        <b-form-group label="View Days" class="mb-0">
                          <b-input-group>
                            <b-form-input type="number" v-model="view_days" @input="getTasks()" />
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
                :items="filtered_tasks"
                :fields="fields"
                :filter="filter"
                :tbody-tr-class="rowClass"
                primary-key="row"
                class="text-left"
                :sort-compare="sortCompare"
                :sort-by.sync="sortBy"
                >
                <template slot="thead-top">
                    <tr>
                        <th v-for="field in fields" :key="field.key">
                            <b-form-input type="text" @input="filterColumns" v-model="field.filter" v-if="field.filter !== undefined "></b-form-input>
                        </th>  
                    </tr>
                </template>
                <template v-slot:cell(start_date)="data">
                    <span v-b-popover.hover="data.item.order_date" :id="'start_date_' + data.item.id">{{ data.value }}</span>
                </template>
                <template v-slot:cell(order_name)="data">
                    <span v-b-popover.hover="data.item.order_description" :id="'order_name_' + data.item.id">
                        <a href="/scheduler" @click.stop.prevent="info(data.item, data.index, $event.target)">
                            {{ data.value }}
                        </a>
                    </span>
                </template>
                <template v-slot:cell(client)="data">
                    <a :href="'/client/' + data.item.client_id + '/project/' + data.item.project_id + '/order/' + data.item.order_id" target="_blank">
                        {{ data.item.client }}
                    </a>
                </template>
                <template v-slot:cell(property)="data">
                    <span v-b-popover.hover="data.item.address" :id="'property_' + data.item.id">{{ data.value }}</span>
                </template>
                <template v-slot:cell(name)="data">
                    <a :href="'/client/' + data.item.client_id + '/project/' + data.item.project_id + '/order/' + data.item.order_id + '/task/' + data.item.id" target="_blank">
                        <span v-b-popover.hover="data.item.description" :id="'name_' + data.item.id">{{ data.item.name }}</span>
                    </a>
                </template>
                <template v-slot:cell(appointment_status)="data">
                    <b-form-select
                        :options="appointment_statuses"
                        @input="save(data.item)"
                        value-field="id"
                        text-field="name"
                        v-model="data.item.appointment_status_id"
                        >
                    </b-form-select>
                </template>
                <template v-slot:cell(labor_assignment)="data">
                    <b-form-select
                        :options="labor_assignments"
                        @input="save(data.item)"
                        value-field="id"
                        text-field="name"
                        v-model="data.item.labor_assignment_id"
                        >
                    </b-form-select>
                </template>
                <template v-slot:cell(task_status)="data">
                    <b-form-select
                        :options="task_statuses"
                        @input="save(data.item)"
                        value-field="id"
                        text-field="name"
                        v-model="data.item.task_status_id"
                        >
                    </b-form-select>
                </template>
                <template v-slot:cell(task_action)="data">
                    <b-form-select
                        :options="task_actions"
                        @input="save(data.item)"
                        value-field="id"
                        text-field="name"
                        v-model="data.item.task_action_id"
                        >
                    </b-form-select>
                </template>
                <template v-slot:cell(day)="data">
                    <b-form-input
                        type="text"
                        @change="save(data.item)"
                        v-model="data.item.day"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(date)="data">
                    <b-form-input
                        v-b-popover.hover="data.item.notes"
                        type="date"
                        @change="copyDateTmp(data.item);save(data.item)"
                        v-model="data.item.date_tmp"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(sort_order)="data">
                    <b-form-input
                        @change="copyOrderTmp(data.item);save(data.item)"
                        v-model="data.item.sort_order_tmp"
                        >
                    </b-form-input>
                </template>
                <template v-slot:cell(crew_hours)="data">
                    <b-form-input
                        @change="save(data.item)"
                        v-model="data.item.crew_hours"
                        >
                    </b-form-input>
                </template>
                <template v-slot:cell(time)="data">
                    <b-form-input
                        type="time"
                        @change="save(data.item)"
                        v-model="data.item.time"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(actions)="row">
                    <img src="@/assets/details.png" v-b-tooltip.hover title="Show Details" @click.stop="row.toggleDetails" :pressed="row.detailsShowing" fluid alt="DTS" style="width:20px;" />
                    <img src="@/assets/add.png" v-b-tooltip.hover title="Add Task To Order" @click.stop="addTask(row.item)" fluid alt="+" style="width:20px;" />
                    <img src="../assets/clear.png" v-b-tooltip.hover title="Clear Scheduling Data" @click.stop="clearScheduleData(row.item)" fluid alt="CS" style="width:20px;" />
                  </template>
                  <template slot="row-details" slot-scope="row">
                    <b-card>
                      <ul>
                        <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value}}</li>
                      </ul>
                    </b-card>
                  </template>
            </b-table>
           <b-modal size="xl" scrollable ref="modalInfo" id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
                <ViewAppointment
                    v-if="modalInfo.order_id"
                    :appointment_id="modalInfo.appointment_id"
                    :task_id="modalInfo.task_id"
                    :order_id="modalInfo.order_id"
                >
                </ViewAppointment>
            </b-modal>
        
    </div>
</template>
<script>
import moment from 'moment';
import ViewAppointment from './ViewAppointment';
export default {
    name: 'ViewScheduleTab',
    components: {
        'ViewAppointment': ViewAppointment
    },
    props: {
        tab: {default: null},
        task_actions: {required: true},
        labor_assignments: {required: true},
        task_statuses: {required: true},
        labor_types: {required: true},
        appointment_statuses: {required: true}
    },
    data() {
        return {
            tasks: [],
            filtered_tasks: [],
            filter: null,
            modalInfo: { title: '', appointment_id: null, task_id: null, order_id: null },
            date: moment().format('YYYY-MM-DD'),
            view_days: 14,
            crews: [],
            crew_id: '*',
            sortBy: 'date',
            fields: [
                {
                    key: 'start_date',
                    label: 'Start Date',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'service_window',
                    label: 'Service Window',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'order_name',
                    label: 'Work Order Name',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'appointment_status',
                    label: 'C',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'client',
                    label: 'Client',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'property',
                    label: 'Property',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'name',
                    label: 'Name',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'order_priority',
                    label: 'Pri',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'labor_assignment',
                    label: 'Assignment',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'day',
                    label: 'Day',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'date',
                    label: 'Date',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'sort_order',
                    label: 'Order',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'crew_hours',
                    label: 'Crew Hours',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'time',
                    label: 'Time',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'actions',
                    label: 'Actions'
                }
            ]
                
        }
    },
    created() {
        this.$http.get('/crews').then(response => {
            this.crews = response.data;
            this.crews.unshift({id: '*', name: 'All'});
            this.crews.unshift({id: '', name: 'None'});
        });
        this.getTasks();
    },
    methods: {
        getTasks(){
            this.$http.get('/schedule?status=' + escape(this.tab) + '&date=' + this.date + '&crew_id=' + this.crew_id + '&view_days=' + this.view_days).then((results) => {
                if(['Pending', 'On Hold', 'All'].includes(this.tab)){
                    this.sortBy='start_date';
                }
                this.tasks = results.data;
                this.tasks.forEach((t) => {
                    t.sort_order_tmp = t.sort_order;
                    t.date_tmp = t.date;
                });
                this.filtered_tasks = this.tasks;
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
        info (item) {
            this.modalInfo.title = `${item.order_name} -- ${item.name}`;
            this.modalInfo.appointment_id = item.appointment_id;
            this.modalInfo.task_id = item.task_id;
            this.modalInfo.order_id = item.order_id;
            this.$refs['modalInfo'].show();
        },
        resetModal () {
            this.modalInfo.title = ''
            this.modalInfo.content = ''
            this.modalInfo.id = null
        },
        addTask (task){
            var new_task = {
                order_id: task.id,
                billable: true
            };
            this.$http.post('/task', new_task).then(response => {
                this.tasks.push(response.data);
            })
        },
        clearScheduleData(task){
            task.day = null;
            task.date = null;
            task.time = null;
            task.sort_order = null;
            this.save(task);
        },
        copyOrderTmp(item){
            item.sort_order = item.sort_order_tmp;
        },
        copyDateTmp(item){
            item.date = item.date_tmp;
        },
        save(item){
            var appointment = {
                appointment_status_id: item.appointment_status_id,
                task_id: item.task_id,
                day: item.day,
                date: item.date,
                time: item.time,
                sort_order : item.sort_order
            }
            if(item.id){
                this.$http.patch('/appointment/' + item.id, appointment);
            }
            else{
                this.$http.post('/appointment', appointment).then(response =>{
                    item.id = response.data.id;
                })
            }
            var task = {
                labor_assignment_id: item.labor_assignment_id,
                task_status_id: item.task_status_id,
                task_action_id: item.task_action_id,
                crew_hours: item.crew_hours
            
            }
            this.$http.patch('/task/' + item.task_id, task);
        },
        rowClass(item){
            var today = moment();
            var window_date = moment(item.start_date).add(item.service_window,'days');
            var classes = [];
            if(window_date < today){
                classes.push('font-weight-bold');
            }
            if(item.labor_type_id == 1){
                switch(item.order_status_type_id){
                    case 1:
                        classes.push('table-danger');
                        break;
                    case 2:
                        classes.push('table-warning');
                        break;
                    case 3:
                        classes.push('table-success');
                        break;
                }
            }
            return classes;
        },
        sortCompare(a, b, key) {
            switch(key){
                case 'time':
                case 'date':
                    var value = 0;
                    if(a.date && b.date){
                        var first_date = moment(a.date);
                        var second_date = moment(b.date);
                        value = first_date.diff(second_date, 'days');
                    }
                    else{
                        if(a.date){
                            value = 1;
                        }
                        else{
                            if(b.date){
                                value = -1;
                            }
                        }
                    }
                    if(value == 0){
                        value = this.sortCompare(a, b, 'sort_order');
                        if(value == 0){
                            if(a.time == b.time){
                                return this.sortCompare(a, b, 'start_date');
                            }
                            else{
                                return a.time < b.time;
                            }
                        }
                        else{
                            return value;
                        }
                    }
                    else{
                        return value;
                    }
                default:
                    if (typeof a[key] === 'number' && typeof b[key] === 'number') {
                      return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
                    } else {
                      return this.toString(a[key]).localeCompare(this.toString(b[key]), undefined, {
                        numeric: true
                      })
                    }
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
        filterColumns(){
            this.filtered_tasks = this.tasks;
            for(var x = 0;x < this.fields.length; x++){
                if(this.fields[x].filter){
                    var regex = new RegExp(this.fields[x].filter, "i");
                    this.filtered_tasks = this.filtered_tasks.filter(t => {
                        var value = t[this.fields[x].key]
                        if(!value){
                            value = "";
                        }
                        return value.match(regex) !== null
                    })
                }
            }
        }
    }
}
</script>
