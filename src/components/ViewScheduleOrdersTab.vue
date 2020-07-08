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
                :items="filtered_orders"
                :fields="fields"
                :filter="filter"
                primary-key="id"
                style="text-align:left;"
                >
                <template slot="thead-top" slot-scope="data">
                    <tr>
                        <th v-for="field in fields" :key="field.key">
                            <b-form-input type="text" @input="filterColumns" v-model="field.filter" v-if="field.filter !== undefined "></b-form-input>
                        </th>  
                    </tr>
                </template>
                <template v-slot:cell(project.client.name)="data">
                    <a href="/scheduler" @click.stop.prevent="info(data.item, data.index, $event.target)"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(property)="data">
                    {{ data.item.properties[0].name }}
                </template>
                <template v-slot:cell(name)="data">
                    <a :href="'/client/' + data.item.project.client_id + '/project/' + data.item.project_id + '/order/' + data.item.id"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(hours)="data">
                    {{ getTotalHours(data.item) }}
                </template>
                <template v-slot:cell(completion_date)="data">
                    <b-form-input
                        type="date"
                        @change="save(data.item)"
                        v-model="data.item.completion_date"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(actions)="row">
                    <img src="@/assets/details.png" v-b-tooltip.hover title="Show Tasks" @click.stop="row.toggleDetails" :pressed="row.detailsShowing" fluid alt="DTS" style="width:20px;" />
                  </template>
                  <template slot="row-details" slot-scope="row">
                    <ViewScheduleOrdersTabTasks :tasks="row.item.tasks">
                    </ViewScheduleOrdersTabTasks>
                  </template>
            </b-table>
            <b-modal size="xl" scrollable ref="modalInfo" id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
                <ViewScheduleOrderPopup
                    v-if="modalInfo.order_id"
                    :order_id="modalInfo.order_id"
                    :task_id="modalInfo.task_id"
                >
                </ViewScheduleOrderPopup>
            </b-modal>
    </div>
</template>
<script>
import moment from 'moment';
import ViewScheduleOrdersTabTasks from './ViewScheduleOrdersTabTasks';
import ViewScheduleOrderPopup from './ViewScheduleOrderPopup';
export default {
    name: 'ViewScheduleOrdersTab',
    components: {
        'ViewScheduleOrdersTabTasks': ViewScheduleOrdersTabTasks,
        'ViewScheduleOrderPopup': ViewScheduleOrderPopup
    },
    props: {
        tab: { required: true}
    },
    data() {
        return {
            orders: [],
            filtered_orders: [],
            filter: null,
            modalInfo: { title: '', content: '', order_id: null, task_id: null },
            fields: [
                {
                    key: 'project.open_date',
                    label: 'Open Date',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'approval_date',
                    label: 'Approval Date',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'start_date',
                    label: 'Start Date',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'hours',
                    label: 'Total Hours',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'project.client.name',
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
                    key: 'description',
                    label: 'Description',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'completion_date',
                    label: 'Closed',
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
        this.$http.get('/orders?status=' + this.tab + '&includes=tasks,task.task_dates,task.task_dates.sign_ins,properties').then((results) => {
            this.orders = results.data;
            this.filtered_orders = this.orders;
        });
    },
    methods: {
        save(item){
            var order = {
                completion_date: item.completion_date,
            }
            this.$http.patch('/order/' + item.id, order);
        },
        getTotalHours(order){
            var time = 0;
            if(!order.tasks){
                return;
            }
            order.tasks.map(t => {
                t.dates.map(d =>{
                    d.sign_ins.map(si =>{
                        var sign_in = moment(si.sign_in);
                        var sign_out = moment(si.sign_out);
                        time += sign_out.diff(sign_in);
                    });
                });
            });
            return Math.round(time/36000)/100;
        },
        filterColumns(){
            this.filtered_orders = this.orders;
            for(var x = 0;x < this.fields.length; x++){
                if(this.fields[x].filter){
                    var regex = new RegExp(this.fields[x].filter, "i");
                    this.filtered_orders = this.filtered_orders.filter(t => {
                        var keys = this.fields[x].key.split('.');
                        var value = t;
                        for(var key_num = 0; key_num < keys.length; key_num++){
                            if(value){
                                value = value[keys[key_num]];
                            }
                        }
                        if(!value){
                            value = "";
                        }
                        return value.match(regex) !== null
                    })
                }
            }
        },
        info (item) {
            this.modalInfo.title = `Order #${item.id} - ${item.name}`
            this.modalInfo.order_id = item.id
            this.$refs['modalInfo'].show()
        },
        resetModal () {
            this.modalInfo.title = ''
            this.modalInfo.content = ''
            this.modalInfo.order_id = null
        }
    }
}
</script>
