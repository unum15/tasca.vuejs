<template>
  <div>
    <TopMenu></TopMenu>
    <b-alert variant="danger"
             dismissible
             max="5"
             @dismissed="showSaveFailed=false">
      Save Failed!
    </b-alert>
    <b-alert variant="success"
             dismissible
             :show="showSaveSuccess"
             @dismissed="showSaveSuccess=false">
      Saved!
    </b-alert>
    <header>
      {{ client.name }}
    </header>
    <main>
            <b-container :fluid="true">
            <b-row>
            <b-col cols="8">
            <b-container>
              <b-row>
                <b-col>
                    <b-form-group label="Client">
                      <b-form-select
                        :options="clients"
                        value-field="id"
                        text-field="name"
                        required
                        :state="client_id != null"
                        @change="getProperties();getProjects();"
                        v-model="client_id">
                      </b-form-select>
                    </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Property">
                      <b-form-select
                        :options="properties"
                        value-field="id"
                        text-field="name"
                        required
                        :state="order.property_id != null"
                        v-model="order.property_id">
                      </b-form-select>
                    </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                    <b-form-group label="Existing Project">
                      <b-form-checkbox
                        v-model="existing_project"
                        @change="getProjects"
                        >
                      </b-form-checkbox>
                    </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Project" v-show="existing_project">
                      <b-form-select
                        :options="projects"
                        value-field="id"
                        text-field="name"
                        :state="project.project_id != null"
                        v-model="project.project_id">
                      </b-form-select>
                    </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-form-group label="Order Name">
                    <b-form-input
                        type="text"
                        v-model="order.name"
                        @change="orderNameChanged"
                        required
                        :state="order.name != null"
                        placeholder="New Order Name"
                        >
                    </b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
                <b-row>
                   <b-col>
                       <b-form-group label="Description">
                           <b-form-input
                               v-model="order.description"
                               placeholder="What needs to be done?"
                               required
                               ref='description'
                               :state="order.description != null"
                               >
                           </b-form-input>
                       </b-form-group>
                   </b-col>
               </b-row>
               <b-row>
                   <b-col>
                       <b-form-group label="Category">
                           <b-form-select
                               :options="order_categories"
                               value-field="id"
                               text-field="name"
                               v-model="order.order_category_id"
                               required
                               :state="order.order_category_id != null"
                               >
                           </b-form-select>
                       </b-form-group>
                   </b-col>
                   <b-col>
                       <b-form-group label="Priority">
                           <b-form-select
                               :options="order_priorities"
                               value-field="id"
                               text-field="name"
                               v-model="order.order_priority_id"
                               :state="order.order_priority_id != null"
                               required
                               >
                           </b-form-select>
                       </b-form-group>
                   </b-col>
                   <b-col>
                       <b-form-group label="Type">
                           <b-form-select
                               :options="order_types"
                               value-field="id"
                               text-field="name"
                               v-model="order.order_type_id"
                               :state="order.order_type_id != null"
                               required
                               >
                           </b-form-select>
                       </b-form-group>
                   </b-col>
               </b-row>
               <b-row>
                   <b-col>
                       <b-form-group label="Approval Date">
                           <b-form-input
                               type="date"
                               @change="updateStartDate();"
                               v-model="order.approval_date"
                           >
                           </b-form-input>
                       </b-form-group>
                   </b-col>
                   <b-col>
                       <b-form-group label="Start Date">
                           <b-form-input
                               type="date"
                               v-model="order.start_date"
                               :disabled="order.approval_date == null"
                           >
                           </b-form-input>
                       </b-form-group>
                   </b-col>
               </b-row>
               <b-row>
                  <b-col>
                      <b-form-group label="Category">
                          <b-form-select
                              :options="task_categories"
                              value-field="id"
                              text-field="name"
                              v-model="task.task_category_id"
                              >
                          </b-form-select>
                      </b-form-group>
                  </b-col>
                  <b-col>
                      <b-form-group label="Status">
                          <b-form-select
                              :options="task_statuses"
                              value-field="id"
                              text-field="name"
                              v-model="task.task_status_id"
                              >
                          </b-form-select>
                      </b-form-group>
                  </b-col>
                  <b-col>
                      <b-form-group label="Action">
                          <b-form-select
                              :options="task_actions"
                              value-field="id"
                              text-field="name"
                              v-model="task.task_action_id"
                              >
                          </b-form-select>
                      </b-form-group>
                  </b-col>
              </b-row>
              <b-button @click="saveClient();">New</b-button>
              <b-button @click="reroute=true;saveClient();">Edit</b-button>
            </b-container>
          </b-col>
          <b-col v-if="settings.help_show == 'true'">
            {{ settings.help_client }}
          </b-col>
        </b-row>
      </b-container>
    </main>
  </div>
