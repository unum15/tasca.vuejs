<template>
    <div>
        <b-tabs @input="changedTabs" v-model="my_tab_index">
            <b-tab title="General">
                <b-container fluid>
                    <b-form-group label="Order Name">
                    <b-form-input
                        type="text"
                        @change="save"
                        v-model="my_order.name"
                        required
                        :state="my_order.name != null"
                        placeholder="New Order Name"
                        >
                    </b-form-input>
                </b-form-group>
                    <b-row>
                        <b-col>
                            <b-form-group label="Properties"  v-if="isServiceOrder">
                                <b-form-select
                                    @input="save"
                                    :options="properties"
                                    value-field="id"
                                    text-field="name"
                                    required
                                    state="my_order.properties != []"
                                    v-model="my_order.properties"
                                    multiple
                                    >
                                </b-form-select>
                            </b-form-group>
                            <b-form-group label="Property"  v-if="!isServiceOrder">
                                <b-form-select
                                    @input="save"
                                    :options="properties"
                                    value-field="id"
                                    text-field="name"
                                    required
                                    :state="my_order.property != null"
                                    v-model="my_order.property"
                                    
                                    >
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                    </b-row>
                     <b-row>
                        <b-col>
                            <b-form-group label="Description">
                                <b-form-input
                                    @change="save"
                                    v-model="my_order.description"
                                    placeholder="What needs to be done?"
                                    required
                                    :state="my_order.description != null"
                                    >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Category">
                                <b-form-select
                                    @change="save"
                                    :options="categories"
                                    value-field="id"
                                    text-field="name"
                                    v-model="my_order.order_category_id"
                                    required
                                    :state="my_order.order_category_id != null"
                                    >
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Priority">
                                <b-form-select
                                    @change="save"
                                    :options="priorities"
                                    value-field="id"
                                    text-field="name"
                                    v-model="my_order.order_priority_id"
                                    :state="my_order.order_priority_id != null"
                                    required
                                    >
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Type">
                                <b-form-select
                                    @change="save"
                                    :options="types"
                                    value-field="id"
                                    text-field="name"
                                    v-model="my_order.order_type_id"
                                    :state="my_order.order_type_id != null"
                                    required
                                    >
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Status">
                                <b-form-select
                                    @change="save"
                                    :options="statuses"
                                    value-field="id"
                                    text-field="name"
                                    v-model="my_order.order_status_id"
                                    :state="my_order.order_status_id != null"
                                    required
                                    >
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Action">
                                <b-form-select
                                    @change="save"
                                    :options="current_actions"
                                    value-field="id"
                                    text-field="name"
                                    v-model="my_order.order_action_id"
                                    :state="my_order.order_action_id != null"
                                    required
                                    >
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Order Date">
                                <b-form-input
                                    type="date"
                                    @input="save"
                                    v-model="my_order.date"
                                    required
                                    :state="my_order.date != null"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Closed Date" v-if="order.order_status_type_id!=2">
                                <b-form-input
                                    type="date"
                                    @input="save"
                                    v-model="my_order.completion_date"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Expiration Date">
                                <b-form-input
                                    type="date"
                                    @input="save"
                                    v-model="my_order.expiration_date"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-container>
            </b-tab>
            <b-tab title="Calendar">
                <b-container fluid>
                    <b-row>
                        <b-col>
                            <b-form-group label="Approval Date">
                                <b-form-input
                                    type="date"
                                    @input="save"
                                    v-model="my_order.approval_date"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Start Date">
                                <b-form-input
                                    type="date"
                                    @input="save"
                                    v-model="my_order.start_date"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Service Window">
                                <b-form-input
                                    type="number"
                                    @change="save"
                                    v-model="my_order.service_window"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Recurrences" v-if="(order.order_status_type_id!=2) && (!my_order.indefinite)">
                                <b-form-input
                                    type="number"
                                    @change="save"
                                    v-model="my_order.recurrences"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Count" v-if="(order.order_status_type_id!=2)" >
                                <b-form-input
                                    type="number"
                                    @change="save"
                                    v-model="order_interval.count"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Units" v-if="(order.order_status_type_id!=2)" >
                                <b-form-select
                                    @input="save"
                                    :options="units"
                                    v-model="order_interval.unit"
                                    >
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Indefinite"  v-if="order.order_status_type_id!=2">
                                <b-form-checkbox
                                    @input="save"
                                    v-model="my_order.indefinite"
                                    :value="true"
                                    :unchecked-value="false"
                                >
                                </b-form-checkbox>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-container>
            </b-tab>
            <b-tab title="Tasks">
                <EditTasks
                    v-if="my_order.id != null"
                    :order="my_order"
                    :task_types="task_types"
                    :task_statuses="task_statuses"
                    :task_actions="task_actions"
                    :task_categories="task_categories"
                    >
                </EditTasks>
            </b-tab>
            <b-tab title="Notes">
                <b-form-group label="Location">
                    <b-form-textarea
                        v-model="my_order.location"
                        @input="save"
                        :rows="3"
                        :max-rows="6"
                        placeholder="North west corner.">
                    </b-form-textarea>
                </b-form-group>
                <b-form-group label="Instructions">
                    <b-form-textarea
                        v-model="my_order.instructions"
                        @input="save"
                        :rows="3"
                        :max-rows="6"
                        placeholder="Instructions service order.">
                    </b-form-textarea>
                </b-form-group>
                <b-form-group label="Notes">
                    <b-form-textarea
                        v-model="my_order.notes"
                        @input="save"
                        :rows="3"
                        :max-rows="6"
                        placeholder="Notes about this service order.">
                    </b-form-textarea>
                </b-form-group>
            </b-tab>
            <b-tab title="Billing">
                <b-container fluid>
                    <b-row>
                        <b-col>
                            <b-form-group label="PO Number">
                                <b-form-input
                                    type="text"
                                    @change="save"
                                    v-model="my_order.purchase_order_number"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Budget">
                                <b-form-input
                                    type="text"
                                    @change="save"
                                    v-model="my_order.budget"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Budget +/-">
                                <b-form-input
                                    type="number"
                                    @change="save"
                                    v-model="my_order.budget_plus_minus"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Budget Invoice Number">
                                <b-form-input
                                    type="text"
                                    @change="save"
                                    v-model="my_order.budget_invoice_number"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Bid">
                                <b-form-input
                                    type="text"
                                    @change="save"
                                    v-model="my_order.bid"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Bid +/-">
                                <b-form-input
                                    type="number"
                                    @change="save"
                                    v-model="my_order.bid_plus_minus"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Invoice Number">
                                <b-form-input
                                    type="number"
                                    @change="save"
                                    v-model="my_order.invoice_number"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-container>
            </b-tab>
            <b-tab title="Renewing" v-if="isServiceOrder">
                <b-container fluid>
                    <b-row>
                        <b-col>
                            <b-form-group label="Renewable">
                                <b-form-checkbox
                                    @input="save"
                                    v-model="my_order.renewable"
                                    :value="true"
                                    :unchecked-value="false"
                                >
                                </b-form-checkbox>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Renewal Date">
                                <b-form-input
                                    type="date"
                                    @change="save"
                                    v-model="my_order.renewal_date"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Notification Lead(in days)">
                                <b-form-input
                                    type="text"
                                    @change="save"
                                    v-model="my_order.notification_lead"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Frequency">
                                <b-form-input
                                    type="text"
                                    @change="save"
                                    v-model="my_order.frequency"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Count" >
                                <b-form-input
                                    type="number"
                                    @change="save"
                                    v-model="renewal_interval.count"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Units" >
                                <b-form-select
                                    @input="save"
                                    :options="units"
                                    v-model="renewal_interval.unit"
                                    >
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Client Message">
                                <b-form-textarea
                                    type="text"
                                    @change="save"
                                    v-model="my_order.renewal_message"
                                    placeholder="It's time to renew your service."
                                >
                                </b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-container>
            </b-tab>
        </b-tabs>
        <b-button variant="danger" size="sm" @click="deleteOrder()">Delete Order</b-button>
        <b-button size="sm" v-show="showConvertButton" @click="convertOrder">{{ convertButtonLabel }}</b-button>
	</div>
