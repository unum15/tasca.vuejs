<template>
	<b-container>
		<b-form-group label="Project Name">
			<b-form-input
				type="text"
				v-model="my_project.name"
				required
				:class="my_project.name == null ? 'invalid' : ''"
				placeholder="Smith's Remodel"
				>
			</b-form-input>
		</b-form-group>
		<div class="row">
			<div class="col">
				<b-form-group label="Property">
					<b-form-select
						:options="properties"
						value-field="id"
						text-field="name"
						required
						:class="my_project.property_id == null ? 'invalid' : ''"
						v-model="my_project.property_id"
						>
					</b-form-select>
				</b-form-group>
			</div>
			<div class="col">
				<b-form-group label="Contact">
					<b-form-select
						:options="contacts"
						value-field="id"
						text-field="name"
						required
						:class="my_project.contact_id == null ? 'invalid' : ''"
						v-model="my_project.contact_id"
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
						v-model="my_project.open_date"
						>
					</b-form-input>
				</b-form-group>
				<b-form-group label="Close Date">
					<b-form-input
						type="date"
						v-model="my_project.close_date"
						>
					</b-form-input>
				</b-form-group>
				<b-form-group label="Notes">
					<b-form-textarea
						v-model="my_project.notes"
						:rows="3"
						:max-rows="6"
						placeholder="Notes about this project."
						>
					</b-form-textarea>
				</b-form-group>
			</b-tab>
			<b-tab v-if="my_project.id != null" title="Service Orders" active>
				<EditServiceOrders :project="my_project" :priorities="service_order_priorities" :types="service_order_types"  :statuses="service_order_statuses" :actions="service_order_actions" :categories="service_order_categories" :task_categories="task_categories" :task_statuses="task_statuses" :task_actions="task_actions" :task_types="task_types" :settings="settings"></EditServiceOrders>
			</b-tab>
			<b-tab v-if="my_project.id != null" title="Pending Work Orders">
				<EditWorkOrders :project="my_project" :priorities="service_order_priorities" :types="service_order_types"  :task_categories="task_categories" :task_statuses="task_statuses" :task_actions="task_actions" :task_types="task_types"></EditWorkOrders>
			</b-tab>
			<b-tab v-if="my_project.id != null" title="Work Orders">
				<EditWorkOrders :project="my_project" :types="service_order_types"  :priorities="service_order_priorities" :task_categories="task_categories" :task_statuses="task_statuses" :task_actions="task_actions" :task_types="task_types"></EditWorkOrders>
			</b-tab>
		</b-tabs>
	</b-container>
</template>
<script>
import EditServiceOrders from './EditServiceOrders'
import EditWorkOrders from './EditWorkOrders'
export default {
    name: 'EditProject',
    components: {
        'EditServiceOrders': EditServiceOrders,
        'EditWorkOrders': EditWorkOrders
    },
	props: {
        contacts: {required: true},
        properties: {required: true},
        settings: {required: true},
        project: {required: true}
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
			task_types: [],
			my_project: null
		};
	},
	created() {
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
		this.$http.get('/task_types').then(response => {
			this.task_types = response.data;
		});
        this.my_project=this.project;
    },
	methods: {
	},
	watch: {
		project:{
			handler(){
			if((this.my_project.name === null) || (this.my_project.property_id === null) || (this.my_project.contact_id === null)){
				return;
			}
            if(this.my_project.id == null){
                console.log('post project');
                this.$http.post('/project',this.my_project).then(response => {
                    this.project.id = response.data.id;
                })
            }
            else{
                console.log('patch project ' + this.my_project.id)
                this.$http.patch('/project/' + this.my_project.id, this.my_project)
            }
		},
		deep: true
		}
		
	}
}
</script>