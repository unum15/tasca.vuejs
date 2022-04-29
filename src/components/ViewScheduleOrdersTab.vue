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
                 <template #thead-top>
                    <tr>
                        <th v-for="field in fields" :key="field.key">
                            <b-form-input type="text" @input="filterColumns" v-model="field.filter" v-if="field.filter !== undefined "></b-form-input>
                        </th>  
                    </tr>
                </template>
                <template v-slot:cell(project)="data">
                    <a :href="'/client/' + data.item.project.client_id + '/project/' + data.item.project_id + '/order/' + data.item.id"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(property)="data">
                    {{ data.item.properties.length ? data.item.properties[0].name : '' }}
                </template>
                <template v-slot:cell(name)="data">
                    <a href="/scheduler" @click.stop.prevent="info(data.item, data.index, $event.target)"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(hours)="data">
                    {{ getTotalHours(data.item) }}
                </template>
                <template v-slot:cell(close_date)="data">
                    <b-form-input
                        type="date"
                        @change="save(data.item)"
                        v-model="data.item.close_date"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(actions)="row">
                    <img src="@/assets/details.png" v-b-tooltip.hover title="Show Tasks" @click.stop="row.toggleDetails" :pressed="row.detailsShowing" fluid alt="DTS" style="width:20px;" />
                    <img src="@/assets/checkmark.png" v-b-tooltip.hover title="Mark All Dates" @click="showMarkDates(row.item)" fluid alt="Dates" style="width:20px;" />
                  </template>
                  <template slot="row-details" slot-scope="row">
                    <ViewScheduleOrdersTabTasks :order="row.item" :tasks="row.item.tasks">
                    </ViewScheduleOrdersTabTasks>
                  </template>
            </b-table>
            <b-modal size="xl" scrollable ref="modalInfo" id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
                <ViewAppointment
                    v-if="modalInfo.order_id"
                    :order_id="modalInfo.order_id"
                    :task_id="modalInfo.task_id"
                >
                </ViewAppointment>
            </b-modal>
            <b-modal content-class="modal-date" ref="modalDate" title="Mark All Dates" @ok="markDates()">
                <b-calendar v-model='date_mark'></b-calendar>
            </b-modal>
    </div>
</template>
<script>
import moment from 'moment';
import ViewScheduleOrdersTabTasks from './ViewScheduleOrdersTabTasks';
import ViewAppointment from './ViewAppointment';
import { mapState } from 'vuex';
export default {
    name: 'ViewScheduleOrdersTab',
    components: {
        'ViewScheduleOrdersTabTasks': ViewScheduleOrdersTabTasks,
        'ViewAppointment': ViewAppointment
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
            date_order: {},
            date_mark: null,
            fields: [
                {
                    key: 'date',
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
                    key: 'close_date',
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
        this.$http.get('/orders?status=' + this.tab + '&includes=tasks,task.appointments,task.appointments.clock_ins,properties').then((results) => {
            this.orders = results.data;
            this.filtered_orders = this.orders;
        });
    },
    methods: {
        save(item){
            var order = {
                close_date: item.close_date,
            }
            this.$http.patch('/order/' + item.id, order);
        },
        markDates(){
            if(!this.date_order.tasks){
                return;
            }
            let all = true;
            let new_date = moment(this.date_mark);
            this.date_order.tasks.map(t => {
                if(t.completion_date){
                    t.invoiced_date = t.invoiced_date ? t.invoiced_date : new_date.format("YYYY-MM-DD");
                    t.billed_date = t.billed_date ? t.billed_date : new_date.format("YYYY-MM-DD");
                    t.closed_date = t.closed_date ? t.closed_date: new_date.format("YYYY-MM-DD");
                }
                else{
                    all = false;
                }
            });
            if(all){
                this.date_order.close_date = new_date.format("YYYY-MM-DD");
            }
            this.save(this.date_order);
        },
        getTotalHours(order){
            var time = 0;
            if(!order.tasks){
                return;
            }
            order.tasks.map(t => {
                t.appointments.map(d =>{
                    d.clock_ins.map(si =>{
                        var clock_in = moment(si.clock_in);
                        var clock_out = moment(si.clock_out);
                        time += clock_out.diff(clock_in);
                    });
                });
            });
            return Math.round(time/36000)/100;
        },
        filterColumns(store=true){
            this.filtered_orders = this.orders;
            let filters = {};
            for(var x = 0;x < this.fields.length; x++){
                filters[this.fields[x].key] = this.fields[x].filter;
                if(this.fields[x].filter){
                    var regex = new RegExp(this.fields[x].filter, "i");
                    this.filtered_orders = this.filtered_orders.filter(t => {
                        var value = t[this.fields[x].key]
                        if(!value){
                            value = "";
                        }
                        return value.match(regex) !== null
                    })
                }
            }
            if(store!==false){
                this.$store.dispatch('saveFilters',{filters,name:'current'});
                console.log(filters);
            }
        },
        clearFilters(){
            let filters = {};
            for(var x = 0;x < this.fields.length; x++){
                this.fields[x].filter = '';
                filters[this.fields[x].key] = this.fields[x].filter;
            }
            this.filterColumns(true);
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
        },
        showMarkDates(order){
            this.$refs['modalDate'].show();
            this.date_order = order;
        }
    },
    computed: {
        ...mapState({
            stored_filters: state => state.filters.current
        }),
    },
    watch: {
        stored_filters:{
            deep: true,
            handler(){
                for(var x = 0;x < this.fields.length; x++){
                    this.fields[x].filter = this.stored_filters[this.fields[x].key];
                }
                this.filterColumns(false);
            }
        }
    }
}
</script>
<style>
.modal-date{
    width: min-content !important;
    float: right;
}
</style>