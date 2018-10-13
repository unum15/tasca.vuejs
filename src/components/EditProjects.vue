<template>
	<b-container>
		<b-form-group label="Project Name">
			<b-form-input
				type="text"
				v-model="project.name"
				required
				placeholder="Smith's Remodel"
				id="project_name"
				>
			</b-form-input>
		</b-form-group>
		<div class="row">
			<div class="col">
				<b-form-group label="Property">
					<b-form-select
						:disabled="properties.length > 0 ? false : true"
						:options="properties"
						value-field="id"
						text-field="name"
						required
						v-model="project.property_id"
						>
					</b-form-select>
				</b-form-group>
			</div>
			<div class="col">
				<b-form-group label="Contact">
					<b-form-select
						:disabled="contacts.length > 0 ? false : true"
						:options="contacts"
						value-field="id"
						text-field="name"
						required
						v-model="project.contact_id"
						>
					</b-form-select>
				</b-form-group>
			</div>
		</div>
		</form>
		<b-tabs>
			<b-tab title="General">
				<b-form-group label="Open Date">
					<b-form-input
						type="date"
						v-model="project.open_date"
						>
					</b-form-input>
				</b-form-group>
				<b-form-group label="Close Date">
					<b-form-input
						type="date"
						v-model="project.close_date"
						>
					</b-form-input>
				</b-form-group>
				<b-form-group label="Notes">
					<b-form-textarea
						v-model="project.notes"
						:rows="3"
						:max-rows="6"
						placeholder="Notes about this project."
						>
					</b-form-textarea>
				</b-form-group>
			</b-tab>
			<b-tab title="Service Orders" active>
				<EditServiceOrders :project="project" :priorities="service_order_priorities" :types="service_order_types"  :statuses="service_order_statuses" :actions="service_order_actions" :categories="service_order_categories" :task_categories="task_categories" :task_statuses="task_statuses" :task_actions="task_actions" :settings="settings"></EditServiceOrders>
			</b-tab>
			<b-tab title="Pending Work Orders">
				<EditWorkOrders :work_orders="project.pending_work_orders" :priorities="service_order_priorities" :types="service_order_types"  :task_categories="task_categories" :task_statuses="task_statuses" :task_actions="task_actions"></EditWorkOrders>
			</b-tab>
			<b-tab title="Work Orders">
				<EditWorkOrders :work_orders="project.work_orders" :types="service_order_types"  :priorities="service_order_priorities" :task_categories="task_categories" :task_statuses="task_statuses" :task_actions="task_actions"></EditWorkOrders>
			</b-tab>
		</b-tabs>
	</b-container>
</template>
<script>
import EditServiceOrders from './EditServiceOrders'
import EditWorkOrders from './EditWorkOrders'
export default {
    name: 'EditProjects',
    components: {
        'EditServiceOrders': EditServiceOrders,
        'EditWorkOrders': EditWorkOrders
    },
	props: {
        contacts: {required: true},
        properties: {required: true},
        settings: {required: true}
	},
	data() {
		return {
			service_order_types: [],
			service_order_priorities: [],
			service_order_actions: [],
			service_order_statuses: [],
			service_order_categories: [],
			task_categories: [],
			task_statuses: [],
			task_actions: [],
			project: {
				id: null,
				name: null,
				property_id: null,
				contact_id: null,
				open_date: null,
		        close_date: null,
				notes: null,
				service_orders: [],
				pending_work_orders: [],
				work_orders: [],
			}
		};
	},
	mounted() {		
		this.project.open_date = this.today;
		this.$http.get('/service_order_priorities').then(response => {
			this.service_order_priorities = response.data;
		});
		this.$http.get('/service_order_types').then(response => {
			this.service_order_types = response.data;
		});
		this.$http.get('/service_order_statuses').then(response => {
			this.service_order_statuses = response.data;
		});
		this.$http.get('/service_order_actions').then(response => {
			this.service_order_actions = response.data;
		});
		this.$http.get('/service_order_categories').then(response => {
			this.service_order_categories = response.data;
		});
		this.$http.get('/task_categories').then(response => {
			this.task_categories = response.data;
		});
		this.$http.get('/task_statuses').then(response => {
			this.task_statuses = response.data;
		});
		this.$http.get('/task_actions').then(response => {
			this.task_actions = response.data;
		});
    },
	computed: {
		today(){
			var today = new Date();
			return today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		}
	},
	methods: {
	},
	watch: {
		project:{
			handler(){
			if(this.project.property_id === null){
				return;
			}			
			this.$http.post('/project',this.project).then(response => {
					this.project.id = response.data.id;
				})
				.catch(error => {
					console.log(error);
					alert(error.response.data.message);
				});
			},		
			deep: true
		}
		
	}
}
</script>