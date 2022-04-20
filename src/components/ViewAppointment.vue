<template>
    <div v-if="order">
        <b-container style="padding-left:0px;">
            <b-row>
                <b-col class="data">
                    <span class="label">Project</span>
                    {{ truncate(order.project.name,30) }}
                </b-col>
                <b-col class="data">
                    <span class="label">Client</span>
                    {{ truncate(order.project.client.name,30) }}
                </b-col>
                <b-col class="data">
                    <span class="label">Order#</span>
                    {{ order.id }}
                </b-col>
            </b-row>
            <b-row>
                <b-col class="data">{{ order.project.notes }}</b-col>
            </b-row>
            <b-row>
                <b-col class="data">
                    <span class="label">Order</span>
                    {{ truncate(order.name,80) }}
                </b-col>
                <b-col class="data">
                    <span class="label">Start Date</span>
                    {{ truncate(order.start_date,80) }}
                </b-col>
            </b-row>
            <b-row>
                <b-col class="data">{{ order.description }}</b-col>
            </b-row>
            <b-row>
                <b-col style="padding:0px;border: 1px solid black;">
                    <b-container>
                        <b-row>
                            <b-col class="label" cols="2">Property</b-col>
                            <b-col class="data" cols="10">
                                <a :href="'http://maps.google.com/maps?q=' + order.property.address1 + '+' + (order.property.address2 ? order.property.address2 + '+' : '') + order.property.city + '+' + order.property.state + '+' + order.property.zip" target="tasca_address">
                                    {{ order.property.name }}<br />
                                    {{ order.property.address1 }}<br />
                                    {{ order.property.address2 }}<br v-if="order.property.address2" />
                                    {{ order.property.unit }}<br v-if="order.property.unit" />
                                    {{ order.property.city }},{{ order.property.state }} {{ order.property.zip }}
                                </a>
                            </b-col>
                        </b-row>
                        <b-row v-if="order.property.phone_number">
                            <b-col class="label" cols="2"></b-col>
                            <b-col class="data"><a :href="'tel:' + order.property.phone_number">{{ order.property.phone_number }}</a></b-col>
                        </b-row>
                        <b-row>
                            <b-col v-if="order.property.coordinates">
                                <a :href="order.property.coordinates" target="tasca_address">Map</a>
                            </b-col>
                        </b-row>

                        <div v-for="contact in order.property.contacts" :key="contact.id">
                            <b-row v-b-popover.hover.top="contact.notes">
                                <b-col class="label" cols="2">Contact</b-col>
                                <b-col class="data" cols="10">{{ contact.name }} - {{ getContactType(order.project.client.id, contact) }}</b-col>
                            </b-row>
                            <b-row v-for="phone_number in contact.phone_numbers" :key="phone_number.id">
                                <b-col class="label" cols="2">{{ phone_number.phone_number_type.name }}</b-col>
                                <b-col class="data" cols="3">
                                    <a :href="'tel:' + phone_number.phone_number">{{ phone_number.phone_number }}</a>
                                </b-col>
                                <b-col class="data" cols="5">
                                    <a :href="'sms:' + phone_number.phone_number" target="gvoice">Text</a>
                                </b-col>
                            </b-row>
                            <b-row v-for="email in contact.emails" :key="email.id">
                                <b-col class="label" cols="2">{{ email.email_type.name }}</b-col>
                                <b-col class="data" cols="10"><a :href="'mailto:' + email.email">{{ email.email }}</a></b-col>
                            </b-row>
                        </div>
                    </b-container>
                </b-col>
                <b-col style="padding:0px;border: 1px solid black;">
                    <b-container>
                        <b-row v-b-popover.hover.top="order.location">
                            <b-col class="label" cols="2">Location</b-col>
                            <b-col class="long_data" cols="10" >{{ truncate(order.location,50) }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label" cols="2">Instrs.</b-col>
                            <b-col class="long_data" cols="10">{{ order.instructions }}</b-col>
                        </b-row>
                        <b-row v-b-popover.hover.top="order.notes">
                            <b-col class="label" cols="2">Notes</b-col>
                            <b-col class="long_data" cols="10">{{ truncate(order.notes,150) }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label" cols="2">Budget</b-col>
                            <b-col class="data" cols="10">{{ order.budget }}+/-{{ order.budget_plus_minus }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label" cols="2">Task Hours</b-col>
                            <b-col class="data" cols="10">{{ task_hours }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label" cols="2">Crew Hours</b-col>
                            <b-col class="data" cols="10">{{ task_crew_hours }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label" cols="2">Bid</b-col>
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
            order: null,
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
        },
        truncate(value,length){
            if(value){
                return value.substring(0,length);
            }
            return '';
        }
    },
    computed: {
        task_hours(){
            let hours = 0;
            this.tasks.map(t =>{
                hours += t.task_hours;
            });
            return hours;
        },
        task_crew_hours(){
            let hours = 0;
            this.tasks.map(t =>{
                hours += t.crew_hours;
            });
            return hours;
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
    font-weight: bold;
    white-space: nowrap;
}

.header {
    font-weight: bold;
}

.data {
    text-align: left;
    white-space: nowrap;
    padding-right: 0 px;
}

.long_data {
    text-align: left;
    padding-right: 0 px;
}
.col-10 {
    padding-right: 0 px;
}
</style>