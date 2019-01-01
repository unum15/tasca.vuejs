<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Scheduler
        </head>
        <main>
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
            </b-container fluid>
            <b-table
                small
                striped
                hover
                foot-clone
                :items="tasks"
                :fields="fields"
                :filter="filter"
                >
                <template slot="order_id" slot-scope="data">
                    <a :href="'#/client/'+ data.item.order.project.property.client_id + '/order/' + data.value"> {{ data.value }} </a>
                </template>
                <template slot="order.project.property.client.name" slot-scope="data">
                    <a href="/#/scheduler" @click.stop="info(data.item, data.index, $event.target)"> {{ data.value }} </a>
                </template>
                <template slot="task_appointment_status.name" slot-scope="data">
                    <b-form-select
                        :options="task_appointment_statuses"
						@input="save(data.item)"
                        value-field="id"
                        text-field="name"
                        v-model="data.item.task_appointment_status_id"
                        >
                    </b-form-select>
                </template>
                <template slot="task_category.name" slot-scope="data">
                    <b-form-select
                        :options="task_categories"
						@input="save(data.item)"
                        value-field="id"
                        text-field="name"
                        v-model="data.item.task_category_id"
                        >
                    </b-form-select>
                </template>
                <template slot="task_status.name" slot-scope="data">
                    <b-form-select
                        :options="task_statuses"
						@input="save(data.item)"
                        value-field="id"
                        text-field="name"
                        v-model="data.item.task_status_id"
                        >
                    </b-form-select>
                </template>
                <template slot="task_action.name" slot-scope="data">
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
                    <b-form-select
                        :options="task_sort_options"
						@input="save(data.item)"
                        v-model="data.item.sort_order"
                        >
                    </b-form-select>
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
            <b-modal id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
                <ViewOrder
                    v-if="modalInfo.order_id"
                    :order_id="modalInfo.order_id"
                >
                </ViewOrder>
            </b-modal>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
import ViewOrder from './ViewOrder';
export default {
    name: 'ViewSchedule',
    components: {
        'TopMenu': TopMenu,
        'ViewOrder': ViewOrder
    },
    data() {
        return {
            tasks: [],
            task_categories: [],
			task_statuses: [],
            task_appointment_statuses: [],
			task_actions: [],
            filter: null,
            modalInfo: { title: '', content: '', order_id: null },
            fields: [
                {
                    key: 'order.approval_date',
                    label: 'App Date',
                    sortable: true
                },
                {
                    key: 'order_id',
                    label: 'S/WO#',
                    sortable: true
                },
                {
                    key: 'task_appointment_status.name',
                    label: 'C',
                    sortable: true
                },
                {
                    key: 'order.project.property.client.name',
                    label: 'Client',
                    sortable: true
                },
                {
                    key: 'order.project.property.name',
                    label: 'Property',
                    sortable: true
                },
                {
                    key: 'description',
                    label: 'Description',
                    sortable: true
                },
                {
                    key: 'order.order_priority.name',
                    label: 'Pri',
                    sortable: true
                },
                {
                    key: 'task_category.name',
                    label: 'Category',
                    sortable: true
                },
                {
                    key: 'task_status.name',
                    label: 'Status',
                    sortable: true
                },
                {
                    key: 'task_action.name',
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
        this.$http.get('/task_appointment_statuses').then(response => {
			this.task_appointment_statuses = response.data;
		});
        this.$http.get('/task_categories').then(response => {
			this.task_categories = response.data;
		});
		this.$http.get('/task_statuses').then(response => {
			this.task_statuses = response.data;
		});
		this.$http.get('/task_actions').then(response => {
			this.task_actions = response.data;
		});
        this.$http.get('/tasks?active_only=true').then((results) => {
            this.tasks = results.data;
        });
    },
    methods: {
        info (item, index, button) {
            this.modalInfo.title = `Order# ${item.order.id}`
            this.modalInfo.content = JSON.stringify(item, null, 2)
            console.log(this.modalInfo.order_id);
            this.modalInfo.order_id = item.order.id
            console.log(item.order.id);
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
            task.sort_order = null;
            this.save(task);
        },
        save(task){
            this.$http.patch('/task/' + task.id, task);
        }
    },
    computed: {
		task_sort_options() {
			// Chrome can't handle this yet
			//return [for (i of Array(100).keys()) i+1];
			var options = Array();
			for(var x=1;x<=100;x++){
				options.push(x);
			}
			return options;
		},
    }
}
</script>