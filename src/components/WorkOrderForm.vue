<template>
	<div>
        <b-tabs>
            <b-tab title="General">
                <b-form-group label="Completion Date">
                    <b-form-input
                        type="date"
                        v-model="work_order.completion_date"
                        required
                    >
                    </b-form-input>
                </b-form-group>
                <b-form-group label="Expiration Date">
                    <b-form-input
                        type="date"
                        v-model="work_order.expiration_date"
                        required
                    >
                    </b-form-input>
                </b-form-group>
                <b-form-group label="Priority">
                    <b-form-select
                        :options="priorities"
                        value-field="id"
                        text-field="name"
                        v-model="work_order.priority">
                    </b-form-select>
                </b-form-group>
                <b-form-group label="Type">
                    <b-form-select
                        :options="types"
                        value-field="id"
                        text-field="name"
                        v-model="work_order.type">
                    </b-form-select>
                </b-form-group>
            </b-tab>
            <b-tab title="Calendar">
                <b-form-group label="Crew">
                    <b-form-input
                        type="number"
                        v-model="work_order.crew"
                    >
                    </b-form-input>
                </b-form-group>
                <b-form-group label="Total Hours">
                    <b-form-input
                        type="number"
                        v-model="work_order.total_hours"
                    >
                    </b-form-input>
                </b-form-group>
            </b-tab>
            <b-tab title="Tasks">
                <EditTasks :tasks="work_order.tasks" :task_categories="task_categories" :task_statuses="task_statuses" :task_actions="task_actions"></EditTasks>
            </b-tab>
            <b-tab title="Notes">
                <b-form-group label="Location">
                    <b-form-textarea
                        v-model="work_order.notes"
                        :rows="3"
                        :max-rows="6"
                        placeholder="North west corner.">
                    </b-form-textarea>
                </b-form-group>
                <b-form-group label="Instructions">
                    <b-form-textarea
                        v-model="work_order.instructions"
                        :rows="3"
                        :max-rows="6"
                        placeholder="Instructions for work order.">
                    </b-form-textarea>
                </b-form-group>
                <b-form-group label="Notes">
                    <b-form-textarea
                        v-model="work_order.notes"
                        :rows="3"
                        :max-rows="6"
                        placeholder="Notes about this work order.">
                    </b-form-textarea>
                </b-form-group>
            </b-tab>
            <b-tab title="Billing">
                <b-form-group label="PO Number">
                    <b-form-input
                        type="text"
                        v-model="work_order.po_number"
                        required
                    >
                    </b-form-input>
                </b-form-group>
                <b-form-group label="Budget">
                    <b-form-input
                        type="text"
                        v-model="work_order.budget"
                        required
                    >
                    </b-form-input>
                </b-form-group>
                <b-form-group label="Budget +/-">
                    <b-form-input
                        type="number"
                        v-model="work_order.budget_plus_minus"
                        required
                    >
                    </b-form-input>
                </b-form-group>
                <b-form-group label="Budget Invoice Number">
                    <b-form-input
                        type="text"
                        v-model="work_order.budget_invoice_number"
                        required
                    >
                    </b-form-input>
                </b-form-group>
                <b-form-group label="Bid">
                    <b-form-input
                        type="text"
                        v-model="work_order.bid"
                        required
                    >
                    </b-form-input>
                </b-form-group>
                <b-form-group label="Bid +/-">
                    <b-form-input
                        type="text"
                        v-model="work_order.bid_plus_minus"
                        required
                    >
                    </b-form-input>
                </b-form-group>
                <b-form-group label="Invoice Number">
                    <b-form-input
                        type="number"
                        v-model="work_order.number"
                        required
                    >
                    </b-form-input>
                </b-form-group>
            </b-tab>
        </b-tabs>
        <b-button variant="danger" size="sm" @click="deleteWorkOrder()">Delete Work Order</b-button>
	</div>
</template>
<script>
import EditTasks from './EditTasks'
export default {
    name: 'WorkOrderForm',
	components: {
		'EditTasks': EditTasks
	},
	props: {
		work_order: {required: true},
		types: {required: true},
		priorities: {required: true},
		task_categories: {required: true},
		task_statuses: {required: true},
		task_actions: {required: true},
	},
	data() {
		return {
			my_work_order: {}
		};
	},
	created() {
        this.my_work_order = this.work_order;
    },
	methods: {
		removeWorkOrder: function(){
		},
	}
}
</script>