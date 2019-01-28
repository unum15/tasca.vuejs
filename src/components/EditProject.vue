<template>
<div>
<template slot="title">
     i'm <i>Custom</i> <strong>Title</strong>
   </template>
<b-container fluid>
            <b-row>
            <b-col cols="8">
	<b-container fluid>
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
				<b-form-group label="Contact">
					<b-form-select
						@input="save"
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
		<b-tabs @input="changedProjectTab" v-model="currentTab">
			<b-tab title="General">
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
			</b-tab>
			<b-tab v-if="my_project.id" v-for="status_type in order_status_types" :key="status_type.id" :title="status_type.name">
				<EditOrders
					:project="my_project"
               :properties="properties"
					:settings="settings"
					:order_status_type="status_type"
					:actions="order_actions"
					:categories="order_categories"
					:priorities="order_priorities"
					:statuses="order_statuses"
					:types="order_types"	
					:task_actions="task_actions"
					:task_categories="task_categories"
					:task_statuses="task_statuses"
					:task_types="task_types"
               :default_property_id="default_property_id"
               :reload_count="reload_count"
               :selected_order_id="changeToOrderId"
               @reload-orders="reloadOrders"
					@changed-order-tab="changedOrderTab"
				>
				</EditOrders>
			</b-tab>
		</b-tabs>
		<b-row>
			<b-button variant="danger" size="sm" @click="deleteProject" v-if="my_project.id">Delete Project</b-button>
        </b-row>
	</b-container>
	</b-col>
    <b-col style="text-align:left;" v-if="settings.help_show == 'true'">
      <p class="card-text" v-html="settings.help_project">
      </p>
      <p class="card-text" v-html="help_order">
      </p>
		<p class="card-text" v-html="help_tab">
		</p>
    </b-col>
    </b-row>
    </b-container>
</div>
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
		order_status_types: {required: true},
		order_actions: {required: true},
		order_categories: {required: true},
		order_statuses: {required: true},
		order_types: {required: true},		
		order_priorities: {required: true},
		task_actions: {required: true},
		task_categories: {required: true},
		task_statuses: {required: true},
		task_types: {required: true},
      default_property_id: {required: true}
	},
	data() {
		return {
			my_project: null,
			help_order: null,
			help_tab: null,
			tab_index: 0,
         reload_count: 0,
         currentTab: 0,
         changeToOrderId: null
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
         
			if((this.my_project.name === null) || (this.my_project.contact_id === null)){
				return;
			}
            if(this.my_project.id == null){
                this.$http.post('/project',this.my_project).then(response => {
                    this.my_project.id = response.data.id;
                })
            }
            else{
                this.$http.patch('/project/' + this.my_project.id, this.my_project)
            }
		},
		changedProjectTab(tab_index){
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
			switch(tab_index){
            case 0:
					this.help_tab = this.settings.help_order_general
					break;
            case 1:
					this.help_tab = this.settings.help_order_calendar
					break;
				case 2:
					this.help_tab = this.settings.help_task
					break;
            case 3:
					this.help_tab = this.settings.help_order_notes
					break;
            case 4:
					this.help_tab = this.settings.help_order_billing
					break;
				default:
					this.help_tab = ''
			}
		},
      reloadOrders(order){
         console.log('reloading project');
         console.log(order);
         if(order){
            this.reload_count++;
            this.currentTab = order.order_status_type_id;
            this.changeToOrderId = order.id;
         }
      }
	}
}
</script>