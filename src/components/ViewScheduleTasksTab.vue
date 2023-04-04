<template>
    <div>
        <b-alert
            :show="sms_status_countdown"
            dismissible
            @dismissed="sms_status_countdown=0"
            @dismiss-count-down="countDownChanged"
        >
            {{ sms_status }}
        </b-alert>
            <b-container fluid>
                <b-row>
                    <b-col>
                        <b-form-group label="Crew">
                            <b-form-select
                                @change="filtersUpdated"
                                :options="crews"
                                value-field="id"
                                text-field="name"
                                v-model="filters.crew_id"
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
                    <b-col>
                       <br />
                       <b-button @click="getTasks()" style="margin-right:5px;">Refresh</b-button>
                       <b-button @click="filtersClear()">Clear Filters</b-button>
                    </b-col>
                </b-row>
            </b-container>
            <b-table
                small
                striped
                hover
                foot-clone
                responsive
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
                            <b-form-input type="text" @input="filtersUpdated" v-model="filters[field.key]" v-if="filters[field.key] !== undefined "></b-form-input>
                        </th>  
                    </tr>
                </template>
                <template v-slot:cell(service_window)="data">
                    <b-form-input
                        v-if="['On Hold','All'].filter(t => (t == tab)).length"
                        type="number"
                        @change="save(data.item)"
                        v-model="data.item.service_window"
                    >
                    </b-form-input>
                    <span v-else>{{data.value}}</span>
                </template>
                <template v-slot:cell(hold_date)="data">
                    <b-form-input
                        type="date"
                        @change="save(data.item)"
                        v-model="data.item.hold_date"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(start_date)="data">
                    <span
                        v-if="data.value != data.item.start_date"
                        v-b-popover.hover="data.item.order_date + ' ' + data.value" :id="'start_date_' + data.item.id"
                        style="color:purple"
                    >
                        {{ data.value }}
                    </span>
                    <span
                        v-else
                        v-b-popover.hover="data.item.order_date" :id="'start_date_' + data.item.id"
                    >
                        {{ data.value }}
                    </span>
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
                    <Treeselect style="width: 10rem" :options="labor_assignments" :normalizer="treeNormalizer" v-model="data.item.labor_assignment_id" @input="save(data.item)"/>
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
                <template v-slot:cell(crew)="data">
                    <b-form-select
                        :options="crews"
                        @input="save(data.item)"
                        value-field="id"
                        text-field="name"
                        v-model="data.item.crew_id"
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
                    <br />
                    <img src="../assets/clear.png" v-b-tooltip.hover title="Clear Scheduling Data" @click.stop="clearScheduleData(row.item)" fluid alt="CS" style="width:20px;" />
                    <img src="../assets/sms.png" v-b-tooltip.hover title="Send Text Message" @click.stop="showSMSModal(row.item)" fluid alt="CS" style="width:20px;" />
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
                    :labor_activities="labor_activities"
                >
                </ViewAppointment>
            </b-modal>
            <b-modal size="sm" scrollable ref="modalSMS" id="modalSMS" title="Send Text Message" @ok="sendSMS">
                <b-form>
                    <b-form-row>
                        <b-col>
                            <b-form-group label="Send Text To">
                                <b-form-radio-group
                                    v-model="sms.to"
                                    :options="sms_numbers"
                                    stacked
                                >
                                </b-form-radio-group>
                            </b-form-group>
                        </b-col>
                    </b-form-row>
                    <b-form-row>
                        <b-col>
                            <b-button v-b-modal.modalSMSMessages>Select Message</b-button>
                        </b-col>
                    </b-form-row>
                    <b-modal size="sm" scrollable ref="modalSMSMessages" id="modalSMSMessages" title="Select Message" :hide-footer="true">
                        <b-form-radio-group v-model="message_type_id" :options="filtered_message_types" value-field="id" text-field="name">
                        </b-form-radio-group>
                        <b-form-row v-for="message in filtered_sms_messages" :key="message.id" class="select-message" @click="selectMessage(message.id)">
                            <b-col>
                                {{ message.message}} 
                            </b-col>
                        </b-form-row>
                    </b-modal>
                    <b-form-row>
                        <b-col >
                            <b-form-group label="Message">
                                <b-form-textarea
                                    v-model="sms.message"
                                >                        
                                </b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-form-row>
                    <b-form-row>
                        <b-col>
                            <b-button @click="copyNumber()">Copy Number</b-button>
                            <b-button @click="copyMessage()">Copy Message</b-button>
                        </b-col>
                    </b-form-row>
                </b-form>
            </b-modal>
    </div>
