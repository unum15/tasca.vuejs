<template>
    <div>
        <b-container style="padding-left:0px;">
            <b-row>
                <b-col class="label">Project</b-col>
                <b-col class="data" cols="3">{{ task_date.task.order.project.name }} </b-col>
                <b-col class="label">Client</b-col>
                <b-col class="data" cols="2">{{ task_date.task.order.project.client.name }}</b-col>
                <b-col class="label">Order#</b-col>
                <b-col class="data" cols="2">{{ task_date.task.order.id }}</b-col>
            </b-row>
            <b-row>
                <b-col class="data">{{ task_date.task.order.project.notes }}</b-col>
            </b-row>
            <b-row>
                <b-col class="label">Order</b-col>
                <b-col class="data" cols="2">{{ task_date.task.order.name }}</b-col>
                <b-col class="label" cols="2">Start Date</b-col>
                <b-col class="data" cols="2">{{ task_date.task.order.start_date }}</b-col>
            </b-row>
            <b-row>
                <b-col class="data">{{ task_date.task.order.description }}</b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-container style="padding-left:0px;">
                        <b-row>
                            <b-col class="label">Property</b-col>
                            <b-col class="data" cols="10">
                                <a :href="'http://maps.google.com/maps?q=' + task_date.task.order.property.address1 + '+' + (task_date.task.order.property.address2 ? task_date.task.order.property.address2 + '+' : '') + task_date.task.order.property.city + '+' + task_date.task.order.property.state + '+' + task_date.task.order.property.zip" target="tasca_address">
                                    {{ task_date.task.order.property.name }}<br />
                                    {{ task_date.task.order.property.address1 }}<br />
                                    {{ task_date.task.order.property.address2 }}<br v-if="task_date.task.order.property.address2" />
                                    {{ task_date.task.order.property.unit }}<br v-if="task_date.task.order.property.unit" />
                                    {{ task_date.task.order.property.city }},{{ task_date.task.order.property.state }} {{ task_date.task.order.property.zip }}
                                    <b-col class="data"><a :href="'tel:' + task_date.task.order.property.phone_number">{{ task_date.task.order.property.phone_number }}</a></b-col>
                                </a>
                            </b-col>
                        </b-row>
                        <div v-for="contact in task_date.task.order.property.contacts" :key="contact.id">
                            <b-row>
                                <b-col class="label">Contact</b-col>
                                <b-col class="data" cols="10">{{ contact.name }}</b-col>
                            </b-row>
                            <b-row v-for="phone_number in contact.phone_numbers" :key="phone_number.id">
                                <b-col class="label">{{ phone_number.phone_number_type.name }}</b-col>
                                <b-col class="data" cols="10"><a :href="'tel:' + phone_number.phone_number">{{ phone_number.phone_number }}</a></b-col>
                            </b-row>
                            <b-row v-for="email in contact.emails" :key="email.id">
                                <b-col class="label">{{ email.email_type.name }}</b-col>
                                <b-col class="data" cols="10"><a :href="'mailto:' + email.email">{{ email.email }}</a></b-col>
                            </b-row>
                        </div>
                    </b-container>
                </b-col>
                <b-col>
                    <b-container>
                        <b-row>
                            <b-col class="label">Location</b-col>
                            <b-col class="data" cols="10">{{ task_date.task.order.location }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Instructions</b-col>
                            <b-col class="data" cols="10">{{ task_date.task.order.instructions }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Notes</b-col>
                            <b-col class="data" cols="10">{{ task_date.task.order.notes }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Budget</b-col>
                            <b-col class="data" cols="10">{{ task_date.task.order.budget }}+/-{{ task_date.task.order.budget_plus_minus }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Bid</b-col>
                            <b-col class="data" cols="10">{{ task_date.task.order.bid }}+/-{{ task_date.task.order.bid_plus_minus }}</b-col>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
        </b-container>
        <ViewHours :id="task_date.task.order.id" type="order" v-if="task_date.task.order.id">
        </ViewHours>
        <b-container>
            <b-row>
                <b-col>
                    <b-tabs :key="tasks.length">
                        <b-tab v-for="task in tasks" :key="'task_' + task.id" :title="task.name" :active="task.id == task_date.task_id">
                            <b-container>
                                <ViewTaskHours :task_id="task.id" :task_date_id="task.id == task_date.task_id ? task_date.id : null">
                                </ViewTaskHours>
                            </b-container>
                        </b-tab>
                    </b-tabs>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>
import moment from 'moment';
import ViewTaskHours from './ViewTaskHours'
import ViewHours from './ViewHours'
export default {
    name: 'ViewTaskDate',
    components: {
        'ViewTaskHours': ViewTaskHours,
        'ViewHours': ViewHours,
    },
    props: {
        task_date_id : { required:true }
    },
    data() {
        return {
            task_date: {
                task: {
                    order: {
                        id: null,
                        project: {
                            client: {
                                name : null
                            },
                            contact: {
                                name: null
                            }
                        },
                        property: {
                            
                        }
                    }
                }
            },
            sign_ins: [],
            billed: false,
            invoiced: false,
            completed: false,
            tasks: []
        };
    },
    created() {
        this.getTaskDate();
    },
    methods: {
        getTaskDate() {
            this.$http.get('/task_date/' + this.task_date_id).then((results) => {
                this.task_date = results.data;
                //only show first property information
                this.task_date.task.order.property = this.task_date.task.order.properties[0];
                this.completed = this.task_date.task.completion_date != null;
                this.invoiced = this.task_date.task.invoiced_date != null;
                this.billed = this.task_date.task.billed_date != null;
                this.getSignIns();
                this.getTasks();
            });
        },
        getTasks() {
            this.$http.get('/tasks?order_id=' + this.task_date.task.order_id).then((results) => {
                this.tasks = results.data;
            });
        },
        getSignIns() {
            this.$http.get('/sign_ins?task_date_id=' + this.task_date_id).then((results) => {
                this.sign_ins = results.data;
            });
        },
        timeDiff(start_time, stop_time){
            var start = moment(start_time)
            var stop = moment();
            if(stop_time){
                stop = moment(stop_time)
            }
            var diff = Math.round(stop.diff(start)/36000)/100
            
            return diff
        },
        formatTime(time){
            if(time){
                return moment(time).format('MM-DD hh:mm A')
            }
            return "";
        },
    },
    watch: {
        task_date_id() {
            this.getTaskDate();
        }
    }
}
</script>
<style scoped>
.label {
    text-align: right;
    font-weight: bold;
    text-align: left;
}

.header {
    font-weight: bold;
}

.data {
    text-align: left;
}
</style>