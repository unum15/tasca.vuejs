<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Tasks
        </head>
        <main>
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
                :filter="filter"
                :items="tasks"
                :fields="fields"
            >
                <template slot="order.id" slot-scope="data">
                    <a :href="'/client/' + data.item.order.project.client_id + '/project/' + data.item.order.project_id + '/order/' + data.value" v-if="data.item.order.project"> {{ data.value }} </a>
                </template>
                <template slot="order.project.client.name" slot-scope="data">
                    <a href="/scheduler" @click.stop.prevent="info(data.item, data.index, $event.target)"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(name)="data">
                    <span v-b-popover.hover="data.item.description" :id="'name_' + data.item.id">{{ data.value }}</span>
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
                <template slot="crew.name" slot-scope="data">
                    <b-form-select
                        :options="crews"
						@input="save(data.item)"
                        value-field="id"
                        text-field="name"
                        v-model="data.item.crew_id"
                        >
                    </b-form-select>
                </template>
                <template v-slot:cell(task_hours)="data">
                    <b-form-input
						@change="save(data.item)"
                        v-model="data.item.task_hours"
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
                <template v-slot:cell(dates)="data">
                    <span v-b-popover.hover="formatDates(data.value)">
                        {{ data.value.length }}
                    </span>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewTasks',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            tasks: [],
            filter: null,
            task_actions: [],
            task_categories: [],
            task_statuses: [],
            crews: [],
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
                    key: 'order.id',
                    label: 'S/WO#',
                    sortable: true
                },
                {
                    key: 'order.project.client.name',
                    label: 'Client Name',
                    sortable: true
                },
                {
                    key: 'order.properties[0].name',
                    label: 'Property Name',
                    sortable: true
                },
                {
                    key: 'name',
                    label: 'Name',
                    sortable: true
                },
                {
                    key: 'task_category.name',
                    label: 'Task Category',
                    sortable: true
                },
                {
                    key: 'task_status.name',
                    label: 'Task Status',
                    sortable: true
                },
                {
                    key: 'task_action.name',
                    label: 'Task Action',
                    sortable: true
                },
                {
                    key: 'task_hours',
                    label: 'Task Hours',
                    sortable: true
                },
                {
                    key: 'crew.name',
                    label: 'Crew',
                    sortable: true
                },
                {
                    key: 'crew_hours',
                    label: 'Crew Hours',
                    sortable: true
                },
                {
                    key: 'dates',
                    label: 'Dates',
                    sortable: true
                }
            ]
        }
    },
    created() {
        this.$http.get('/task_categories').then(response => {
			this.task_categories = response.data;
		});
		this.$http.get('/task_statuses').then(response => {
			this.task_statuses = response.data;
		});
		this.$http.get('/task_actions').then(response => {
			this.task_actions = response.data;
		});
        this.$http.get('/crews').then(response => {
			this.crews = response.data;
		});
        this.$http.get('/tasks?active_only=true').then((results) => {
            this.tasks = results.data;
        });
    },
    methods: {
        save(item){
            this.$http.patch('/task/' + item.id, item);
        },
        formatDates(dates){
            var dates_str = "";
            for(var x = 0; x <= dates.length; x++){
                if((dates[x]) && (dates[x].date)){
                    dates_str += dates[x].date + " ";
                }
            }
            return dates_str;
        }
    }
}
</script>