</template>
<script>
import moment from 'moment';
import ViewAppointment from './ViewAppointment';
import sortingMixin from '../mixins/Sorting.js';
import filtersMixin from '../mixins/Filters.js';
import Treeselect from '@riophae/vue-treeselect';
import treeFilter from '../common/TreeFilter.js';
import treeNormalizer from '../common/TreeNormalizer.js';
import { mapState } from 'vuex';
export default {
    name: 'ViewScheduleTab',
    components: {
        ViewAppointment,
        Treeselect
    },
    mixins: [filtersMixin, sortingMixin],
    props: {
        tab: {required: true},
        task_actions: {required: true},
        labor_assignments: {required: true},
        task_statuses: {required: true},
        labor_types: {required: true},
        appointment_statuses: {required: true},
        labor_activities: { default: (() => ([]))}
    },
    data() {
        return {
            tasks: [],
            filtered_tasks: [],
            filter: null,
            modalInfo: { title: '', appointment_id: null, task_id: null, order_id: null },
            date: moment().format('YYYY-MM-DD'),
            crews: [],
            sortBy: 'date',
            view_days: 14,
            sms_status_countdown: 0,
            sms_status: 'N/A',
            sms_numbers: [],
            sms: {},
            fields: [
                {
                    key: 'start_date',
                    label: 'Start Date',
                    sortable: true,
                    formatter: 'startDateFormatter',
                    sortByFormatted : true
                },
                {
                    key: 'service_window',
                    label: 'SW',
                    sortable: true,
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
                },
                {
                    key: 'client',
                    label: 'Client',
                    sortable: true,
                },
                {
                    key: 'property',
                    label: 'Property',
                    sortable: true,
                },
                {
                    key: 'name',
                    label: 'Name',
                    sortable: true,
                },
                {
                    key: 'order_priority',
                    label: 'Pri',
                    sortable: true,
                },
                {
                    key: 'labor_assignment',
                    label: 'Assignment',
                    sortable: true,
                },
                {
                    key: 'day',
                    label: 'Day',
                    sortable: true,
                },
                {
                    key: 'date',
                    label: 'Date',
                    sortable: true,
                },
                {
                    key: 'sort_order',
                    label: 'Order',
                    sortable: true,
                },
                {
                    key: 'crew_hours',
                    label: 'Crew Hours',
                    sortable: true,
                },
                {
                    key: 'time',
                    label: 'Time',
                    sortable: true,
                },
                {
                    key: 'actions',
                    label: 'Actions',
                }
            ],
            sms_messages: [],       
            sms_task: {},
            sms_message_id: null,
            message_type_id: null,
            message_types: [],
            contacts: [],
        }        
    },
    created() {
        switch (this.tab){
             case 'All':
             case 'On Hold':
                this.fields = [
                {
                    key: 'start_date',
                    label: 'Start Date',
                    sortable: true,
                },
                {
                    key: 'service_window',
                    label: 'SW',
                    sortable: true,
                },
                {
                    key: 'hold_date',
                    label: 'Hold Date',
                    sortable: true,
                },
                {
                    key: 'order_name',
                    label: 'Work Order Name',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'client',
                    label: 'Client',
                    sortable: true,
                },
                {
                    key: 'property',
                    label: 'Property',
                    sortable: true,
                },
                {
                    key: 'name',
                    label: 'Name',
                    sortable: true,
                },
                {
                    key: 'labor_assignment',
                    label: 'Assignment',
                    sortable: true,
                },
                {
                    key: 'task_status',
                    label: 'Status',
                    sortable: true,
                },
                {
                    key: 'date',
                    label: 'Date',
                    sortable: true,
                },
                {
                    key: 'crew',
                    label: 'Crew',
                    sortable: true,
                },
                {
                    key: 'crew_hours',
                    label: 'Crew Hours',
                    sortable: true,
                },
                {
                    key: 'actions',
                    label: 'Actions',
                }
            ];
        }
        let filters = this.fields.map(f => (f.key));
        filters.pop();
        filters.push('crew_id');
        this.filtersInit('schedule ' + this.tab, filters);
        this.filters.crew_id='.*';
        this.$http.get('/crews').then(response => {
            this.crews = response.data;
            this.crews.unshift({id: '.*', name: 'All'});
            this.crews.unshift({id: '^$', name: 'None'});
        });
        this.$http.get('/sms_message_types').then(response => {
            this.message_types = response.data.data;
            this.message_type_id = this.default_message_type_id;
        });
        this.$http.get('/stock_text_messages').then(response => {
            this.sms_messages = response.data.data;
            this.sms_message_id = this.default_stock_text_message_id;
        });
        this.getTasks();
    },
    methods: {
        treeFilter,
        treeNormalizer,
        getTasks(){
            this.$http.get('/schedule?status=' + escape(this.tab) + '&date=' + this.date + '&view_days=' + this.view_days).then((results) => {
                if(['Pending', 'On Hold', 'All'].includes(this.tab)){
                    this.sortBy='start_date';
                }
                this.tasks = results.data;
                this.tasks.forEach((t) => {
                    t.sort_order_tmp = t.sort_order;
                    t.date_tmp = t.date;
                });
                this.filtersUpdated();
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
        info(item) {
            this.modalInfo.title = `${item.order_name} -- ${item.name}`;
            this.modalInfo.appointment_id = item.id;
            this.modalInfo.task_id = item.task_id;
            this.modalInfo.order_id = item.order_id;
            this.$refs['modalInfo'].show();
        },
        resetModal() {
            this.modalInfo.title = ''
            this.modalInfo.content = ''
            this.modalInfo.id = null
        },
        addTask(task){
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
        showSMSModal(task){
            this.sms_task = task;
            this.sms_numbers = [];
            this.sms = { to: null, message: null};
            this.selectMessage(this.sms_message_id);
            this.$http.get('/contacts?client_id=' + task.client_id).then(response => {
                this.contacts = response.data;
                this.contacts.forEach(contact => {
                    contact.phone_numbers.forEach(number => {
                        this.sms_numbers.push({
                            value: number.phone_number,
                            text: contact.name + " - " + number.phone_number_type.name + " - " + number.phone_number
                        });
                        if(!this.sms.to){
                            this.sms.to = number.phone_number;
                            this.replaceMessage()
                        }
                    });
                });
            });
            this.$refs['modalSMS'].show();
        },
        sendSMS(){
            let sms = this.sms;
            const regex = /\D/g;
            sms.to = sms.to.replace(regex,'');
            if(sms.to[0] != '1'){
                sms.to = '1' + sms.to;
            }
            this.$http.post('/did/send', this.sms).then(response => {
                this.sms_status = response.data.sms_status;
                this.sms_status_countdown = 5;
            });
        },
        selectMessage(message_id){
            let message = this.sms_messages.filter(m => m.id == message_id);
            if(message.length){
                this.sms_message_id = message_id;
                this.sms.message = message[0].message;
                this.replaceMessage()
                if(this.$refs['modalSMSMessages']){
                    this.$refs['modalSMSMessages'].hide();
                }
            }
        },
        replaceMessage(){
            if(!this.sms.message){
                return
            }
            for (const [key, value] of Object.entries(this.sms_task)) {
                let replace = value;
                if(replace){
                    switch(key){
                        case 'time':
                            replace = moment(this.sms_task.date+ ' ' + value).format('LT')
                            break;
                        case 'date':
                            replace = moment(value).format('ddd MM-DD')
                            break;
                            
                    }
                }
                else{
                    replace = 'N/A'
                }
                this.sms.message = this.sms.message.replace(`{${key}}`,replace);
            }
            let contacts = this.contacts.filter(c => c.phone_numbers.filter(n => n.phone_number == this.sms.to).length);
            if(contacts.length){
                const names = contacts[0].name.split(' ')
                this.sms.message = this.sms.message.replace(`{contact.name}`,names[0]);
            }
        },
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown;
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
                crew_hours: item.crew_hours,
                crew_id: item.crew_id,
                hold_date: item.hold_date
            
            }
            this.$http.patch('/task/' + item.task_id, task);
            var order = {
                service_window: item.service_window
            
            }
            this.$http.patch('/order/' + item.order_id, order);
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
        filtersUpdated(){
            this.filtered_tasks=this.filterColumns(this.tasks);
        },
        startDateFormatter(value, key, item){
            return item.hold_date ?? value;
        },
        copyNumber(){
            navigator.clipboard.writeText(this.sms.to);
        },
        copyMessage(){
            navigator.clipboard.writeText(this.sms.message);
        }
    },
    computed:{
        ...mapState({
          default_date_sms_message_type_id: state => state.settings.default_date_sms_message_type_id,
          default_nondate_sms_message_type_id: state => state.settings.default_nondate_sms_message_type_id,
        }),
        filtered_sms_messages(){
            return this.sms_messages.filter(m => m.message_type_id==this.message_type_id)
        },
        filtered_message_types(){
            const has_date = !!this.sms_task.date;
            return this.message_types.filter(m => m.uses_date==has_date)
        }
    },
    watch:{
        filtered_message_types(){
            const has_date = !!this.sms_task.date;
            this.message_type_id = has_date ? this.default_date_sms_message_type_id : this.default_nondate_sms_message_type_id;
        },
    }
}
</script>
<style>
    .select-message {
        padding:10px;
        border:1px solid black;
    }
    .select-message:hover {
        background-color: #999999;
        cursor: pointer;
    }
</style>