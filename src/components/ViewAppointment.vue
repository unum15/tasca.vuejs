<template>
    <div>
        <b-container style="padding-left:0px;">
            <b-row>
                <b-col class="label">Project</b-col>
                <b-col class="data" cols="3">{{ order.project.name }} </b-col>
                <b-col class="label">Client</b-col>
                <b-col class="data" cols="2">{{ order.project.client.name }}</b-col>
                <b-col class="label">Order#</b-col>
                <b-col class="data" cols="2">{{ order.id }}</b-col>
            </b-row>
            <b-row>
                <b-col class="data">{{ order.project.notes }}</b-col>
            </b-row>
            <b-row>
                <b-col class="label">Order</b-col>
                <b-col class="data" cols="2">{{ order.name }}</b-col>
                <b-col class="label" cols="2">Start Date</b-col>
                <b-col class="data" cols="2">{{ order.start_date }}</b-col>
            </b-row>
            <b-row>
                <b-col class="data">{{ order.description }}</b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-container style="padding-left:0px;">
                        <b-row>
                            <b-col class="label">Property</b-col>
                            <b-col class="data" cols="10">
                                <a :href="'http://maps.google.com/maps?q=' + order.property.address1 + '+' + (order.property.address2 ? order.property.address2 + '+' : '') + order.property.city + '+' + order.property.state + '+' + order.property.zip" target="tasca_address">
                                    {{ order.property.name }}<br />
                                    {{ order.property.address1 }}<br />
                                    {{ order.property.address2 }}<br v-if="order.property.address2" />
                                    {{ order.property.unit }}<br v-if="order.property.unit" />
                                    {{ order.property.city }},{{ order.property.state }} {{ order.property.zip }}
                                    <b-col class="data"><a :href="'tel:' + order.property.phone_number">{{ order.property.phone_number }}</a></b-col>
                                </a>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col v-if="appointment.task.order.property.coordinates">
                                <a :href="appointment.task.order.property.coordinates" target="tasca_address">Map</a>
                            </b-col>
                        </b-row>

                        <div v-for="contact in order.property.contacts" :key="contact.id">
                            <b-row v-b-popover.hover.top="contact.notes">
                                <b-col class="label">Contact</b-col>
                                <b-col class="data" cols="10">{{ contact.name }} - {{ getContactType(order.project.client.id, contact) }}</b-col>
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
                            <b-col class="data" cols="10">{{ order.location }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Instructions</b-col>
                            <b-col class="data" cols="10">{{ order.instructions }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Notes</b-col>
                            <b-col class="data" cols="10">{{ order.notes }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Budget</b-col>
                            <b-col class="data" cols="10">{{ order.budget }}+/-{{ order.budget_plus_minus }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Bid</b-col>
                            <b-col class="data" cols="10">{{ order.bid }}+/-{{ order.bid_plus_minus }}</b-col>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
        </b-container>
        <ViewHours :id="order.id" type="order" v-if="order.id">
        </ViewHours>
        <b-container>
            <b-row>
                <b-col>
                    <b-tabs :key="tasks.length">
                        <b-tab v-for="task in tasks" :key="'task_' + task.id" :title="task.name" :active="task.id == task_id">
                            <b-container>
                                <ViewTaskHours :task_id="task.id" :appointment_id="task.id == task_id ? appointment_id : null" :labor_activities="labor_activities">
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
import ViewTaskHours from './ViewTaskHours'
import ViewHours from './ViewHours'
export default {
    name: 'ViewTaskDate',
    components: {
        'ViewTaskHours': ViewTaskHours,
        'ViewHours': ViewHours,
    },
    props: {
        appointment_id : { default: null },
        task_id : { default: null },
        order_id : { required: true },
        labor_activities: { default: () => {return []} }
    },
    data() {
        return {
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
            },
            clock_ins: [],
            billed: false,
            invoiced: false,
            completed: false,
            tasks: []
        };
    },
    created() {
        this.getOrder();
    },
    methods: {
        getOrder() {
            this.$http.get('/order/' + this.order_id).then((results) => {
                let order = results.data;
                //only show first property information
                if(order.properties.length){
                    order.property = order.properties[0];
                }
                else{
                    order.property = {};
                }
                this.order = order;
                this.getTasks();
            });
        },
        getTasks() {
            this.$http.get('/tasks?order_id=' + this.order_id).then((results) => {
                this.tasks = results.data;
            });
        },
        getContactType(client_id, contact){
            let type = contact.client_contact_types.map(t => {
                if (t.client_id === client_id ){
                    return t.name;
                }
            });
            return type[0];
        }
    },
    watch: {
        order_id() {
            this.getOrder();
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