<template>
    <div>
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
        <b-form-group label="Properties"  v-if="isServiceOrder">
            <b-form-select
                @input="save"
                :options="properties"
                value-field="id"
                text-field="name"
                required
                :state="my_order.properties.length != 0"
                v-model="my_order.properties"
                multiple
                >
            </b-form-select>
        </b-form-group>
        <b-tabs @input="changedTabs" v-model="my_tab_index" :key="order.id">
            <b-tab title="Detail">
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
                            <b-form-group label="Description">
                                <b-form-input
                                    @change="save"
                                    v-model="my_order.description"
                                    placeholder="What needs to be done?"
                                    required
                                    ref='description'
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
                            <b-form-group label="Status" v-if="(order.order_status_type_id==1)">
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
                            <b-form-group label="Action" v-if="(order.order_status_type_id==1)">
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
                </b-container>
            </b-tab>
            <b-tab title="Calendar" v-if="my_order.id !== null">
                <b-container fluid>
                    <b-row>
                        <b-col>
                            <b-form-group label="Order Date">
                                <b-form-input
                                    type="date"
                                    @change="save"
                                    v-model="my_order.date"
                                    required
                                    :state="my_order.date != null"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Close Date" v-if="order.order_status_type_id!=2">
                                <b-form-input
                                    type="date"
                                    @change="save"
                                    v-model="my_order.completion_date"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Expiration Date">
                                <b-form-input
                                    type="date"
                                    @change="save"
                                    v-model="my_order.expiration_date"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Approval Date">
                                <b-form-input
                                    type="date"
                                    @change="updateStartDate();"
                                    @input="save();"
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
                    </b-row>
                    <b-row v-if="(order.order_status_type_id==1)" style="border: 1px solid black;">
                        <b-col>
                            <b-form-group label="">
                                <b-form-checkbox
                                    @input="save"
                                    v-model="my_order.recurring"
                                    :value="true"
                                    :unchecked-value="false"
                                >
                                </b-form-checkbox>
                                <div>Recurrences</div>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="">
                                <b-form-input
                                    type="number"
                                    @change="save"
                                    v-model="my_order.recurrences"
                                >
                                </b-form-input>
                                <div>Times</div>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="">
                                <b-form-input
                                    type="number"
                                    @change="save"
                                    v-model="recurring_interval.count"
                                >
                                </b-form-input>
                                <div>Every</div>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="">
                                <b-form-select
                                    @input="save"
                                    :options="units"
                                    v-model="recurring_interval.unit"
                                    >
                                </b-form-select>
                                <div>Frequency</div>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-container>
            </b-tab>
            <b-tab title="Tasks" v-if="my_order.id !== null" :active="task_id != null">
                <EditTasks
                    v-if="my_order.id != null"
                    :crews="crews"
                    :order="my_order"
                    :task_types="task_types"
                    :task_statuses="task_statuses"
                    :task_actions="task_actions"
                    :task_categories="task_categories"
                    :task_id="task_id"
                    :settings="settings"
                    :project_close_date="project_close_date"
                    >
                </EditTasks>
            </b-tab>
            <b-tab title="Comments" v-if="my_order.id !== null">
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
            <b-tab title="Billing"  v-if="my_order.id !== null">
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
            <b-tab title="Overview"  v-if="my_order.id !== null">
                <ViewScheduleOrderPopup
                    :order_id="my_order.id"
                >
                </ViewScheduleOrderPopup>
            </b-tab>
            <b-tab title="Renewing" v-if="isServiceOrder && (my_order.id !== null)">
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
                                    type="number"
                                    @change="save"
                                    v-model="my_order.notification_lead"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Times">
                                <b-form-input
                                    type="number"
                                    @change="save"
                                    v-model="my_order.renewal_count"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Every" >
                                <b-form-input
                                    type="number"
                                    @change="save"
                                    v-model="renewal_interval.count"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Frequency" >
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
                                    @input="save"
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
        <b-button size="sm" v-show="showCreateButton" @click="createOrders">{{ createButtonLabel }}</b-button>
	</div>
