f<template>
    <b-table
        small
        striped
        hover
        :items="tasks"
        :fields="fields"
        :filter="filter"
        :sort-compare="sortCompare"
        :sort-by.sync="sortBy"
        class="task-tab"
    >
        <template v-slot:cell(name)="data">
            <a :href="'/client/' + order.project.client_id + '/project/' + order.project_id + '/order/' + data.item.order_id + '/task/' + data.item.id"> {{ data.value }} </a>
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
        <template v-slot:cell(invoiced_date)="data">
            <b-form-input
                type="date"
                @change="save(data.item)"
                v-model="data.item.invoiced_date"
            >
            </b-form-input>
        </template>
        <template v-slot:cell(total_hours)="data">
            {{ getTotalHours(data.item.appointments) }}
        </template>
    </b-table>
</template>
<script>
import moment from 'moment';
export default {
    name: 'ViewScheduleOrdersTabTasks',
    props: {
        tasks: {required: true},
        order: {required: true}
    },
    data() {
        return {
            filter: null,
            sortBy: 'date',
            fields: [
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
                    key: 'total_hours',
                    label: 'Total Hours',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'completion_date',
                    label: 'Completion Date',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'invoiced_date',
                    label: 'Invoiced Date',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'billed_date',
                    label: 'Billing Date',
                    sortable: true,
                    filter: null
                },
                {
                    key: 'closed_date',
                    label: 'Closed Date',
                    sortable: true,
                    filter: null
                }
            ]
        }
    },
    created() {
    },
    methods: {
        save(item){
            var task = {
                completion_date: item.completion_date,
                invoiced_date: item.invoiced_date,
                billed_date: item.billed_date,
                closed_date: item.closed_date
            }
            this.$http.patch('/task/' + item.id, task);
        },
        getTotalHours(dates){
            var time = 0;
            dates.map(d =>{
                d.clock_ins.map(si =>{
                    var clock_in = moment(si.clock_in);
                    var clock_out = moment(si.clock_out);
                    time += Math.round(clock_out.diff(clock_in));
                });
            });
            return Math.round(time/36000)/100;
        }
    },
}
</script>
<style>
.task-tab th {
    background-color:#0000FF;
    color:#FFFFFF;
}
.task-tab td {
    background-color:#55AAFF;
}
</style>
