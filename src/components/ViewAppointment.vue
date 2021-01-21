<template>
    <div>
        <b-container style="padding-left:0px;">
            <b-row>
                <b-col class="label">Project</b-col>
                <b-col class="data" cols="3">{{ appointment.task.order.project.name }} </b-col>
                <b-col class="label">Client</b-col>
                <b-col class="data" cols="2">{{ appointment.task.order.project.client.name }}</b-col>
                <b-col class="label">Order#</b-col>
                <b-col class="data" cols="2">{{ appointment.task.order.id }}</b-col>
            </b-row>
            <b-row>
                <b-col class="data">{{ appointment.task.order.project.notes }}</b-col>
            </b-row>
            <b-row>
                <b-col class="label">Order</b-col>
                <b-col class="data" cols="2">{{ appointment.task.order.name }}</b-col>
                <b-col class="label" cols="2">Start Date</b-col>
                <b-col class="data" cols="2">{{ appointment.task.order.start_date }}</b-col>
            </b-row>
            <b-row>
                <b-col class="data">{{ appointment.task.order.description }}</b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-container style="padding-left:0px;">
                        <b-row>
                            <b-col class="label">Property</b-col>
                            <b-col class="data" cols="10">
                                <a :href="'http://maps.google.com/maps?q=' + appointment.task.order.property.address1 + '+' + (appointment.task.order.property.address2 ? appointment.task.order.property.address2 + '+' : '') + appointment.task.order.property.city + '+' + appointment.task.order.property.state + '+' + appointment.task.order.property.zip" target="tasca_address">
                                    {{ appointment.task.order.property.name }}<br />
                                    {{ appointment.task.order.property.address1 }}<br />
                                    {{ appointment.task.order.property.address2 }}<br v-if="appointment.task.order.property.address2" />
                                    {{ appointment.task.order.property.unit }}<br v-if="appointment.task.order.property.unit" />
                                    {{ appointment.task.order.property.city }},{{ appointment.task.order.property.state }} {{ appointment.task.order.property.zip }}
                                    <b-col class="data"><a :href="'tel:' + appointment.task.order.property.phone_number">{{ appointment.task.order.property.phone_number }}</a></b-col>
                                </a>
                            </b-col>
                        </b-row>
                        <div v-for="contact in appointment.task.order.property.contacts" :key="contact.id">
                            <b-row v-b-popover.hover.top="contact.notes">
                                <b-col class="label">Contact</b-col>
                                <b-col class="data" cols="10">{{ contact.name }} - {{ getContactType(appointment.task.order.project.client.id, contact) }}</b-col>
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
                            <b-col class="data" cols="10">{{ appointment.task.order.location }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Instructions</b-col>
                            <b-col class="data" cols="10">{{ appointment.task.order.instructions }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Notes</b-col>
                            <b-col class="data" cols="10">{{ appointment.task.order.notes }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Budget</b-col>
                            <b-col class="data" cols="10">{{ appointment.task.order.budget }}+/-{{ appointment.task.order.budget_plus_minus }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Bid</b-col>
                            <b-col class="data" cols="10">{{ appointment.task.order.bid }}+/-{{ appointment.task.order.bid_plus_minus }}</b-col>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
        </b-container>
        <ViewHours :id="appointment.task.order.id" type="order" v-if="appointment.task.order.id">
        </ViewHours>
        <b-container>
            <b-row>
                <b-col>
                    <b-tabs :key="tasks.length">
                        <b-tab v-for="task in tasks" :key="'task_' + task.id" :title="task.name" :active="task.id == appointment.task_id">
                            <b-container>
                                <ViewTaskHours :task_id="task.id" :appointment_id="task.id == appointment.task_id ? appointment.id : null" :labor_activities="labor_activities">
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
        appointment_id : { required:true },
        labor_activities: { default: [] }
    },
    data() {
        return {
            appointment: {
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
            clock_ins: [],
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
            this.$http.get('/appointment/' + this.appointment_id).then((results) => {
                this.appointment = results.data;
                //only show first property information
                this.appointment.task.order.property = this.appointment.task.order.properties[0];
                this.completed = this.appointment.task.completion_date != null;
                this.invoiced = this.appointment.task.invoiced_date != null;
                this.billed = this.appointment.task.billed_date != null;
                this.getClockIns();
                this.getTasks();
            });
        },
        getTasks() {
            this.$http.get('/tasks?order_id=' + this.appointment.task.order_id).then((results) => {
                this.tasks = results.data;
            });
        },
        getClockIns() {
            this.$http.get('/clock_ins?appointment_id=' + this.appointment_id).then((results) => {
                this.clock_ins = results.data;
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
        getContactType(client_id, contact){
            let type = contact.client_contact_types.map(t => {
                if (t.client_id === client_id ){
                    return t.contact_type.name;
                }
            });
            return type[0];
        }
    },
    watch: {
        appointment_id() {
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