</template>
<script>
import moment from 'moment'
import TopMenu from './TopMenu'
import EditEmails from './EditEmails'
import EditPhoneNumbers from './EditPhoneNumbers'
export default {
  name: 'QuickOrder',
  components: {
    'TopMenu': TopMenu,
    'EditEmails': EditEmails,
    'EditPhoneNumbers': EditPhoneNumbers
  },
  data () {
    return {
      clients: [],
      contact_methods: [],
      activity_levels: [],
      properties: [],
      projects: [],
      order_categories: [],
      order_priorities: [],
      order_types: [],
      task_categories: [],
      task_statuses: [],
      task_actions: [],
      settings: {},
      showSaveFailed: false,
      showSaveSuccess: false,
      reroute: false,
      existing_project: false,
      client_id: null,
      client: {
        id: null,
        client_type_id: null,
        name: null,
        contact_method_id: null,
        billing_property_id: null,
        billing_contact_id: null,
        referred_by: '',
      },
      contact: {
        id: null
      },
      property: {
        id: null,
        name: 'Home',
        billing_property: true,
        work_property: true
      },
      order: {
        id: null,
        name: null,
        description: null
      },
      task: {
        id: null,
        task_billing_type_id: 1
      },
      project: {
        id: null
      }
    }
  },
  created () {
    this.$http.get('/settings').then(response => {
      this.settings = response.data
      this.resetForm();
    })
    this.$http.get('/clients').then(response => {
      this.clients = response.data
    })
    this.$http.get('/order_categories').then(response => {
      this.order_categories = response.data
    })
    this.$http.get('/order_priorities').then(response => {
      this.order_priorities = response.data
    })
    this.$http.get('/order_types').then(response => {
      this.order_types = response.data
    })
    this.$http.get('/task_categories').then(response => {
      this.task_categories = response.data
    })
    this.$http.get('/task_statuses').then(response => {
      this.task_statuses = response.data
    })
    this.$http.get('/task_actions').then(response => {
      this.task_actions = response.data
    })
    this.$http.get('/activity_levels').then(response => {
      this.activity_levels = response.data
      this.activity_levels_loading = false
    })
  },
  methods: {
    saveClient() {
      if(this.client.name === null){
        return;
      }
      if(this.client.id === null){
        this.$http.post('/client',this.client)
          .then((results) => {
            this.client.id = results.data.id;
            this.saveContact();
          })
      }
      else{
        this.$http.patch('/client/' + this.client.id,this.client)
          .then(() => {
            this.saveContact();
          })
      }
    },
    saveContact() {
      if(this.contact.name === null){
        return;
      }
      this.contact.client_id = this.client.id;
      if(this.contact.id === null){
        this.$http.post('/contact',this.contact)
          .then((results) => {
            this.contact.id = results.data.id;
            this.saveProperty();
          })
      }
      else{
        this.$http.patch('/contact/' + this.contact.id,this.contact)
          .then(() => {
            this.saveProperty();
          })
      }
    },
    getProperties() {
      console.log(this.client_id)
      if(this.client_id){
        this.$http.get('/properties?client_id=' + this.client_id).then(response => {
          this.properties = response.data
          if(this.properties.length == 1){
            this.order.property_id = this.properties[0]
          }
        })
      }
      else{
        this.properties = []
      }
    },
    getProjects() {
      if((this.client_id)&&(this.existing_project)){
        this.$http.get('/projects?client_id=' + this.client_id).then(response => {
          this.projects = response.data
        })
      }
      else{
        this.projects = []
      }
    },
    saveProperty() {
      if(this.property.name === null){
        return;
      }
      this.property.client_id = this.client.id;
      this.property.contacts = [ this.contact.id ];
      if(this.property.id === null){
        this.$http.post('/property',this.property)
          .then((results) => {
            this.property.id = results.data.id;
            this.saveProject();
          })
      }
      else{
        this.$http.patch('/property/' + this.property.id,this.property)
          .then(() => {
            this.saveProject();
          })
      }
    },
    saveProject() {
      if(this.order.name === null){
        return;
      }
      this.project.name = this.order.name;
      this.project.client_id = this.client.id;
      this.project.contact_id = this.contact.id;
      this.project.open_date = this.today;
      if(this.project.id === null){
        this.$http.post('/project',this.project)
          .then((results) => {
            this.project.id = results.data.id;
            this.saveOrder();
          })
      }
      else{
        this.$http.patch('/project/' + this.project.id,this.project)
          .then(() => {
            this.saveOrder();
          })
      }
    },
    saveOrder() {
      if(this.order.name === null){
        return;
      }
      this.order.project_id = this.project.id;
      this.order.property = this.property.id;
      if(this.order.id === null){
        this.$http.post('/order',this.order)
          .then((results) => {
            this.order.id = results.data.id;
            this.saveTask();
          })
      }
      else{
        this.$http.patch('/order/' + this.order.id,this.order)
          .then(() => {
            this.saveOrder();
          })
      }
    },
    saveTask() {
      this.task.order_id = this.order.id;
			this.task.name = this.order.name;
			this.task.description = this.order.description;
      if(this.task.id === null){
        this.$http.post('/task',this.task)
          .then((results) => {
            this.task.id = results.data.id;
            this.nextTask();
          })
      }
      else{
        this.$http.patch('/task/' + this.task.id,this.task)
        .then(() => {this.nextTask()})
      }
    },
    nextTask(){
      if(this.reroute){
        this.$router.push('/client/' + this.client.id);
      }
      else{
        this.resetForm();
      }
    },
    resetForm(){
      this.client = {
        id: null,
        client_type_id: null,
        name: null,
        contact_method_id: null,
        billing_property_id: null,
        billing_contact_id: null,
        referred_by: '',
      };
      this.contact = {
        id: null,
        name: null
      };
      this.property = {
        id: null,
        name: 'Home',
        billing_property: true,
        work_property: true
      };
      this.order = {
        id: null,
        name: null,
        description: null
      };
      this.task= {
        id: null,
        task_type_id: 2,
        task_category_id: this.settings.default_billing_task_category_id,
        task_status_id: this.settings.default_billing_task_status_id,
        task_action_id: this.settings.default_billing_task_action_id,
      };
      this.project = {
        id: null
      };
      this.client.client_type_id = this.settings.default_client_type_id
      this.client.activity_level_id = this.settings.default_activity_level_id
      this.client.contact_method_id = this.settings.default_contact_method_id
      this.contact.contact_type_id = this.settings.default_contact_type_id
      this.property.property_type_id = this.settings.default_property_type_id
      this.client.activity_level_id = this.settings.default_activity_level_id
      this.contact.activity_level_id = this.settings.default_activity_level_id
      this.property.activity_level_id = this.settings.default_activity_level_id
      this.order.order_category_id = this.settings.default_order_category_id
      this.order.order_priority_id = this.settings.default_order_priority_id
      this.order.order_type_id = this.settings.default_order_type_id
      
      this.order.order_status_id = this.settings.default_order_status_id
      this.order.order_action_id = this.settings.default_order_action_id
      
      
      this.order.approval_date = this.today
      this.order.start_date = this.today
      this.order.order_date = this.today
      this.order.service_window = localStorage.getItem('default_service_window')
      
      
      this.task.task_category_id = this.settings.default_billing_task_category_id
      this.task.task_status_id = this.settings.default_billing_task_status_id
      this.task.task_action_id = this.settings.default_billing_task_action_id
 
    },
    contactNameChanged() {
      if(this.client.name === null){
        var names = this.contact.name.split(/\s+/);
        if(names.length > 1){
          this.client.name = names[names.length - 1] + ', ' + names[0];
        }
      }
    },
    orderNameChanged(){
      if(this.order.description === null){
        this.order.description = this.order.name;
      }
    }
  },
  computed: {
    today() {
			return moment().format('YYYY-MM-DD');
		},
  },
}

</script>