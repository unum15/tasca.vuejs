<template>
    <div>
        <b-container>
            <b-row>
                <b-col class="label">Project</b-col>
                <b-col class="data">{{ order.project.name }}</b-col>
                <b-col class="label">Client</b-col>
                <b-col class="data">{{ order.project.client.name }}</b-col>
                <b-col class="label">Order#</b-col>
                <b-col class="data">{{ order.id }}</b-col>
            </b-row>
            <b-row>
                <b-col class="label">Order Notes</b-col>
                <b-col class="data" cols="10">{{ order.project.notes }}</b-col>
            </b-row>
            <b-row>
                <b-col class="label">Order</b-col>
                <b-col class="data" cols="6">{{ order.name }}</b-col>
                <b-col class="label">Start Date</b-col>
                <b-col class="data">{{ order.start_date }}</b-col>
            </b-row>
            <b-row>
                <b-col class="label">Order Description</b-col>
                <b-col class="data" cols="10">{{ order.description }}</b-col>
            </b-row>
            <b-row>
                <b-col cols="4" >
                    <b-row>
                        <b-col class="label">Property</b-col>
                        <b-col class="data">
                            <a :href="'http://maps.google.com/maps?q=' + order.property.address1 + '+' + (order.property.address2 ? order.property.address2 + '+' : '') + order.property.city + '+' + order.property.state + '+' + order.property.zip" target="tasca_address">
                                {{ order.property.name }}<br />
                                {{ order.property.address1 }}<br />
                                {{ order.property.address2 }}<br v-if="order.property.address2" />
                                {{ order.property.city }},{{ order.property.state }} {{ order.property.zip }}
                                <b-col class="data"><a :href="'tel:' + order.property.phone_number">{{ order.property.phone_number }}</a></b-col>
                            </a>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col v-if="order.property.coordinates">
                            <a :href="'http://maps.google.com/maps/@' + order.property.coordinates" target="tasca_address">Map</a>
                        </b-col>
                    </b-row>
                    <div v-for="contact in order.property.contacts" :key="contact.id">
                        <b-row>
                            <b-col class="label">Contact</b-col>
                            <b-col class="data">{{ contact.name }}</b-col>
                        </b-row>
                        <b-row v-for="phone_number in contact.phone_numbers" :key="phone_number.id">
                            <b-col class="label">{{ phone_number.phone_number_type.name }}</b-col>
                            <b-col class="data"><a :href="'tel:' + phone_number.phone_number">{{ phone_number.phone_number }}</a></b-col>
                        </b-row>
                        <b-row v-for="email in contact.emails" :key="email.id">
                            <b-col class="label">{{ email.email_type.name }}</b-col>
                            <b-col class="data"><a :href="'mailto:' + email.email">{{ email.email }}</a></b-col>
                        </b-row>
                    </div>
                </b-col>
                <b-col cols="8">
                    <b-row>
                        <b-col class="label">Location</b-col>
                        <b-col class="data" cols="8">{{ order.location }}</b-col>
                    </b-row>
                    <b-row>
                        <b-col class="label">Instructions</b-col>
                        <b-col class="data" cols="8">{{ order.instructions }}</b-col>
                    </b-row>
                    <b-row>
                        <b-col class="label">Notes</b-col>
                        <b-col class="data" cols="8">{{ order.notes }}</b-col>
                    </b-row>
                    <b-row>
                        <b-col class="label">Budget</b-col>
                        <b-col class="data" cols="8">{{ order.budget }}+/-{{ order.budget_plus_minus }}</b-col>
                    </b-row>
                    <b-row>
                        <b-col class="label">Bid</b-col>
                        <b-col class="data" cols="8">{{ order.bid }}+/-{{ order.bid_plus_minus }}</b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
        <ViewHours :id="order_id" type="order" v-if="order_id">
        </ViewHours>
        <b-container class="text-center">
            <b-row>
                <b-col class="header">Tasks</b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-tabs :key="tasks.length">
                        <b-tab v-for="task in tasks" :key="'task_' + task.id" :title="task.name" :active="task.id == task_id">
                            <ViewTaskHours :task_id="task.id">
                            </ViewTaskHours>
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
    name: 'ViewScheduleOrderPopup',
    components: {
        'ViewTaskHours': ViewTaskHours,
        'ViewHours': ViewHours,
    },
    props: {
        order_id : { required:true },
        task_id : { default:null }
    },
    data() {
        return {
            order: {
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
            tasks: [],
        };
    },
    created() {
        this.getOrder();
    },
    methods: {
        getOrder() {
            this.$http.get('/order/' + this.order_id).then((results) => {
                this.order = results.data;
                //only show first property information
                this.order.property = this.order.properties[0];
                this.getTasks();
            });
        },
        getTasks() {
            this.$http.get('/tasks?order_id=' + this.order_id).then((results) => {
                this.tasks = results.data;
            });
        },
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
}

.header {
    font-weight: bold;
}

.data {
    text-align: left;
}
</style>