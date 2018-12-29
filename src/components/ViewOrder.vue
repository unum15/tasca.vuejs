<template>
    <div>
        <b-container>
            <b-row>
                <b-col>Client</b-col>
                <b-col>{{ order.project.property.client.name }}</b-col>
            </b-row>
            <b-row>
                <b-col>Employee</b-col>
                <b-col>Sign In</b-col>
                <b-col>Sign Out</b-col>
                <b-col>Notes</b-col>
            </b-row>
            <b-row>
                <b-col>Total</b-col>
            </b-row>
            <b-row>
                <b-col>Property</b-col>
            </b-row>
            <b-row>
                <b-col>
                    <a :href="'http://maps.google.com/maps?q=' + order.project.property.address1 + '+' + order.project.property.address2 + '+' + order.project.property.city + '+' + order.project.property.state + '+' + order.project.property.zip" target="tasca_address">
                        {{ order.project.property.name }}<br />
                        {{ order.project.property.address1 }}<br />
                        {{ order.project.property.address2 }}<br v-if="order.project.property.address2" />
                        {{ order.project.property.city }},{{ order.project.property.state }} {{ order.project.property.zip }}
                    </a>
                </b-col>
            </b-row>
            <div v-for="contact in order.project.property.contacts">
                <b-row>
                    <b-col>Contact</b-col>
                    <b-col>{{ contact.name }}</b-col>
                </b-row>
                <b-row v-for="phone_number in contact.phone_numbers">
                    <b-col>{{ phone_number.phone_number_type.name }}</b-col>
                    <b-col><a :href="'tel:' + phone_number.phone_number">{{ phone_number.phone_number }}</a></b-col>
                </b-row>
            </div>
            <b-row>
                <b-col>Requested By</b-col>
                <b-col>{{ order.project.contact.name }}</b-col>
            </b-row>
            <b-row v-for="phone_number in order.project.contact.phone_numbers">
                <b-col>{{ phone_number.phone_number_type.name }}</b-col>
                <b-col><a :href="'tel:' + phone_number.phone_number">{{ phone_number.phone_number }}</a></b-col>
            </b-row>
            <b-row>
                <b-col>Description</b-col>
            </b-row>
                <b-col>{{ order.description }}</b-col>
            </b-row>
            <b-row>
                <b-col>Location of work</b-col>
                <b-col>{{ order.location }}</b-col>
            </b-row>
            <b-row>
                <b-col>Instructions</b-col>
                <b-col>{{ order.instructions }}</b-col>
            </b-row>
            <b-row>
                <b-col>Notes</b-col>
                <b-col>{{ order.notes }}</b-col>
            </b-row>
            <b-row>
                <b-col>Priority</b-col>
                <b-col>{{ order.order_priority.name }}</b-col>
            </b-row>
            <b-row>
                <b-col>Order date</b-col>
                <b-col>{{ order.date }}</b-col>
            </b-row>
            <b-row>
                <b-col>Approval date</b-col>
                <b-col>{{ order.approval_date }}</b-col>
            </b-row>
            <b-row v-if="order.approver">
                <b-col>Approved by</b-col>
                <b-col>{{ order.approver.name }}</b-col>
            </b-row>
            <b-row>
                <b-col>Clients P.O. Number</b-col>
                <b-col>{{ order.purchase_order_number }}</b-col>
            </b-row>
            <b-row>
                <b-col>Progress percentage</b-col>
                <b-col>{{ order.progress_percentage }}</b-col>
            </b-row>
            <b-row>
                <b-col>Budget</b-col>
                <b-col>{{ order.budget }}</b-col>
            </b-row>
            <b-row>
                <b-col>Budget invoice number</b-col>
                <b-col>{{ order.budget_invoice_number }}</b-col>
            </b-row>
            <b-row>
                <b-col>Billing invoice number</b-col>
                <b-col>{{ order.billing_invoice_number }}</b-col>
            </b-row>
            <b-row>
                <b-col>Bid</b-col>
                <b-col>{{ order.bid }}</b-col>
            </b-row>
            <b-row>
                <b-col>Date completed</b-col>
                <b-col>{{ order.completion_date }}</b-col>
            </b-row>
            <b-row>
                <b-col>Tasks</b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-tabs>
                        <b-tab v-for="task in order.tasks" :key="task.id" :title="task.name ? task.name :'Task ' + task.id">
                            <b-container>
                                <b-row>
                                    <b-col>Description</b-col>
                                    <b-col>{{ task.description }}</b-col>
                                </b-row>
                                <b-row>
                                    <b-col>Status</b-col>
                                    <b-col>{{ task.task_status.name }}</b-col>
                                </b-row>
                                <b-row v-if="task.task_action">
                                    <b-col>Type</b-col>
                                    <b-col>{{ task.task_type.name }}</b-col>
                                </b-row>
                                <b-row v-if="task.task_action">
                                    <b-col>Action</b-col>
                                    <b-col>{{ task.task_action.name }}</b-col>
                                </b-row>
                                <b-row>
                                    <b-col>Day</b-col>
                                    <b-col>{{ task.day }}</b-col>
                                </b-row>
                                <b-row>
                                    <b-col>Date</b-col>
                                    <b-col>{{ task.date }}</b-col>
                                </b-row>
                                <b-row>
                                    <b-col>Time</b-col>
                                    <b-col>{{ task.time }}</b-col>
                                </b-row>
                                <b-row>
                                    <b-col>Job Hours</b-col>
                                    <b-col>{{ task.job_hours }}</b-col>
                                </b-row>
                                <b-row>
                                    <b-col>Crew Hours</b-col>
                                    <b-col>{{ task.crew_hours }}</b-col>
                                </b-row>
                                <b-row>
                                    <b-col>Notes</b-col>
                                    <b-col>{{ task.notes }}</b-col>
                                </b-row>
                            </b-container>
                        </b-tab>
                    </b-tabs>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>
export default {
    name: 'ViewOrder',
    props: {
        order_id : { required:true }
    },
    data() {
        return {
            order: {
                project: {
                    property: {
                        client: {
                            name : null
                        }
                    },
                    contact: {
                        name: null
                    }
                },
                order_priority: {
                
                },
                approver: {
                
                },
                tasks: []
            }
        }
    },
    created() {
        this.getOrder();
    },
    methods: {
        getOrder() {
            console.log('get'+this.order_id)
            this.$http.get('/order/' + this.order_id).then((results) => {
                this.order = results.data;
                console.log(this.order);
            });
        }
    },
    computed: {
    },
    watch: {
        order_id() {
            console.log('get');
            this.getOrder();
        }
    }
}
</script>