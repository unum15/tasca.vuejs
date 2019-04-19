<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            {{ contact_name }}
        </head>
        <main>
            <h2>Assignments for {{ contact_name }}</h2>
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
                >
                <template slot="order_id" slot-scope="data">
                    <a :href="'/client/' + data.item.client_id + '/project/' + data.item.project_id + '/order/' + data.value"> {{ data.value }} </a>
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
            </b-table>
            <b-modal size="xl" scrollable id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
                <ViewTaskDate
                    v-if="modalInfo.id"
                    :task_date_id="modalInfo.id"
                >
                </ViewTaskDate>
            </b-modal>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
import ViewTaskDate from './ViewTaskDate';
import moment from 'moment'
export default {
    name: 'ViewAssignments',
    components: {
        'TopMenu': TopMenu,
        'ViewTaskDate': ViewTaskDate
    },
    data() {
        return {
            order_status_types: [],
            crews: [],
            contact_name: null,
            crew_id: null,
            tasks: [],
            text_filter: null,
            modalInfo: { title: '', content: '', id: null },
            date: null,
            fields: [
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
        this.getTasks();
        this.contact_name = localStorage.getItem('name');
    },
    methods: {
        getTasks(){
            this.$http.get('/schedule?date='+this.date).then((results) => {
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
        info(item, index, button) {
            this.modalInfo.title = `Order# ${item.order_id}`
            this.modalInfo.id = item.id
            this.$root.$emit('bv::show::modal', 'modalInfo', button)
        },
        resetModal() {
            this.modalInfo.title = ''
            this.modalInfo.content = ''
            this.modalInfo.id = null
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
        }
    },
    computed:{
        filter(){
            //we should return null when no filter is set
            return {
                text_filter: this.text_filter,
                crew_id: this.crew_id
            };
        }
    }
}
</script>