</template>
<script>
import moment from 'moment'
import EditTasks from './EditTasks'
export default {
    name: 'EditServiceOrder',
	components: {
		'EditTasks': EditTasks
	},
	props: {
        properties: {required: true},
		order: {required: true},
		types: {required: true},
		statuses: {required: true},
		actions: {required: true},
		priorities: {required: true},
        categories: {required: true},
		task_types: {required: true},
		task_statuses: {required: true},
		task_actions: {required: true},
		task_categories: {required: true},
        tab_index: {default: 0}
	},
	data: function() {
		return {
			my_order: {},
			saving: false,
            my_tab_index: 0,
            order_interval: {
                count: null,
                unit: null
            },
            renewal_interval: {
                count: null,
                unit: null
            },
            units: [
                {
                    value: 'day',
                    text: 'Day'
                },
                {
                    value: 'week',
                    text: 'Week'
                },
                {
                    value: 'mon',
                    text: 'Month'
                },
                {
                    value: 'year',
                    text: 'Year'
                },
            ],
            intervals: [
                {
                    value: '1 day',
                    text: 'Daily'
                },
                {
                    value: '1 week',
                    text: 'Weekly'
                },
                {
                    value: '2 weeks',
                    text: 'Biweekly'
                },
                {
                    value: '1 month',
                    text: 'Monthly'
                },
                {
                    value: '3 months',
                    text: 'Quarterly'
                },
                {
                    value: '1 year',
                    text: 'Yearly'
                },
            ],
		};
	},
	created(){
		this.my_order = this.order;
        var properties = [];
        this.my_order.properties.forEach( p => {
            if(p.id){
                properties.push(p.id);
            }
            else{
                properties.push(p);
            }
        })
        this.my_order.properties = properties;
        if (this.my_order.properties.length > 0){
            this.my_order.property = this.my_order.properties[0];
        }
        if(this.my_order.order_interval != null){
            [this.order_interval.count, this.order_interval.unit] = this.my_order.order_interval.split(' ');
        }
        if(this.my_order.renewal_interval != null){
            [this.renewal_interval.count, this.renewal_interval.unit] = this.my_order.renewal_interval.split(' ');
        }
        this.my_order.order_status_id = this.my_order.order_status_id;
	},
	methods: {
        save(){
            var reload = false;
            if((this.my_order.approval_date != null) && (this.my_order.start_date == null)){
                this.my_order.start_date = this.my_order.approval_date;
            }
            if((this.my_order.date === null)||(this.my_order.name === null)||(this.my_order.description === null)){
                return;
            }
            if((this.order_interval.count != null) && (this.order_interval.unit != null)){
                this.my_order.order_interval = this.order_interval.count + ' ' + this.order_interval.unit;
            }
            if((this.renewal_interval.count != null) && (this.renewal_interval.unit != null)){
                this.my_order.renewal_interval = this.renewal_interval.count + ' ' + this.renewal_interval.unit;
            }
            
            
            
            if(this.my_order.id === null){
                this.$http.post('/order',this.my_order).then(response => {
                    this.my_order.id = response.data.id;
                })
            }
            else{
                var order = this.my_order;
                this.$http.patch('/order/'+this.my_order.id,this.my_order).then(response => {
                    if(reload){
                        this.$emit('reload-orders', order);
                    }
                })
            }
        },
        deleteOrder(){
            this.$http.delete('/order/' + this.my_order.id);
            this.$emit('remove-order', this.my_order);
        },
        changedTabs(tab_index){
            this.$emit('changed-order-tab', tab_index)
        },
        convertOrder(){
            if((this.my_order.order_status_type_id == 1) && (this.my_order.approval_date != "") && (this.my_order.approval_date != null) && (this.my_order.properties.length == 1)){
                this.my_order.property = this.my_order.properties[0];
                this.my_order.order_status_type_id = 2;
                reload = true;
            };
            if((this.my_order.order_status_type_id > 1) && (this.my_order.approval_date == "")){
                this.my_order.order_status_type_id = 1
                reload = true;
            };


            var pending_days_out = localStorage.getItem('pending_days_out');
            var today = moment();
            var start_date = moment(this.my_order.start_date);
            var days_out = today.diff(start_date, 'days')
            if((this.my_order.order_status_type_id < 3) && (days_out <= pending_days_out)){
                this.my_order.order_status_type_id = 3
                reload = true;
            };
            if((this.my_order.order_status_type_id == 3) && ((this.my_order.start_date == "") || (days_out > pending_days_out))){
                this.my_order.order_status_type_id = 2
                reload = true;
            };
            this.save();
        }
	},
	computed:{
        showConvertButton(){
            if((this.my_order.order_status_type_id == 1) && (this.my_order.approval_date != "") && (this.my_order.approval_date != null) && (this.my_order.properties.length == 1)){
                return true;
            }
            return false;
        },
        convertButtonLabel(){
            var pending_days_out = localStorage.getItem('pending_days_out');
            var today = moment();
            var start_date = moment(this.my_order.start_date);
            var days_out = start_date.diff(today, 'days')
            if(days_out <= pending_days_out){
                return "Convert To Work Order";
            }
            return "Convert To Pending Work Order";

        },
        isServiceOrder() {
            return this.my_order.order_status_type_id == 1;
        },
        current_actions() {
			return this.actions.filter(action => {
                for (var i=0; i < action.order_statuses.length; i++) {
                    if (action.order_statuses[i].id === this.my_order.order_status_id) {
                        return true;
                    }
                }
				return false;
			})
		},
	}
}
</script>