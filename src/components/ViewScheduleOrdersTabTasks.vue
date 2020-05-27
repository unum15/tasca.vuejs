<template>
    <b-table
        small
        striped
        hover
        :items="filtered_tasks"
        :fields="fields"
        :filter="filter"
        :sort-compare="sortCompare"
        :sort-by.sync="sortBy"
    >
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
            {{ getTotalHours(data.item.dates) }}
        </template>
    </b-table>
</template>
<script>
import moment from 'moment';
export default {
    name: 'ViewScheduleOrdersTabTasks',
    props: {
        tasks: {required: true}
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
                    key: 'completion_date',
                    label: 'Completion Date',
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
        sortCompare(a, b, key) {
            switch(key){
                case 'time':
                case 'date':
                    var value = 0;
                    if(a.date && b.date){
                        var first_date = moment(a.date);
                        var second_date = moment(b.date);
                        value = first_date.diff(second_date, 'days');
                    }
                    else{
                        if(a.date){
                            value = 1;
                        }
                        else{
                            if(b.date){
                                value = -1;
                            }
                        }
                    }
                    if(value == 0){
                        value = this.sortCompare(a, b, 'sort_order');
                        if(value == 0){
                            if(a.time == b.time){
                                return this.sortCompare(a, b, 'start_date');
                            }
                            else{
                                return a.time < b.time;
                            }
                        }
                        else{
                            return value;
                        }
                    }
                    else{
                        return value;
                    }
                default:
                    if (typeof a[key] === 'number' && typeof b[key] === 'number') {
                      return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
                    } else {
                      return this.toString(a[key]).localeCompare(this.toString(b[key]), undefined, {
                        numeric: true
                      })
                    }
            }
        },
        filterColumns(){
            this.filtered_tasks = this.tasks;
            for(var x = 0;x < this.fields.length; x++){
                if(this.fields[x].filter){
                    var regex = new RegExp(this.fields[x].filter, "i");
                    this.filtered_tasks = this.filtered_tasks.filter(t => {
                        var value = t[this.fields[x].key]
                        if(!value){
                            value = "";
                        }
                        return value.match(regex) !== null
                    })
                }
            }
        },
        getTotalHours(dates){
            var time = 0;
            dates.map(d =>{
                d.sign_ins.map(si =>{
                    var sign_in = moment(si.sign_in);
                    var sign_out = moment(si.sign_out);
                    time += Math.round(sign_out.diff(sign_in)/36000);
                });
            });
            return Math.round(time/3600000,2);
        }
    },
    computed: {
        filtered_tasks (){
            return this.tasks;
        }
    }
}
</script>
