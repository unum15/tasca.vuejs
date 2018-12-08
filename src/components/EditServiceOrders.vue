<template>
	<div>
        <b-tabs vertical pills v-model="service_order_tab_index">
            <b-tab v-for="service_order in service_orders" :key="service_order.id" :title="'Service Order ' + (service_order.id !== null ? service_order.id : 'New')">
                <EditServiceOrder :service_order="service_order" :priorities="priorities" :types="types"  :statuses="statuses" :actions="actions" :categories="categories" :task_categories="task_categories" :task_statuses="task_statuses" :task_actions="task_actions" :task_types="task_types" :settings="settings" :new_service_order_saved="newServiceOrderSaved" :project_name='project_name'></EditServiceOrder>
            </b-tab>
        </b-tabs>
        <b-button variant="secondary" @click="newServiceOrder" :pressed="new_pressed">Add New Service Order</b-button>
    </div>
</template>
<script>
import moment from 'moment'
import EditServiceOrder from './EditServiceOrder'
export default {
    name: 'EditServiceOrders',
	components: {
		'EditServiceOrder': EditServiceOrder
	},
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
		task_types: {required: true},
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
		this.$http.get('/service_orders?project_id=' + this.project.id).then(response => {
      this.service_orders = response.data
    })
  },
	methods: {
		newServiceOrder(){
			this.new_service_orders++;
			var service_order = {
				id: null,
				project_id: this.project.id,
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
			this.service_orders = this.service_orders.filter(x => x !== service);
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
			this.service_order_tab_index = this.service_orders.length-1;
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