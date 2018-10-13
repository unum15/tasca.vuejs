<template>
	<div>
        <b-tabs vertical pills v-model="service_order_tab_index">
            <b-tab v-for="service_order in service_orders" :key="service_order.id" :title="'Service Order ' + service_order.id">
                <service-order :service_order="service_order" :priorities="priorities" :types="types"  :statuses="statuses" :actions="actions" :categories="categories" :task_categories="task_categories" :task_statuses="task_statuses" :task_actions="task_actions" :settings="settings" :new_service_order_saved="newServiceOrderSaved" :project_name='project_name'></service-order>
            </b-tab>
        </b-tabs>
        <b-button variant="secondary" @click="newServiceOrder" :pressed="new_pressed">Add New Service Order</b-button>
    </div>
</template>
<script>
import moment from 'moment'
export default {
    name: 'EditServiceOrders',
	props: {
		project: {required: true},
		types: {required: true},
		statuses: {required: true},
		actions: {required: true},
		categories: {required: true},
		priorities: {required: true},
		task_categories: {required: true},
		task_statuses: {required: true},
		task_actions: {required: true},
		settings: {required: true}
	},
	data() {
		return {
			service_orders: [],
			service_order_tab_index: 0,
			new_service_orders: 0,
			new_pressed: false,
			change_tab: false
		};
	},
	created() {
    },
	methods: {
		newServiceOrder(){
			this.new_service_orders++;
			var service_order = {
				id: 'new-'+this.new_service_orders,
				date: this.today,
				approval_date: null,
				completion_date: null,
				expiration_date: null,
				description: null,
				category_id: null,
				location: null,
				instructions: null,
				service_order_category_id: this.settings.default_service_order_category_id.value,
				service_order_priority_id: this.settings.default_service_order_priority_id.value,
				service_order_type_id: this.settings.default_service_order_type_id.value,
				service_order_status_id: this.settings.default_service_order_status_id.value,
				service_order_action_id: this.settings.default_service_order_action_id.value,
				start_date: this.today,
				recurrences: 0,
				renewable: false,
				service_window: 4,
				notes: null,
				tasks: []
				
			};
			this.service_orders.push(service_order);
			this.new_pressed = false;
			this.change_tab = true;
		},
		deleteServiceOrder(service) {
			this.service_orders = this.my_service_orders.filter(x => x !== service);
		},
		createWorkOrder(service) {
			console.log('Create work order.');
			this.$emit('work_order', service);
		},
		createPendingWorkOrder(service) {
			console.log('Create pending work order.');
			this.$emit('pending_work_order', service);
		},
		newServiceOrderSaved(old_id, new_id) {
			this.service_orders.each(function(){
				if(this.id == old_id){
					this.id = new_id;
				}
			});
		}
	},  
	computed: {
		today() {
			return moment().format('YYYY-MM-DD');
		},
		project_id() {
			return this.project.id;
		},
		project_name() {
			if(this.project.id !== null){
				return this.project.name;
			}
			return null;
		},		
	},
  updated() {
		if(this.change_tab){
			this.service_order_tab_index = this.my_service_orders.length-1;
			this.change_tab =  false;
		}
  },
  watch:{
	settings() {
		if(this.settings.length !== 0){
			this.newServiceOrder();
		}
	}
  }
}
</script>