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
                    <b-col v-if="tab == 'Current'">
                        <b-form-group label="Date" class="mb-0">
                          <b-input-group>
                            <img src="@/assets/previous.png" v-b-tooltip.hover title="Previous Date" @click="previousDate" fluid alt="PD" style="width:25px;height:25px;" />
                            <b-form-input type="date" v-model="date" @input="getTasks()" />
                            <img src="@/assets/next.png" v-b-tooltip.hover title="Next Date" @click="nextDate" fluid alt="ND" style="width:25px;height:25px;" />
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
                >
                <template slot="thead-top" slot-scope="data">
                    <tr>
                        <th v-for="field in fields" :key="field.key">
                            <b-form-input type="text" @input="filterColumns" v-model="field.filter" v-if="field.filter !== undefined "></b-form-input>
                        </th>  
                    </tr>
                </template>
                <template slot="order_id" slot-scope="data">
                    <a :href="'/client/' + data.item.client_id + '/project/' + data.item.project_id + '/order/' + data.value"> {{ data.value }} </a>
                </template>
                <template slot="client" slot-scope="data">
                    <a href="/scheduler" @click.stop.prevent="info(data.item, data.index, $event.target)"> {{ data.value }} </a>
                </template>
                <template slot="name" slot-scope="data">
                    <span v-b-popover.hover="data.item.description" :id="'name_' + data.item.id">{{ data.value }}</span>
                </template>
                
                <template slot="task_appointment_status" slot-scope="data">
                    <b-form-select
                        :options="task_appointment_statuses"
						@input="save(data.item)"
                        value-field="id"
                        text-field="name"
                        v-model="data.item.task_appointment_status_id"
                        >
                    </b-form-select>
                </template>
                <template slot="task_category" slot-scope="data">
                    <b-form-select
                        :options="task_categories"
						@input="save(data.item)"
                        value-field="id"
                        text-field="name"
                        v-model="data.item.task_category_id"
                        >
                    </b-form-select>
                </template>
                <template slot="task_status" slot-scope="data">
                    <b-form-select
                        :options="task_statuses"
						@input="save(data.item)"
                        value-field="id"
                        text-field="name"
                        v-model="data.item.task_status_id"
                        >
                    </b-form-select>
                </template>
                <template slot="task_action" slot-scope="data">
                    <b-form-select
                        :options="task_actions"
						@input="save(data.item)"
                        value-field="id"
                        text-field="name"
                        v-model="data.item.task_action_id"
                        >
                    </b-form-select>
                </template>
                <template slot="day" slot-scope="data">
                    <b-form-input
                        type="text"
						@change="save(data.item)"
                        v-model="data.item.day"
                    >
                    </b-form-input>
                </template>
                <template slot="date" slot-scope="data">
                    <b-form-input
                        v-b-popover.hover="data.item.notes"
                        type="date"
						@change="save(data.item)"
                        v-model="data.item.date"
                    >
                    </b-form-input>
                </template>
                <template slot="sort_order" slot-scope="data">
                    <b-form-input
						@change="save(data.item)"
                        v-model="data.item.sort_order"
                        >
                    </b-form-input>
                </template>
                <template slot="time" slot-scope="data">
                    <b-form-input
                        type="time"
						@change="save(data.item)"
                        v-model="data.item.time"
                    >
                    </b-form-input>
                </template>
                <template slot="actions" slot-scope="row">
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
                <ViewTask
                    v-if="modalInfo.task_id"
                    :task_id="modalInfo.task_id"
                >
                </ViewTask>
            </b-modal>
        
    </div>
</template>
<script>
import moment from 'moment';
import ViewTask from './ViewTask';
export default {
    name: 'ScheduleTab',
    components: {
        'ViewTask': ViewTask
    },
    props: {
        tab: {default: null},
        task_actions: {required: true},
        task_categories: {required: true},
        task_statuses: {required: true},
        task_types: {required: true},
        task_appointment_statuses: {required: true}
    },
    data() {
        return {
            tasks: [],
            filtered_tasks: [],
            filter: null,
            modalInfo: { title: '', content: '', order_id: null },
            date: moment().format('YYYY-MM-DD'),
            crews: [],
            crew_id: null,
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
                    key: 'order_id',
                    label: 'S/WO#',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'task_appointment_status',
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
                    key: 'task_category',
                    label: 'Category',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'task_status',
                    label: 'Status',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'task_action',
                    label: 'Action',
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
            this.crews.unshift({id: null, name: 'All'});
		});
        this.getTasks();
    },
    methods: {
        getTasks(){
            this.$http.get('/schedule?status=' + this.tab).then((results) => {
                this.tasks = results.data;
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
            this.modalInfo.title = `Task #${item.task_id} - ${item.name}`
            this.modalInfo.task_id = item.task_id
            this.$refs['modalInfo'].show()
        },
        resetModal () {
            this.modalInfo.title = ''
            this.modalInfo.content = ''
            this.modalInfo.order_id = null
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
            task.task.sort_order = null;
            this.save(task);
        },
        save(item){
            var task_date = {
                task_id: item.task_id,
                day: item.day,
                date: item.date,
                time: item.time,
                sort_order : item.sort_order
            }
            if(item.id){
                this.$http.patch('/task_date/' + item.id, task_date);
            }
            else{
                this.$http.post('/task_date', task_date).then(response =>{
                    item.id = response.data.id;
                })
            }
            var task = {
                task_appointment_status_id: item.task_appointment_status_id,
                task_category_id: item.task_category_id,
                task_status_id: item.task_status_id,
                task_action_id: item.task_action_id
            
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
            if(item.task_type_id == 1){
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
            if (key == 'time'){
                var value = this.sortCompare(a, b, 'date');
                if(value == 0){
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