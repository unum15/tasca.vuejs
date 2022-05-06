<template>
    <div v-if="order" @click="clearTaskMenu();">
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
                                    <b-col class="data"><a :href="'tel:' + order.property.phone_number">{{ order.property.phone_number }}</a></b-col>
                                </a>
                            </b-col>
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
                                <b-col class="data" cols="10"><a :href="'tel:' + phone_number.phone_number">{{ phone_number.phone_number }}</a></b-col>
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
                        <b-tab v-for="task in tasks" :key="'task_' + task.id" :active="task.id == task_id">
                            <template slot="title" style="text-align:left">
                                <div class="text-left" @contextmenu="showTabContextMenu($event,task.id)">
                                	<span v-bind:class="{'text-danger': task.closed_date, 'billed': task.billed_date || task.completion_date}">
                                		{{ task.name }}
                                    </span>
                                    <b-list-group :ref="'context-' + task.id" class="popup">
                                    	<b-list-group-item @click="copy(task.id)">Copy</b-list-group-item>
                                        <b-list-group-item @click="edit(task.id)">Edit</b-list-group-item>
                                    </b-list-group>
                                </div>
                            </template>
                            <b-container>
                                <ViewTaskHours :task_id="task.id" :appointment_id="task.id == task_id ? appointment_id : null" :labor_activities="labor_activities">
                                </ViewTaskHours>
                            </b-container>
                        </b-tab>
                    </b-tabs>
                </b-col>
            </b-row>
        </b-container>
        <b-modal size="xl" scrollable ref="modalEditTask" title="Copy Task" @ok="modalEditTask" ok-only>
            <EditTask
                :order="order"
                :task="edit_task"
                :allow_delete="false"
                :labor_types="labor_types"
                :task_statuses="task_statuses"
                :task_actions="task_actions"
                :labor_assignments="labor_assignments"
                :crews="crews"
            >
            </EditTask>
      </b-modal>
    </div>
</template>
<script>
import ViewTaskHours from './ViewTaskHours';
import ViewHours from './ViewHours';
import EditTask from './EditTask';
export default {
    name: 'ViewTaskDate',
    components: {
        ViewTaskHours,
        ViewHours,
        EditTask
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
            tasks: [],
            edit_task: {},
            crews: [],
			labor_assignments: [],
			task_statuses: [],
			task_actions: [],
			labor_types: [],
        };
    },
    created() {
        this.$http.get('/crews').then(response => {
			this.crews = response.data;
		});
    	this.$http.get('/labor_assignments').then(response => {
			this.labor_assignments = response.data.data;
		});
		this.$http.get('/task_statuses').then(response => {
			this.task_statuses = response.data;
		});
		this.$http.get('/task_actions').then(response => {
			this.task_actions = response.data;
		});
		this.$http.get('/labor_types').then(response => {
			this.labor_types = response.data.data;
		});
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
        },
        showTabContextMenu(event,id){
			event.preventDefault();
            let tasks = this.tasks.filter(t => (id == t.id));
            this.edit_task = Object.assign({}, tasks[0]);;
			if(this.$refs['context-'+id].length){
				this.$refs['context-'+id][0].style.visibility = 'visible';
			}
		},
		copy(id){
            this.clearTaskMenu();
			this.edit_task.id = null;
			this.edit_task.group = null;
			this.edit_task.completion_date = null;
			this.edit_task.invoiced_date = null;
			this.edit_task.billed_date = null;
			this.edit_task.closed_date = null;			
			this.$refs['modalEditTask'].show();
		},
        edit(id){
            this.clearTaskMenu();
			this.$refs['modalEditTask'].show();
		},
		modalEditTask(){
            this.getTasks();
			this.edit_task = {};
		},
        clearTaskMenu(){
            if(this.edit_task && this.edit_task.id && this.$refs['context-'+this.edit_task.id]){
                this.$refs['context-'+this.edit_task.id][0].style.visibility = 'hidden';
            }
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
.popup {
    visibility: hidden;
    width: 160px;
    background-color: #fff;
    color: #000;
    text-align: left;
    border-radius: 6px;
    padding: 8px 0;
    position: absolute;
    z-index: 1;
    left: 50%;
	margin-left: -350px;
}
</style>