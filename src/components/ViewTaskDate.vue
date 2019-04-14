<template>
    <div>
        <b-container>
            <b-row>
                <b-col>Project</b-col>
                <b-col>{{ task_date.task.order.project.name }}</b-col>
                <b-col>Client</b-col>
                <b-col>{{ task_date.task.order.project.client.name }}</b-col>
                <b-col>Order#</b-col>
                <b-col>{{ task_date.task.order.id }}</b-col>
            </b-row>
            <b-row>
                <b-col>{{ task_date.task.order.project.notes }}</b-col>
            </b-row>
            <b-row>
                <b-col>Order</b-col>
                <b-col>{{ task_date.task.order.name }}</b-col>
                <b-col>Start Date</b-col>
                <b-col>{{ task_date.task.order.start_date }}</b-col>
                <b-col><b-button @click="signIn" v-if="!sign_in_id">Clock In</b-button></b-col>
                <b-col><b-button @click="signOut" v-if="sign_in_id">Clock Out</b-button></b-col>
            </b-row>
            <b-row>
                <b-col>{{ task_date.task.order.description }}</b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-container>
                        <b-row>
                            <b-col>Property</b-col>
                            <b-col>
                                <a :href="'http://maps.google.com/maps?q=' + task_date.task.order.property.address1 + '+' + (task_date.task.order.property.address2 ? task_date.task.order.property.address2 + '+' : '') + task_date.task.order.property.city + '+' + task_date.task.order.property.state + '+' + task_date.task.order.property.zip" target="tasca_address">
                                    {{ task_date.task.order.property.name }}<br />
                                    {{ task_date.task.order.property.address1 }}<br />
                                    {{ task_date.task.order.property.address2 }}<br v-if="task_date.task.order.property.address2" />
                                    {{ task_date.task.order.property.city }},{{ task_date.task.order.property.state }} {{ task_date.task.order.property.zip }}
                                    <b-col><a :href="'tel:' + task_date.task.order.property.phone_number">{{ task_date.task.order.property.phone_number }}</a></b-col>
                                </a>
                            </b-col>
                        </b-row>
                        <div v-for="contact in task_date.task.order.property.contacts" :key="contact.id">
                            <b-row>
                                <b-col>Contact</b-col>
                                <b-col>{{ contact.name }}</b-col>
                            </b-row>
                            <b-row v-for="phone_number in contact.phone_numbers" :key="phone_number.id">
                                <b-col>{{ phone_number.phone_number_type.name }}</b-col>
                                <b-col><a :href="'tel:' + phone_number.phone_number">{{ phone_number.phone_number }}</a></b-col>
                            </b-row>
                            <b-row v-for="email in contact.emails" :key="email.id">
                                <b-col>{{ email.email_type.name }}</b-col>
                                <b-col><a :href="'mailto:' + email.email">{{ email.email }}</a></b-col>
                            </b-row>
                        </div>
                    </b-container>
                </b-col>
                <b-col>
                    <b-container>
                        <b-row>
                            <b-col>Location</b-col>
                            <b-col>{{ task_date.task.order.location }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col>Instructions</b-col>
                            <b-col>{{ task_date.task.order.instructions }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col>Notes</b-col>
                            <b-col>{{ task_date.task.order.notes }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col>Budget</b-col>
                            <b-col>{{ task_date.task.order.budget }}+/-{{ task_date.task.order.budget_plus_minus }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col>Bid</b-col>
                            <b-col>{{ task_date.task.order.bid }}+/-{{ task_date.task.order.bid_plus_minus }}</b-col>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
            <b-row>
                <b-col>Task</b-col>
                <b-col>{{ task_date.task.name }}</b-col>
                <b-col>Hours</b-col>
                <b-col>{{ task_date.task.task_hours }}</b-col>
                <b-col>Crew Time</b-col>
                <b-col>{{ task_date.task.crew_hours }}</b-col>
            </b-row>
            <b-row>
                <b-col>Schedule Date & Time</b-col>
                <b-col>{{ task_date.date }} {{ task_date.time }}</b-col>
            </b-row>
            <b-row>
                <b-col>Day Notes</b-col>
                <b-col>{{ task_date.notes }}</b-col>
            </b-row>
            <b-row>
                <b-col>{{ task_date.task.description }}</b-col>
            </b-row>
            <b-row>
                <b-col>Employee</b-col>
                <b-col>Sign In</b-col>
                <b-col>Sign Out</b-col>
                <b-col>Hours</b-col>
                <b-col>Notes</b-col>
            </b-row>
            <b-row v-for="sign_in in sign_ins" :key="sign_in.id">
                <b-col>{{ sign_in.contact.name }}</b-col>
                <b-col>{{ sign_in.sign_in }}</b-col>
                <b-col>{{ sign_in.sign_out }}</b-col>
                <b-col>{{ timeDiff(sign_in.sign_in, sign_in.sign_out) }}</b-col>
                <b-col><b-form-input v-model="sign_in.notes" @input="saveNotes(sign_in)"></b-form-input></b-col>
            </b-row>
            <b-row>
                <b-col>Total</b-col>
                <b-col></b-col>
                <b-col></b-col>
                <b-col></b-col>
                <b-col></b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>
import moment from 'moment'
export default {
    name: 'ViewOrder',
    props: {
        task_date_id : { required:true }
    },
    data() {
        return {
            task_date: {
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
                }
            },
            sign_ins: []
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
                this.getSignIns();
            });
        },
        getSignIns() {
            this.$http.get('/sign_ins?order_id=' + this.task_date.task.order_id).then((results) => {
                this.sign_ins = results.data;
            });
        },
        signIn(){
            var sign_in
            if(sign_in = prompt('Sign In Time', moment().format("YYYY-MM-DD h:mm:ss a"))){
                this.$http.post('/sign_in', {order_id : this.task_date.task.order_id, sign_in: sign_in}).then(() => {
                    this.getOrder()
                });
            }
        },
        signOut(){
            var sign_out
            if(sign_out = prompt('Sign Out Time', moment().format("YYYY-MM-DD h:mm:ss a"))){
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
            var my_id = localStorage.getItem('id')
            var ids = this.sign_ins.filter( si => (si.contact_id == my_id && si.sign_out == null))
            if(ids.length > 0){
                id = ids[0].id
            }
            return id;
        }
    },
    watch: {
        task_date_id() {
            this.getTaskDate();
        }
    }
}
</script>