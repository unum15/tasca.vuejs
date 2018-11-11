<template>
    <div>
        <b-tabs>
            <b-tab title="General">
                <b-container>
                    <b-row>
                        <b-col>
                            <b-form-group label="Service Order Date">
                                <b-form-input
                                    type="date"
                                    v-model="my_service_order.date"
                                    required
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Approval Date">
                                <b-form-input
                                    type="date"
                                    v-model="my_service_order.approval_date"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Completion Date">
                                <b-form-input
                                    type="date"
                                    v-model="my_service_order.completion_date"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Expiration Date">
                                <b-form-input
                                    type="date"
                                    v-model="my_service_order.expiration_date"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Description">
                                <b-form-textarea
                                    v-model="my_service_order.description"
                                    :rows="3"
                                    :max-rows="6"
                                    placeholder="What needs to be done?"
                                    required
                                    >
                                </b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Category">
                                <b-form-select
                                    :options="types"
                                    value-field="id"
                                    text-field="name"
                                    v-model="my_service_order.category_id"
                                    required
                                    >
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Priority">
                                <b-form-select
                                    :options="priorities"
                                    value-field="id"
                                    text-field="name"
                                    v-model="my_service_order.service_order_priority_id"
                                    required
                                    >
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Type">
                                <b-form-select
                                    :options="types"
                                    value-field="id"
                                    text-field="name"
                                    v-model="my_service_order.service_order_type_id"
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
                                    :options="statuses"
                                    value-field="id"
                                    text-field="name"
                                    v-model="my_service_order.service_order_status_id"
                                    required
                                    >
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Action">
                                <b-form-select
                                    :options="actions"
                                    value-field="id"
                                    text-field="name"
                                    v-model="my_service_order.service_order_action_id"
                                    required
                                    >
                                </b-form-select>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-container>
            </b-tab>
            <b-tab title="Calendar">
                <b-container>
                    <b-row>
                        <b-col>
                            <b-form-group label="Start Date">
                                <b-form-input
                                    type="date"
                                    v-model="my_service_order.start_date"
                                    required
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Recurrences">
                                <b-form-input
                                    type="number"
                                    v-model="my_service_order.recurrences"
                                    required
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Service Window">
                                <b-form-input
                                    type="number"
                                    v-model="my_service_order.service_window"
                                    required
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-container>
            </b-tab>
            <b-tab title="Tasks">
                <EditTasks :order="service_order" :task_types="task_types" :task_statuses="task_statuses" :task_actions="task_actions"></EditTasks>
            </b-tab>
            <b-tab title="Notes">
                <b-form-group label="Location">
                    <b-form-textarea
                        v-model="my_service_order.location"
                        :rows="3"
                        :max-rows="6"
                        placeholder="North west corner.">
                    </b-form-textarea>
                </b-form-group>
                <b-form-group label="Instructions">
                    <b-form-textarea
                        v-model="my_service_order.instructions"
                        :rows="3"
                        :max-rows="6"
                        placeholder="Instructions service order.">
                    </b-form-textarea>
                </b-form-group>
                <b-form-group label="Notes">
                    <b-form-textarea
                        v-model="my_service_order.notes"
                        :rows="3"
                        :max-rows="6"
                        placeholder="Notes about this service order.">
                    </b-form-textarea>
                </b-form-group>
            </b-tab>
            <b-tab title="Billing">
                <b-container>
                    <b-row>
                        <b-col>
                            <b-form-group label="PO Number">
                                <b-form-input
                                    type="text"
                                    v-model="my_service_order.po_number"
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
                                    v-model="my_service_order.budget"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Budget +/-">
                                <b-form-input
                                    type="number"
                                    v-model="my_service_order.budget_plus_minus"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Budget Invoice Number">
                                <b-form-input
                                    type="text"
                                    v-model="my_service_order.budget_invoice_number"
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
                                    v-model="my_service_order.bid"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Bid +/-">
                                <b-form-input
                                    type="text"
                                    v-model="my_service_order.bid_plus_minus"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Invoice Number">
                                <b-form-input
                                    type="number"
                                    v-model="my_service_order.number"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-container>
            </b-tab>
            <b-tab title="Renewing">
                <b-container>
                    <b-row>
                        <b-col>
                            <b-form-group label="Renewable">
                                <b-form-checkbox
                                    v-model="my_service_order.renewable"
                                >
                                </b-form-checkbox>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Frequency">
                                <b-form-input
                                    type="text"
                                    v-model="my_service_order.frequency"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Renewal Date">
                                <b-form-input
                                    type="date"
                                    v-model="my_service_order.renewal_date"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Notification Lead(in days)">
                                <b-form-input
                                    type="text"
                                    v-model="my_service_order.notification_lead"
                                >
                                </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Client Message">
                                <b-form-textarea
                                    type="text"
                                    v-model="my_service_order.renewal_message"
                                    placeholder="It's time to renew your service."
                                >
                                </b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-container>
            </b-tab>
        </b-tabs>
        <b-button variant="secondary" size="sm" @click="createWorkOrder(service_order)" :disabled="!allowWorkOrder">Create Work Order</b-button>
        <b-button variant="secondary" size="sm" @click="createPendingWorkOrder(service_order)" :disabled="!allowWorkOrder">Create Pending Work Order</b-button>
        <b-button variant="danger" size="sm" @click="deleteServiceOrder(service_order)">Delete Service Order</b-button>
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
		service_order: {required: true},
		types: {required: true},
		statuses: {required: true},
		actions: {required: true},
		priorities: {required: true},
		task_types: {required: true},
		task_statuses: {required: true},
		task_actions: {required: true}
	},
	data: function() {
		return {
			my_service_order: null,
			saving: false,
		};
	},
	created(){
		this.my_service_order = this.service_order;
	},
	mounted() {
    },
	methods: {
	},
	computed:{
		allowWorkOrder: function(){
			return false;
		},
	},
	watch:{
		my_service_order:{
			handler(new_service_order, old_service_order){
                if(this.my_service_order.id === undefined){
                    this.$http.post('/service_order',this.my_service_order).then(response => {
                    	this.my_service_order.id = response.data.id;
                    })
                }
                else{
                    if(old_service_order === null){
                        return;
                    }
                    this.$http.patch('/service_order/'+this.my_service_order.id,this.my_service_order).then(response => {
                    	this.my_service_order.id = response.data.id;
                    })
                }
			},
			deep: true
		}
	}
}
</script>