</template>
<script>
import moment from 'moment';
import EditTasks from './EditTasks';
import ViewScheduleOrderPopup from './ViewScheduleOrderPopup';
export default {
    name: 'EditServiceOrder',
	components: {
		'EditTasks': EditTasks,
        'ViewScheduleOrderPopup': ViewScheduleOrderPopup
	},
	props: {
        crews: {required: true},
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
        task_id: {default: null},
        tab_index: {default: 0},
        project_close_date: {default: null},
        settings: {required: true}
	},
	data: function() {
		return {
			my_order: {},
			saving: false,
            reload: false,
            my_tab_index: 0,
            recurring_interval: {
                count: null,
                unit: null
            },
            renewal_interval: {
                count: null,
                unit: null
            },
            task_name: null,
            units: [
                {
                    value: 'days',
                    text: 'Days'
                },
                {
                    value: 'weeks',
                    text: 'Weeks'
                },
                {
                    value: 'months',
                    text: 'Months'
                },
                {
                    value: 'years',
                    text: 'Years'
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
        if(this.my_order.recurring_interval != null){
            [this.recurring_interval.count, this.recurring_interval.unit] = this.my_order.recurring_interval.split(' ');
            this.recurring_interval.unit = this.formatUnit(this.recurring_interval.unit);
        }
        if(this.my_order.renewal_interval != null){
            [this.renewal_interval.count, this.renewal_interval.unit] = this.my_order.renewal_interval.split(' ');
            this.renewal_interval.unit = this.formatUnit(this.renewal_interval.unit);
        }
	},
	methods: {
        save(){
            if((this.my_order.name != null) && (this.my_order.description == null)){
                this.my_order.description = this.my_order.name;
            }
            if((this.my_order.date === null)||(this.my_order.name === null)||(this.my_order.description === null)){
                return;
            }
            if((this.my_order.properties.length === 0)&&(this.my_order.property == null)){
                return;
            }
            if((this.recurring_interval.count != null) && (this.recurring_interval.unit != null)){
                this.my_order.recurring_interval = this.recurring_interval.count + ' ' + this.recurring_interval.unit;
            }
            if((this.renewal_interval.count != null) && (this.renewal_interval.unit != null)){
                this.my_order.renewal_interval = this.renewal_interval.count + ' ' + this.renewal_interval.unit;
            }
            
            
            
            if(this.my_order.id === null){
                this.$http.post('/order',this.my_order).then(response => {
                    this.task_name = this.my_order.name;
                    this.my_order.id = response.data.id;
                    this.$nextTick(() => this.$refs.description.$el.focus());
                })
            }
            else{
                var order = this.my_order;
                this.$http.patch('/order/'+this.my_order.id,this.my_order).then(() => {
                    if(this.reload){
                        this.$emit('reload-orders', order);
                        this.reload = false;
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
                this.reload = true;
            }
            if((this.my_order.order_status_type_id > 1) && (this.my_order.approval_date === null)){
                this.my_order.order_status_type_id = 1
                this.reload = true;
            }


            var pending_days_out = localStorage.getItem('pending_days_out');
            var today = moment();
            var start_date = moment(this.my_order.start_date);
            var days_out = start_date.diff(today, 'days')
            if((this.my_order.order_status_type_id < 3) && (days_out <= pending_days_out)){
                this.my_order.order_status_type_id = 3
                this.reload = true;
            }
            if((this.my_order.order_status_type_id == 3) && ((this.my_order.start_date == "") || (days_out > pending_days_out))){
                this.my_order.order_status_type_id = 2
                this.reload = true;
            }
            //this.save(); I don't need this and I don't know why.
        },
        createOrders(){
            this.$http.post('/order/convert/'+this.my_order.id,this.my_order).then(response => {
                this.$emit('reload-orders', response.data[0]);
                this.reload = false;
            })
        },
        formatUnit(unit) {
            if(unit.substring(0,3) == 'mon'){
                unit = 'months'
            }
            if(unit.substring(unit.length - 1) != 's'){
                unit = unit + 's'; 
            }
            return unit;
        },
        updateStartDate(){
            if((this.my_order.approval_date != null) && (this.my_order.start_date == null)){
                this.my_order.start_date = this.my_order.approval_date;
            }
            if((this.my_order.approval_date === '') || (this.my_order.approval_date === null)){
                this.my_order.approval_date = null;
                this.my_order.start_date = null;
            }
        }
	},
	computed:{
        showConvertButton(){
            if((this.my_order.renewable) || (this.my_order.recurring)){
                return false;
            }
            if((this.my_order.order_status_type_id == 1) && (this.my_order.approval_date != "") && (this.my_order.approval_date != null) && (this.my_order.properties.length == 1)){
                    return true;
            }
            if((this.my_order.order_status_type_id > 1) && (this.my_order.approval_date === null)){
                return true;
            }
            var pending_days_out = localStorage.getItem('pending_days_out');
            var today = moment();
            var start_date = moment(this.my_order.start_date);
            var days_out = start_date.diff(today, 'days')
            if((this.my_order.order_status_type_id < 3) && (days_out <= pending_days_out)){
                return true;
            }
            if((this.my_order.order_status_type_id == 3) && ((this.my_order.start_date == "") || (days_out > pending_days_out))){
                return true;
            }
            return false;
        },
        showCreateButton(){
            if(this.my_order.completed_date != null){
                return false;
            }
            if(this.my_order.order_status_type_id > 1){
                return false;
            }
            if(this.my_order.approval_date == null){
                return false;
            }
            if(this.my_order.properties.length == 0){
                return false;
            }
            if((!this.my_order.renewable) && (!this.my_order.recurring)){
                return false;
            }
            return true;
        },
        convertButtonLabel(){
            if(this.my_order.approval_date === null){
                return "Convert To Service Order";
            }
            var pending_days_out = localStorage.getItem('pending_days_out');
            var today = moment();
            var start_date = moment(this.my_order.start_date);
            var days_out = start_date.diff(today, 'days')
            if(days_out <= pending_days_out){
                return "Convert To Work Order";
            }
            return "Convert To Pending Work Order";

        },
        createButtonLabel(){
            return "Create Work Order(s)";
        },
        isServiceOrder() {
            return this.my_order.order_status_type_id == 1;
        },
        current_actions() {
			return this.actions.filter(action => {
                for (var i=0; i < action.order_statuses.length; i++) {
                    if (action.order_statuses[i].id == this.my_order.order_status_id) {
                        return true;
                    }
                }
				return false;
			})
		},
	},
    watch:{
        project_close_date(date){
            if(!this.my_order.completion_date){
                this.my_order.completion_date = date;
            }
        }
    }
}
</script>