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
						:class="my_project.property_id === null ? 'invalid' : ''"
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
						:class="my_project.contact_id === null ? 'invalid' : ''"
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
			<b-tab v-for="billing_type in order_billing_types" :key="billing_type.id" :title="billing_type.name">
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
				>
				</EditOrders>
			</b-tab>
		</b-tabs>
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
			my_project: null
		};
	},
	created() {
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