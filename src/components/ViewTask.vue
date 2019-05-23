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
                <b-col class="data">{{ task.order.project.notes }}</b-col>
            </b-row>
            <b-row>
                <b-col class="label">Order</b-col>
                <b-col class="data">{{ task.order.name }}</b-col>
                <b-col class="label">Start Date</b-col>
                <b-col class="data">{{ task.order.start_date }}</b-col>
            </b-row>
            <b-row>
                <b-col class="data">{{ task.order.description }}</b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-container>
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
                    </b-container>
                </b-col>
                <b-col>
                    <b-container>
                        <b-row>
                            <b-col class="label">Location</b-col>
                            <b-col class="data">{{ task.order.location }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Instructions</b-col>
                            <b-col class="data">{{ task.order.instructions }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Notes</b-col>
                            <b-col class="data">{{ task.order.notes }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Budget</b-col>
                            <b-col class="data">{{ task.order.budget }}+/-{{ task.order.budget_plus_minus }}</b-col>
                        </b-row>
                        <b-row>
                            <b-col class="label">Bid</b-col>
                            <b-col class="data">{{ task.order.bid }}+/-{{ task.order.bid_plus_minus }}</b-col>
                        </b-row>
                    </b-container>
                </b-col>
            </b-row>
            <b-row>
                <b-col class="label">Task</b-col>
                <b-col class="data">{{ task.name }}</b-col>
                <b-col class="label">Hours</b-col>
                <b-col class="data">{{ task.task_hours }}</b-col>
                <b-col class="label">Crew Time</b-col>
                <b-col class="data">{{ task.crew_hours }}</b-col>
            </b-row>
            <b-row>
                <b-col class="data">{{ task.description }}</b-col>
            </b-row>
            <b-row>
                <b-col class="label">Completed</b-col>
                <b-col>
                    <b-form-checkbox v-model="completed" @input="markCompleted">
                    </b-form-checkbox>
                </b-col>
                <b-col class="label">Billed</b-col>
                <b-col>
                    <b-form-checkbox v-model="billed" @input="markBilled">
                    </b-form-checkbox>
                </b-col>
            </b-row>
            <b-row>
                <b-col class="header">Task Dates</b-col>
            </b-row>
            <div v-for="task_date in task_dates" :key="task_date.id">
                <b-row>
                    <b-col class="label">Schedule Date & Time</b-col>
                    <b-col class="data">{{ task_date.date }} {{ task_date.time }}</b-col>
                </b-row>
                <b-row>
                    <b-col class="label">Day Notes</b-col>
                    <b-col class="data">{{ task_date.notes }}</b-col>
                </b-row>
                
                <b-row>
                    <b-col class="header">Employee</b-col>
                    <b-col class="header">Sign In</b-col>
                    <b-col class="header">Sign Out</b-col>
                    <b-col class="header">Hours</b-col>
                    <b-col class="header">Labor Category</b-col>
                </b-row>
                <div v-for="sign_in in task_date.sign_ins" :key="sign_in.id">
                    <b-row>
                        <b-col>{{ sign_in.contact.name }}</b-col>
                        <b-col @click="editSignIn(sign_in, 'sign_in')" style="cursor:pointer;">{{ formatTime(sign_in.sign_in) }}</b-col>
                        <b-col @click="editSignIn(sign_in, 'sign_out')" style="cursor:pointer;">{{ sign_in.sign_out ? formatTime(sign_in.sign_out) : 'Click to add.' }}</b-col>
                        <b-col>{{ timeDiff(sign_in.sign_in, sign_in.sign_out) }}</b-col>
                        <b-col></b-col>
                    </b-row>
                    <b-row>
                        <b-col class="label">Notes For The Day</b-col>
                        <b-col  @click="editSignIn(sign_in, 'notes')" style="cursor:pointer;" class="data">{{ sign_in.notes ? sign_in.notes : 'Click to add.' }}</b-col>
                    </b-row>
                </div>
            </div>
            <b-row>
                <b-col class="header">Other Tasks for Order #{{ task.order.id }} - {{ task.order.name }}</b-col>
            </b-row>
            <div v-for="task in tasks" :key="'task_' + task.id">
                <b-row>
                    <b-col>{{ task.name }}</b-col>
                </b-row>
            </div>
        </b-container>
    </div>
</template>
<script>
import moment from 'moment'
export default {
    name: 'ViewTask',
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
                        
                    },
                    tasks: {
                    
                    }
                },
                task_dates:{
                }
            },
            billed: false,
            completed: false,
            sign_ins: [],
            tasks: [],
            task_dates: []
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
                this.getTaskDates();
                //this.getSignIns();
                this.getTasks();
                
            });
        },
        getSignIns() {
            this.$http.get('/sign_ins?task_id=' + this.task.id).then((results) => {
                this.sign_ins = results.data;
            });
        },
        getTasks() {
            this.$http.get('/tasks?order_id=' + this.task.order_id).then((results) => {
                this.tasks = results.data;
                
            });
        },
        getTaskDates() {
            this.$http.get('/task_dates?task_id=' + this.task_id).then((results) => {
                var task_dates = results.data;
                this.task_dates = [];
                for(var x = 0; x < task_dates.length; x++){
                    this.$http.get('/sign_ins?task_date_id=' + task_dates[x].id).then((results) => {
                        if(results.data.length > 0){
                            for(var y = 0; y < task_dates.length; y++){
                                if(task_dates[y].id == results.data[0].task_date_id){
                                    task_dates[y].sign_ins = results.data;
                                    this.task_dates.splice(y, 0, task_dates[y]);
                                }
                            }
                        }
                    });
                }
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
            if(time == null){
                return "";
            }
            return moment(time).format('MM-DD hh:mm')
        },
        markCompleted(){
            let task = {
                completion_date: this.completed ? moment().format('YYYY-MM-DD') : null
            }
            this.$http.patch('/task/' + this.task_id, task);
        },
        markBilled(){
            let task = {
                billed_date: this.billed ? moment().format('YYYY-MM-DD') : null
            }
            this.$http.patch('/task/' + this.task_id, task);
        },
        editSignIn(sign_in,field){
            var new_value = null;
            if(new_value = prompt('Change ' + field, sign_in[field])){
                for(var x = 0; x < this.task_dates.length; x++){
                    if(this.task_dates[x].id == sign_in.task_date_id){
                        for(var y = 0; y < this.task_dates[x].sign_ins.length; y++){
                            if(this.task_dates[x].sign_ins[y].id == sign_in.id){
                                var new_sign_in = {};
                                new_sign_in[field] = new_value;
                                this.$http.patch('/sign_in/' + sign_in.id, sign_in);
                                this.task_dates[x].sign_ins[y][field] = new_value;
                            }
                        }
                    }
                }
            }
        }
    },
    computed: {
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