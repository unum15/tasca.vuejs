<template>
    <div>
        <b-container>
            <b-row>
                <b-col class="label">Project</b-col>
                <b-col class="data">{{ task.order.project.name }}</b-col>
                <b-col class="label">Client</b-col>
                <b-col class="data">{{ task.order.project.client.name }}</b-col>
                <b-col class="label">Order#</b-col>
                <b-col class="data">{{ task.order.id }}</b-col>
            </b-row>
            <b-row>
                <b-col class="label">Order Notes</b-col>
                <b-col class="data" cols="10">{{ task.order.project.notes }}</b-col>
            </b-row>
            <b-row>
                <b-col class="label">Order</b-col>
                <b-col class="data" cols="6">{{ task.order.name }}</b-col>
                <b-col class="label">Start Date</b-col>
                <b-col class="data">{{ task.order.start_date }}</b-col>
            </b-row>
            <b-row>
                <b-col class="label">Order Description</b-col>
                <b-col class="data" cols="10">{{ task.order.description }}</b-col>
            </b-row>
            <b-row>
                <b-col cols="4" >
                    <b-row>
                        <b-col class="label">Property</b-col>
                        <b-col class="data">
                            <a :href="'http://maps.google.com/maps?q=' + task.order.property.address1 + '+' + (task.order.property.address2 ? task.order.property.address2 + '+' : '') + task.order.property.city + '+' + task.order.property.state + '+' + task.order.property.zip" target="tasca_address">
                                {{ task.order.property.name }}<br />
                                {{ task.order.property.address1 }}<br />
                                {{ task.order.property.address2 }}<br v-if="task.order.property.address2" />
                                {{ task.order.property.city }},{{ task.order.property.state }} {{ task.order.property.zip }}
                                <b-col class="data"><a :href="'tel:' + task.order.property.phone_number">{{ task.order.property.phone_number }}</a></b-col>
                            </a>
                        </b-col>
                    </b-row>
                    <div v-for="contact in task.order.property.contacts" :key="contact.id">
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
                        <b-col class="data" cols="8">{{ task.order.location }}</b-col>
                    </b-row>
                    <b-row>
                        <b-col class="label">Instructions</b-col>
                        <b-col class="data" cols="8">{{ task.order.instructions }}</b-col>
                    </b-row>
                    <b-row>
                        <b-col class="label">Notes</b-col>
                        <b-col class="data" cols="8">{{ task.order.notes }}</b-col>
                    </b-row>
                    <b-row>
                        <b-col class="label">Budget</b-col>
                        <b-col class="data" cols="8">{{ task.order.budget }}+/-{{ task.order.budget_plus_minus }}</b-col>
                    </b-row>
                    <b-row>
                        <b-col class="label">Bid</b-col>
                        <b-col class="data" cols="8">{{ task.order.bid }}+/-{{ task.order.bid_plus_minus }}</b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-container>
        <ViewHours :id="task.order_id" type="order" v-if="task.order_id">
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
    name: 'ViewTask',
    components: {
        'ViewTaskHours': ViewTaskHours,
        'ViewHours': ViewHours,
    },
    props: {
        task_id : { required:true }
    },
    data() {
        return {
            task: {
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
                }
            },
            billed: false,
            completed: false,
            tasks: [],
        };
    },
    created() {
        this.getTask();
    },
    methods: {
        getTask() {
            this.$http.get('/task/' + this.task_id).then((results) => {
                this.task = results.data;
                //only show first property information
                this.task.order.property = this.task.order.properties[0];
                this.completed = this.task.completion_date != null;
                this.billed = this.task.billed_date != null;
                this.getTasks();
            });
        },
        getTasks() {
            this.$http.get('/tasks?order_id=' + this.task.order_id).then((results) => {
                this.tasks = results.data;
            });
        },
    },
    watch: {
        task_id() {
            this.getTask();
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