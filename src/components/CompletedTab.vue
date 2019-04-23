<template>
    <div>
            <b-container fluid>
                <b-row>
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
                primary-key="id"
                >
                <template slot="order_id" slot-scope="data">
                    <a :href="'/client/' + data.item.order.project.client_id + '/project/' + data.item.order.project_id + '/order/' + data.value"> {{ data.value }} </a>
                </template>
                <template slot="order.project.client.name" slot-scope="data">
                    <a href="/scheduler" @click.stop.prevent="info(data.item, data.index, $event.target)"> {{ data.value }} </a>
                </template>
                <template slot="property" slot-scope="data">
                    {{ data.item.order.properties[0].name }}
                </template>
                <template slot="name" slot-scope="data">
                    <span v-b-popover.hover="data.item.description" :id="'name_' + data.item.id">{{ data.value }}</span>
                </template>
                <template slot="hours" slot-scope="data">
                    {{ getTotalHours(data.item.dates) }}
                </template>
                <template slot="date" slot-scope="data">
                    <span :id="'dates_'+data.item.id">dates</span>
                     <b-popover
                       :target="'dates_'+data.item.id"
                       title="Dates"
                       triggers="hover"
                    >
                        <ul>
                            <li v-for="date in data.item.dates">
                                {{ date.date }}
                                <ul>
                                    <li v-for="sign_in in date.sign_ins">
                                        {{ sign_in.sign_in }} - {{ sign_in.sign_out }}
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </b-popover>
                </template>
                <template slot="completion_date" slot-scope="data">
                    <b-form-input
                        type="date"
                        @change="save(data.item)"
                        v-model="data.item.completion_date"
                    >
                    </b-form-input>
                </template>
                <template slot="billed_date" slot-scope="data">
                    <b-form-input
                        type="date"
                        @change="save(data.item)"
                        v-model="data.item.billed_date"
                    >
                    </b-form-input>
                </template>
                <template slot="closed_date" slot-scope="data">
                    <b-form-input
                        type="date"
                        @change="save(data.item)"
                        v-model="data.item.closed_date"
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
    name: 'CompletedTab',
    components: {
        'ViewOrder': ViewOrder
    },
    props: {

    },
    data() {
        return {
            tasks: [],
            filter: null,
            modalInfo: { title: '', content: '', order_id: null },
            fields: [
                {
                    key: 'order.start_date',
                    label: 'Start Date',
                    sortable: true
                },
                {
                    key: 'order.service_window',
                    label: 'Service Window',
                    sortable: true
                },
                {
                    key: 'order_id',
                    label: 'S/WO#',
                    sortable: true
                },
                {
                    key: 'order.project.client.name',
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
                    key: 'hours',
                    label: 'Total Hours',
                    sortable: true
                },
                {
                    key: 'date',
                    label: 'Date',
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
                },
                {
                    key: 'closed_date',
                    label: 'Closed',
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
        var min_closed_date = moment().subtract(7, 'days');
        this.$http.get('/tasks?completed=true&min_closed_date=' + min_closed_date.format('YYYY-MM-DD')).then((results) => {
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
            var task = {
                completion_date: item.completion_date,
                closed_date: item.closed_date,
                billed_date: item.billed_date,
            
            }
            this.$http.patch('/task/' + item.id, task);
        },
        rowClass(item){
            var today = moment();
            var window_date = moment(item.start_date).add(item.service_window,'days');
            var classes = [];
            if(window_date < today){
                classes.push('font-weight-bold');
            }
            if(item.task_type_id == 1){
                switch(item.order.order_status_type_id){
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
        getTotalHours(dates){
            var hours = 0;
            for(var date_count = 0; date_count < dates.length; date_count++ ){
                for(var sign_in_count = 0; sign_in_count < dates[date_count].sign_ins.length; sign_in_count++ ){
                    var sign_in = moment(dates[date_count].sign_ins[sign_in_count].sign_in);
                    var sign_out = moment(dates[date_count].sign_ins[sign_in_count].sign_out);
                    var diff = Math.round(sign_out.diff(sign_in)/36000)/100;
                    hours + diff;
                }
            }
            return hours;
        }
    }
}
</script>