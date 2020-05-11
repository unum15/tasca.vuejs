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
                >
                <template slot="thead-top" slot-scope="data">
                    <tr>
                        <th v-for="field in fields" :key="field.key">
                            <b-form-input type="text" @input="filterColumns" v-model="field.filter" v-if="field.filter !== undefined "></b-form-input>
                        </th>  
                    </tr>
                </template>
                <template v-slot:cell(id)="data">
                    <a :href="'/client/' + data.item.project.client_id + '/project/' + data.item.project_id + '/order/' + data.value"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(project.client.name)="data">
                    <a href="/scheduler" @click.stop.prevent="info(data.item, data.index, $event.target)"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(property)="data">
                    {{ data.item.properties.length ? data.item.properties[0].name : ''}}
                </template>
                <template v-slot:cell(name)="data">
                    <span v-b-popover.hover="data.item.description" :id="'name_' + data.item.id">{{ data.value }}</span>
                </template>
                <template v-slot:cell(hours)="data">
                    {{ getTotalHours(data.item) }}
                </template>
                <template v-slot:cell(date)="data">
                    <span :id="'dates_'+data.item.id">dates</span>
                     <b-popover
                       :target="'dates_'+data.item.id"
                       title="Dates"
                       triggers="hover"
                    >
                        <ul>
                            <ul v-for="task in data.item.tasks" :key="task.id" >
                                <li v-for="date in task.dates" :key="date.id" >
                                    {{ date.date }}
                                    <ul>
                                        <li v-for="sign_in in date.sign_ins" :key="sign_in.id">
                                            {{ sign_in.sign_in }} - {{ sign_in.sign_out }}
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </ul>
                    </b-popover>
                </template>
                <template v-slot:cell(completion_date)="data">
                    <b-form-input
                        type="date"
                        @change="save(data.item)"
                        v-model="data.item.completion_date"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(billed_date)="data">
                    <b-form-input
                        type="date"
                        @change="save(data.item)"
                        v-model="data.item.billed_date"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(closed_date)="data">
                    <b-form-input
                        type="date"
                        @change="save(data.item)"
                        v-model="data.item.closed_date"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(actions)="row">
                    <img src="@/assets/details.png" v-b-tooltip.hover title="Show Tasks" @click.stop="row.toggleDetails" :pressed="row.detailsShowing" fluid alt="DTS" style="width:20px;" />
                  </template>
                  <template slot="row-details" slot-scope="row">
                    <b-card>
                      <ul>
                        <li v-for="(task, id) in row.item.tasks" :key="id">{{ task.name }} - {{ task.completion_date ? 'Completed:' + task.completion_date : task.dates.length & task.dates[0].date  ? 'Scheduled:' + task.dates[0].date : 'Unscheduled'}}</li>
                      </ul>
                    </b-card>
                  </template>
            </b-table>
        
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: 'OrderScheduleTab',
    props: {
        tab: { required: true}
    },
    data() {
        return {
            orders: [],
            filtered_orders: [],
            filter: null,
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
                    key: 'id',
                    label: 'S/WO#',
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
                    key: 'hours',
                    label: 'Total Hours',
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
                    key: 'completion_date',
                    label: 'Completed',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'billed_date',
                    label: 'Billed',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'closed_date',
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
            var task = {
                completion_date: item.completion_date,
                closed_date: item.closed_date,
                billed_date: item.billed_date,
            
            }
            this.$http.patch('/task/' + item.id, task);
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
        }
    }
}
</script>
