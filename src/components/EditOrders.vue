<template>
	<div>
		<b-container fluid>
			<b-form-row>
				<b-col>
          <b-form-group  :label-cols="10" label="Show Closed">
            <b-form-checkbox
              v-model="filter.completed"
            >
            </b-form-checkbox>
          </b-form-group>
				</b-col>
				<b-col>
					<b-form-group  :label-cols="10" label="Show Expired">
            <b-form-checkbox
              v-model="filter.expired"
            >
            </b-form-checkbox>
          </b-form-group>
				</b-col>
			</b-form-row>
    </b-container>
        <b-tabs vertical pills v-model="current_tab">
            <b-tab
							v-for="(order, index) in orders"
							:key="index"
							v-if="showTab(order)"
							:active="isActive(index)"
							>
								<template slot="title" style="text-align:left">
									<div style="text-align:left">
										{{ order.name !== null ? order.name : 'Order New' }}
									</div>
								</template>
                <EditOrder
									:crews="crews"
									:properties="properties"
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
									@changed-order-tab="changedOrderTab"
									@reload-orders="reloadOrders"
								>
								</EditOrder>
            </b-tab>
        </b-tabs>
        <b-button variant="secondary" @click="newOrder" >Add New {{ order_status_type.name }}</b-button>
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
		crews: {required: true},
		project: {required: true},
		order_status_type: {required: true},
		types: {required: true},
		statuses: {required: true},
		actions: {required: true},
		categories: {required: true},
		priorities: {required: true},
		properties: {required: true},
		task_categories: {required: true},
		task_statuses: {required: true},
		task_actions: {required: true},
		task_types: {required: true},
		settings: {required: true},
		default_property_id: {required: true},
		reload_count: {default: 0},
		order_id: {default: null},
    task_id: {default: null},
	},
	data() {
		return {
			orders: [],
			current_tab: 0,
			change_tab: false,
			filter: {
				completed: false,
				expired: false
			},
			default_service_window: 7
		};
	},
	created() {
		this.loadOrders();
		this.default_service_window = localStorage.getItem('default_service_window');
  },
	methods: {
		newOrder(){
			var order = {
				id: null,
				name: null,
				project_id: this.project.id,
				order_status_type_id: this.order_status_type.id,
				date: this.today,
				approval_date: this.order_status_type.id == 1 ? null : this.today,
				start_date: this.order_status_type.id < 3 ? null: this.today,
				completion_date: null,
				expiration_date: null,
				description: null,
				category_id: null,
				location: null,
				instructions: null,
				order_category_id: this.settings.default_order_category_id,
				order_priority_id: this.settings.default_order_priority_id,
				order_type_id: this.settings.default_order_type_id,
				order_status_id: this.settings.default_order_status_id,
				order_action_id: this.settings.default_order_action_id,
				properties: [ { id: this.default_property_id } ],
				recurrences: 1,
				renewable: false,
				service_window: this.default_service_window,
				notes: null,
				tasks: []
				
			};
			this.orders.push(order);
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
		},
		changedOrderTab(tab_index){
			this.$emit('changed-order-tab', tab_index);
		},
		reloadOrders(order){
			this.$emit('reload-orders', order);
		},
		loadOrders(){
			this.orders = [];
			this.$http.get('/orders?project_id=' + this.project.id + '&order_status_type_id=' + this.order_status_type.id).then(response => {
				this.orders = response.data
			})
		},
		isActive (index) {
      if((this.change_tab)&&(index == this.orders.length -1)){
        return true
      }
			if(this.order_id == this.orders[index].id){
				this.$emit('set-order-tab', this.orders[index])
        return true;
      }
      return false
    },
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
  watch:{
		reload_count() {
			this.change_tab = true;
			this.loadOrders();
		},
  },
}
</script>