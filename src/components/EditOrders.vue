<template>
	<div>
		<div style="width:10%;text-align:center;">
          <b-form-group label="Show Completed">
            <b-form-checkbox
              v-model="filter.completed"
            >
            </b-form-checkbox>
          </b-form-group>
					<b-form-group label="Show Expired">
            <b-form-checkbox
              v-model="filter.expired"
            >
            </b-form-checkbox>
          </b-form-group>
    </div>
        <b-tabs vertical pills v-model="order_tab_index">
            <b-tab
							v-for="order in orders"
							:key="order.id"
							:title="order.name !== null ? order.name : 'Order ' + (order.id !== null ? order.id : 'New')"
							v-if="showTab(order)"
							>
                <EditOrder
									:order="order"
									:priorities="priorities"
									:types="types"
									:statuses="statuses"
									:actions="actions"
									:categories="categories"
									:task_categories="task_categories"
									:task_statuses="task_statuses"
									:task_actions="task_actions"
									:task_types="task_types"
									:settings="settings"
									:project_name="project_name"
									@remove-order="removeOrder"
								>
								</EditOrder>
            </b-tab>
        </b-tabs>
        <b-button variant="secondary" @click="newOrder" :pressed="new_pressed">Add New Order</b-button>
    </div>
</template>
<script>
import moment from 'moment'
import EditOrder from './EditOrder'
export default {
    name: 'EditOrders',
	components: {
		'EditOrder': EditOrder
	},
	props: {
		project: {required: true},
		order_billing_type: {required: true},
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
			orders: [],
			order_tab_index: 0,
			new_orders: 0,
			new_pressed: false,
			change_tab: false,
			filter: {
				completed: false,
				expired: false
			}
		};
	},
	created() {
		this.$http.get('/orders?project_id=' + this.project.id + '&order_billing_type_id=' + this.order_billing_type.id).then(response => {
      this.orders = response.data
    })
  },
	methods: {
		newOrder(){
			this.new_orders++;
			var order = {
				id: null,
				name: null,
				project_id: this.project.id,
				order_billing_type_id: this.order_billing_type.id,
				date: this.today,
				approval_date: null,
				completion_date: null,
				expiration_date: null,
				description: null,
				category_id: null,
				location: null,
				instructions: null,
				order_category_id: this.settings.default_order_category_id.value,
				order_priority_id: this.settings.default_order_priority_id.value,
				order_type_id: this.settings.default_order_type_id.value,
				order_status_id: this.settings.default_order_status_id.value,
				order_action_id: this.settings.default_order_action_id.value,
				start_date: this.today,
				recurrences: 0,
				renewable: false,
				window: 4,
				notes: null,
				tasks: []
				
			};
			this.orders.push(order);
			this.new_pressed = false;
			this.change_tab = true;
		},
		removeOrder(order) {
			this.orders = this.orders.filter(o => o.id !== order.id);
		},
		showTab(order){
			var show = true;
			if((!this.filter.completed)&&(order.completion_date != null)){
				show = false;
			}
			if((!this.filter.expired)&&(order.expiration_date != null)&&(order.expiration_date < this.today)){
				show = false;
			}
			return show;
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
			this.order_tab_index = this.orders.length-1;
			this.change_tab =  false;
		}
  },
  watch:{
	settings() {
		if(this.settings.length !== 0){
			this.newOrder();
		}
	}
  }
}
</script>