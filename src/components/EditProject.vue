<template>
<div>
<template slot="title">
     i'm <i>Custom</i> <strong>Title</strong>
   </template>
<b-container fluid>
            <b-row>
            <b-col cols="8">
   <b-container fluid>
      <div v-if="contacts.length == 0" style="font-weight:bold">
         {{ my_project.client.name }}
      </div>
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
                  :options="my_contacts"
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
               :crews="crews"
               :project="my_project"
               :properties="my_properties"
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
               :order_id="selected_order_id"
               :task_id="task_id"
               @reload-orders="reloadOrders"
               @changed-order-tab="changedOrderTab"
               @set-order-tab="setOrderTab"
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
      crews: {required: true},
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
      default_property_id: {required: true},
      order_id: {default: null},
      task_id: {default: null},
   },
   data() {
      return {
         my_project: null,
         help_order: null,
         help_tab: null,
         tab_index: 0,
         project_tab: 0,
         order_tab: 0,
         reload_count: 0,
         currentTab: 0,
         my_contacts: [],
         my_properties: [],
         selected_order_id: null
      };
   },
   created() {
        this.my_project=this.project;
        this.help_order = this.settings.help_project_general;
        if(this.order_id){
         this.selected_order_id = this.order_id;
        }
        if(this.contacts.length == 0){
         this.$http.get('/contacts?client_id=' + this.my_project.client_id).then(response => {
           this.my_contacts = response.data
         })
        }
        else{
         this.my_contacts = this.contacts
        }
        if(this.properties.length == 0){
         this.$http.get('/properties?client_id=' + this.my_project.client_id).then(response => {
           this.my_properties = response.data
         })
        }
        else{
         this.my_properties = this.properties
        }
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
         this.project_tab=tab_index;
         this.setHelp();
      },
      changedOrderTab(tab_index){
         this.order_tab=tab_index;
         this.setHelp();
      },
      setHelp(){
         var order_type = null;
         switch(this.project_tab){
            case 0:
               this.help_order = this.settings.help_project_general
               break;
            case 1:
               this.help_order = this.settings.help_service_order
               order_type = 'service';
               break;
            case 2:
               this.help_order = this.settings.help_pending_work_order
               order_type = 'pending_work';
               break;
            case 3:
               this.help_order = this.settings.help_work_order
               order_type = 'work';
               break;
            default:
               this.help_order = ''
         }
         if(this.project_tab>0){
            switch(this.order_tab){
                  case 0:
                     this.help_order += this.settings['help_' + order_type + '_order_general']
                     break;
                  case 1:
                     this.help_order = this.settings['help_' + order_type + '_order_calendar']
                     break;
                  case 2:
                     this.help_order = this.settings['help_' + order_type + '_order_task']
                     break;
                  case 3:
                     this.help_order = this.settings['help_' + order_type + '_order_notes']
                     break;
                  case 4:
                     this.help_order = this.settings['help_' + order_type + '_order_billing']
                     break;
                  case 5:
                     this.help_order = this.settings['help_' + order_type + '_order_renewing']
                     break;
                  default:
                     this.help_tab = ''
            }
         }
      },
      reloadOrders(order){
         if(order){
            this.reload_count++;
            this.currentTab = order.order_status_type_id;
            this.new_order_id = order.id;
         }
      },
      setOrderTab(order){
         if(order){
            this.currentTab = order.order_status_type_id;
            this.$emit('set-order-tab', order)
         }
      }
   }
}
</script>