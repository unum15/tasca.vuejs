<template>
<b-container>
            <b-row>
            <b-col cols="8">
	<b-container>
		<b-form-group label="Project Name">
			<b-form-input
				type="text"
				@change="save"
				v-model="my_project.name"
				required
				:state="my_project.name != null"
				placeholder="Smith's Remodel"
				>
			</b-form-input>
		</b-form-group>
		<div class="row">
			<div class="col">
				<b-form-group label="Property">
					<b-form-select
						@change="save"
						:options="properties"
						value-field="id"
						text-field="name"
						required
						:state="my_project.property_id != null"
						v-model="my_project.property_id"
						>
					</b-form-select>
				</b-form-group>
			</div>
			<div class="col">
				<b-form-group label="Contact">
					<b-form-select
						@change="save"
						:options="contacts"
						value-field="id"
						text-field="name"
						required
						:state="my_project.contact_id != null"
						v-model="my_project.contact_id"
						>
					</b-form-select>
				</b-form-group>
			</div>
		</div>
		<b-tabs @input="changedProjectTab">
			<b-tab title="General">
				<b-form-group label="Open Date">
					<b-form-input
						type="date"
						@change="save"
						v-model="my_project.open_date"
						>
					</b-form-input>
				</b-form-group>
				<b-form-group label="Close Date">
					<b-form-input
						type="date"
						@change="save"
						v-model="my_project.close_date"
						>
					</b-form-input>
				</b-form-group>
				<b-form-group label="Notes">
					<b-form-textarea
						@input="save"
						v-model="my_project.notes"
						:rows="3"
						:max-rows="6"
						placeholder="Notes about this project."
						>
					</b-form-textarea>
				</b-form-group>
			</b-tab>
			<b-tab v-if="my_project.id" v-for="billing_type in order_billing_types" :key="billing_type.id" :title="billing_type.name">
				<EditOrders
					:project="my_project"
					:settings="settings"
					:order_billing_type="billing_type"
					:actions="order_actions"
					:categories="order_categories"
					:priorities="order_priorities"
					:statuses="order_statuses"
					:types="order_types"	
					:task_actions="task_actions"
					:task_categories="task_categories"
					:task_statuses="task_statuses"
					:task_types="task_types"
					@changedOrderTab="changedOrderTab"
				>
				</EditOrders>
			</b-tab>
		</b-tabs>
		<b-row>
			<b-button variant="danger" size="sm" @click="deleteProject" v-if="my_project.id">Delete Project</b-button>
        </b-row>
	</b-container>
	</b-col>
    <b-col v-if="settings.help_show == 'true'">
	  <p class="card-text">
		{{ settings.help_project }}
	  </p>
	  <p class="card-text">
		{{ help_order }}
		</p>
		
		<p class="card-text">
			{{ help_task }}
		</p>
    </b-col>
    </b-row>
    </b-container>
</template>
<script>
import EditOrders from './EditOrders'
export default {
    name: 'EditProject',
    components: {
        'EditOrders': EditOrders
    },
	props: {
        contacts: {required: true},
        properties: {required: true},
        settings: {required: true},
        project: {required: true},
		order_billing_types: {required: true},
		order_actions: {required: true},
		order_categories: {required: true},
		order_statuses: {required: true},
		order_types: {required: true},		
		order_priorities: {required: true},
		task_actions: {required: true},
		task_categories: {required: true},
		task_statuses: {required: true},
		task_types: {required: true}
	},
	data() {
		return {
			my_project: null,
			help_order: null,
			help_task: null,
			tab_index: 0
		};
	},
	created() {
        this.my_project=this.project;
    },
	methods: {
		deleteProject () {
		  this.$http.delete('/project/' + this.my_project.id);
		  this.$emit('remove-project', this.my_project);
		},
		save() {
			if((this.my_project.name === null) || (this.my_project.property_id === null) || (this.my_project.contact_id === null)){
				return;
			}
            if(this.my_project.id == null){
                this.$http.post('/project',this.my_project).then(response => {
                    this.project.id = response.data.id;
                })
            }
            else{
                this.$http.patch('/project/' + this.my_project.id, this.my_project)
            }
		},
		changedProjectTab(tab_index){
			console.log(tab_index);
			switch(tab_index){
				case 1:
					this.help_order = this.settings.help_service_order
					break;
				case 2:
					this.help_order = this.settings.help_pending_work_order
					break;
				case 3:
					this.help_order = this.settings.help_work_order
					break;
				default:
					this.help_order = ''
			}
		},
		changedOrderTab(tab_index){
			console.log(tab_index);
			switch(tab_index){
				case 1:
					this.help_task = this.settings.help_service_order
					break;
				default:
					this.help_task = ''
			}
		}
	}
}
</script>