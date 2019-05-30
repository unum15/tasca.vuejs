<template>
    <div>
        <b-container>
            <b-row>
                <b-col>Client</b-col>
                <b-col>{{ order.project.client.name }}</b-col>
                <b-col><b-button @click="signIn" v-if="!sign_in_id">Clock In</b-button></b-col>
                <b-col><b-button @click="signOut" v-if="sign_in_id">Clock Out</b-button></b-col>
            </b-row>
            <b-row>
                <b-col>Employee</b-col>
                <b-col>Sign In</b-col>
                <b-col>Sign Out</b-col>
                <b-col>Hours</b-col>
                <b-col>Notes</b-col>
            </b-row>
            <div v-for="task in order.tasks" :key="task.id">
                <div v-for="date in task.dates" :key="date.id">
                    <b-row v-for="sign_in in date.sign_ins" :key="sign_in.id">
                        <b-col>{{ sign_in.contact.name }}</b-col>
                        <b-col>{{ sign_in.sign_in }}</b-col>
                        <b-col>{{ sign_in.sign_out }}</b-col>
                        <b-col>{{ timeDiff(sign_in.sign_in, sign_in.sign_out) }}</b-col>
                        <b-col><b-form-input v-model="sign_in.notes" @input="saveNotes(sign_in)"></b-form-input></b-col>
                    </b-row>
                </div>
            </div>
            <b-row>
                <b-col>Total</b-col>
                <b-col></b-col>
                <b-col></b-col>
                <b-col></b-col>
                <b-col></b-col>
            </b-row>
            <b-row>
                <b-col>Property</b-col>
                <b-col>
                    <a :href="'http://maps.google.com/maps?q=' + order.property.address1 + '+' + (order.property.address2 ? order.property.address2 + '+' : '') + order.property.city + '+' + order.property.state + '+' + order.property.zip" target="tasca_address">
                        {{ order.property.name }}<br />
                        {{ order.property.address1 }}<br />
                        {{ order.property.address2 }}<br v-if="order.property.address2" />
                        {{ order.property.city }},{{ order.property.state }} {{ order.property.zip }}
                    </a>
                </b-col>
            </b-row>
            <div v-for="contact in order.property.contacts" :key="contact.id">
                <b-row>
                    <b-col>Contact</b-col>
                    <b-col>{{ contact.name }}</b-col>
                </b-row>
                <b-row v-for="phone_number in contact.phone_numbers" :key="phone_number.id">
                    <b-col>{{ phone_number.phone_number_type.name }}</b-col>
                    <b-col><a :href="'tel:' + phone_number.phone_number">{{ phone_number.phone_number }}</a></b-col>
                </b-row>
            </div>
            <b-row>
                <b-col>Requested By</b-col>
                <b-col>{{ order.project.contact.name }}</b-col>
            </b-row>
            <b-row v-for="phone_number in order.project.contact.phone_numbers" :key="phone_number.id">
                <b-col>{{ phone_number.phone_number_type.name }}</b-col>
                <b-col><a :href="'tel:' + phone_number.phone_number">{{ phone_number.phone_number }}</a></b-col>
            </b-row>
            <b-row>
                <b-col>Description</b-col>
            </b-row>
            <b-row>
                <b-col class="bg-info">{{ order.description }}</b-col>
            </b-row>
            <b-row>
                <b-col>Location of work</b-col>
                <b-col>{{ order.location }}</b-col>
            </b-row>
            <b-row>
                <b-col>Instructions</b-col>
            </b-row>
            <b-row class="bg-info">
                <b-col>{{ order.instructions }}</b-col>
            </b-row>
            <b-row class="bg-info">
                <b-col>Notes</b-col>
            </b-row>
            <b-row>
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
                                <b-row v-if="task.task_status">
                                    <b-col>Status</b-col>
                                    <b-col>{{ task.task_status.name }}</b-col>
                                </b-row>
                                <b-row v-if="task.task_type">
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
import moment from 'moment'
export default {
    name: 'ViewOrder',
    props: {
        order_id : { required:true }
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
                    
                },
                order_priority: {
                
                },
                approver: {
                
                },
                tasks: [],
                sign_ins: []
            }
        }
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
            });
        },
        signIn(){
            var sign_in
            sign_in = prompt('Sign In Time', moment().format("YYYY-MM-DD h:mm:ss a"));
            if(sign_in !== null){
                this.$http.post('/sign_in', {order_id : this.order_id, sign_in: sign_in}).then(() => {
                    this.getOrder();
                });
            }
        },
        signOut(){
            var sign_out
            sign_out = prompt('Sign Out Time', moment().format("YYYY-MM-DD h:mm:ss a"));
            if(sign_out !== null){
                this.$http.patch('/sign_in/' + this.sign_in_id, {sign_out : sign_out}).then(() => {
                    this.getOrder()
                });
            }
        },
        saveNotes(sign_in){
            this.$http.patch('/sign_in/' + sign_in.id, {notes : sign_in.notes})
        },
        timeDiff(start_time, stop_time){
            var start = moment(start_time)
            var stop = moment();
            if(stop_time){
                stop = moment(stop_time)
            }
            var diff = Math.round(stop.diff(start)/36000)/100
            
            return diff
        }
    },
    computed: {
        sign_in_id() {
            var id = null
            /*var my_id = localStorage.getItem('id')
            var ids = this.order.sign_ins.filter( si => (si.contact_id == my_id && si.sign_out == null))
            if(ids.length > 0){
                id = ids[0].id
            }*/
            return id;
        }
    },
    watch: {
        order_id() {
            this.getOrder();
        }
    }
}
</script>