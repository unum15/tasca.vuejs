<template>
    <div>
            <b-container fluid>
                <b-row>
                  <b-col md="6" class="my-1">
                    <b-form-group horizontal label="Filter" class="mb-0">
                      <b-input-group>
                        <b-form-input v-model="filter" placeholder="Type to Search" />
                        <b-input-group-append>
                          <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
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
                :tbody-tr-class="rowClass"
                >
                <template slot="order_id" slot-scope="data">
                    <a :href="'/client/'+ data.item.client_id + '/order/' + data.value"> {{ data.value }} </a>
                </template>
                <template slot="client" slot-scope="data">
                    <a href="/scheduler" @click.stop.prevent="info(data.item, data.index, $event.target)"> {{ data.value }} </a>
                </template>
                <template slot="name" slot-scope="data">
                    <span :id="'name_' + data.item.id">{{ data.value }}</span>
                    <b-popover
                        :target="'name_' + data.item.id"
                        triggers="hover"
                        :content="data.item.description"
                    />
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
            <b-modal size="xl" scrollable id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
                <ViewOrder
                    v-if="modalInfo.order_id"
                    :order_id="modalInfo.order_id"
                >
                </ViewOrder>
            </b-modal>
        
    </div>
</template>
<script>
import moment from 'moment';
import ViewOrder from './ViewOrder';
export default {
    name: 'ScheduleTab',
    components: {
        'ViewOrder': ViewOrder
    },
    props: {
        order_status_type: {default: null},
        task_actions: {required: true},
        task_categories: {required: true},
        task_statuses: {required: true},
        task_types: {required: true},
        task_appointment_statuses: {required: true}
    },
    data() {
        return {
            tasks: [],
            filter: null,
            modalInfo: { title: '', content: '', order_id: null },
            fields: [
                {
                    key: 'start_date',
                    label: 'Start Date',
                    sortable: true
                },
                {
                    key: 'service_window',
                    label: 'Service Window',
                    sortable: true
                },
                {
                    key: 'order_id',
                    label: 'S/WO#',
                    sortable: true
                },
                {
                    key: 'task_appointment_status',
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
                    key: 'order_priority',
                    label: 'Pri',
                    sortable: true
                },
                {
                    key: 'task_category',
                    label: 'Category',
                    sortable: true
                },
                {
                    key: 'task_status',
                    label: 'Status',
                    sortable: true
                },
                {
                    key: 'task_action',
                    label: 'Action',
                    sortable: true
                },
                {
                    key: 'day',
                    label: 'Day',
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
                    key: 'actions',
                    label: 'Actions'
                }
            ]
                
        }
    },
    created() {
        var params = '';
        if(this.order_status_type != null){
            params = '?order_status_type_id=' + this.order_status_type.id;
        }
        this.$http.get('/schedule' + params).then((results) => {
            this.tasks = results.data;
        });
    },
    methods: {
        info (item, index, button) {
            this.modalInfo.title = `Order# ${item.order_id}`
            this.modalInfo.order_id = item.order_id
            this.$root.$emit('bv::show::modal', 'modalInfo', button)
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
                time: item.time
            }
            if(item.id){
                this.$http.patch('/task_date/' + item.id, task_date);
            }
            else{
                this.$http.post('/task_date', task_date).then(response =>{
                    item.id = response.id;
                })
            }
            var task = {
                sort_order : item.sort_order,
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
        }
    }
}
</script>