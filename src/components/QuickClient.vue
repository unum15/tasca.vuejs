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
                  <b-form-group label="Contact Name">
                      <b-form-input
                        type="text"
                        v-model="contact.name"
                        @change="contactNameChanged"
                        required
                        :state="contact.name != null"
                        placeholder="John Smith">
                      </b-form-input>
                  </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Contact Type">
                      <b-form-select
                        :options="contact_types"
                        :disabled="client_types_loading"
                        value-field="id"
                        text-field="name"
                        required
                        :state="contact.contact_type_id != null"
                        v-model="contact.contact_type_id">
                      </b-form-select>
                    </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                    <EditPhoneNumbers
                        :contact_id="contact.id"
                        :settings="settings"
                      ></EditPhoneNumbers>
                </b-col>
                <b-col>
                    <EditEmails
                        :contact_id="contact.id"
                        :settings="settings"
                     ></EditEmails>
                    
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                    <b-form-group label="Billing Contact">
                      <b-form-checkbox
                        v-model="billing_contact">
                      </b-form-checkbox>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Contact Method">
                      <b-form-select
                        :options="contact_methods"
                        value-field="id"
                        text-field="name"
                        required
                        v-model="contact.contact_method_id">
                      </b-form-select>
                    </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-form-group label="Order Date">
                    <b-form-input
                      type="date"
                      v-model="order.date">
                    </b-form-input>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Referred By">
                    <b-form-input
                      type="text"
                      v-model="client.referred_by"
                      placeholder="John Doe">
                    </b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-form-group label="Client Type">
                    <b-form-select
                      :options="client_types"
                      :disabled="client_types_loading"
                      value-field="id"
                      text-field="name"
                      :state="client.client_type_id != null"
                      required
                      v-model="client.client_type_id">
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Client Name">
                    <b-form-input
                      type="text"
                      v-model="client.name"
                      :state="client.name != null"
                      required
                      placeholder="Smith Household"
                      >
                    </b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                  <b-col>
                      <b-form-group label="Property Type">
                        <b-form-select
                          :options="property_types"
                          value-field="id"
                          text-field="name"
                          required
                          :state="property.property_type_id != null"
                          v-model="property.property_type_id">
                        </b-form-select>
                      </b-form-group>
                  </b-col>
                  <b-col>
                      <b-form-group label="Work Property">
                        <b-form-checkbox
                          v-model="property.work_property">
                        </b-form-checkbox>
                      </b-form-group>
                  </b-col>
                  <b-col>
                      <b-form-group label="Billing Property">
                        <b-form-checkbox
                          v-model="property.billing_property">
                        </b-form-checkbox>
                      </b-form-group>
                  </b-col>
                  <b-col>
                      <b-form-group label="Property Name">
                        <b-form-input
                          type="text"
                          v-model="property.name"
                          placeholder="Home">
                        </b-form-input>
                      </b-form-group>
                  </b-col>
              </b-row>
              <b-row>
                  <b-col>
                      <b-form-group label="Address Line 1">
                        <b-form-input
                          type="text"
                          v-model="property.address1"
                          placeholder="123 Main Street">
                        </b-form-input>
                      </b-form-group>
                  </b-col>
              </b-row>
              <b-row>
                  <b-col>
                      <b-form-group label="Address Line 2">
                        <b-form-input
                          type="text"
                          v-model="property.address2"
                          placeholder="Suite 100">
                        </b-form-input>
                      </b-form-group>
                  </b-col>
              </b-row>
              <b-row>
                  <b-col>
                      <b-form-group label="City">
                        <b-form-input
                          type="text"
                          v-model="property.city"
                          required
                          :state="property.city != null"
                          placeholder="Salt Lake City">
                        </b-form-input>
                      </b-form-group>
                  </b-col>
                  <b-col>
                      <b-form-group label="State">
                        <b-form-input
                          type="text"
                          v-model="property.state"
                          required
                          :state="property.state != null"
                          placeholder="UT">
                        </b-form-input>
                      </b-form-group>
                  </b-col>
                  <b-col>
                      <b-form-group label="Zip">
                        <b-form-input
                          type="text"
                          v-model="property.zip"
                          placeholder="84555">
                        </b-form-input>
                      </b-form-group>
                  </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-form-group label="Project Name">
                    <b-form-input
                        type="text"
                        v-model="project.name"
                        required
                        :state="project.name != null"
                        placeholder="New Project Name"
                        >
                    </b-form-input>
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
                      <b-form-group label="Assignment">
                          <b-form-select
                              :options="labor_assignments"
                              value-field="id"
                              text-field="name"
                              v-model="task.labor_assignment_id"
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
  name: 'QuickClient',
  components: {
    'TopMenu': TopMenu,
    'EditEmails': EditEmails,
    'EditPhoneNumbers': EditPhoneNumbers
  },
  data () {
    return {
      client_types: [],
      contact_methods: [],
      contact_types: [],
      activity_levels: [],
      property_types: [],
      order_categories: [],
      order_priorities: [],
      order_types: [],
      labor_assignments: [],
      task_statuses: [],
      task_actions: [],
      contact_methods_loading: true,
      contact_types_loading: true,
      client_types_loading: true,
      property_types_loading: true,
      settings: {},
      billing_contact: true,
      showSaveFailed: false,
      showSaveSuccess: false,
      reroute: false,
      lastContactName: null,
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
    this.$http.get('/client_types').then(response => {
      this.client_types = response.data
      this.client_types_loading = false
    })
    this.$http.get('/contact_methods').then(response => {
      this.contact_methods = response.data
      this.contact_methods_loading = false
    })
    this.$http.get('/contact_types').then(response => {
      this.contact_types = response.data
      this.contact_types_loading = false
    })
    this.$http.get('/property_types').then(response => {
      this.property_types = response.data
      this.property_types_loading = false
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
    this.$http.get('/labor_assignments').then(response => {
      this.labor_assignments = response.data.data
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
      this.project.client_id = this.client.id;
      this.project.contact_id = this.contact.id;
      this.project.open_date = this.order.date;
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
      this.task.crew_id = this.settings.default_crew_id;
      if(this.task.id === null){
        this.$http.post('/task',this.task)
          .then((results) => {
            this.task.id = results.data.id;
            this.nextTask();
          })
      }
      else{
        this.$http.patch('/task/' + this.task.id,this.task)
        .then(() => {this.nextTask();})
      }
    },
    nextTask(){
      this.client.main_mailing_property_id = this.property.id;
      this.client.billing_contact_id = this.contact.id;
      this.$http.patch('/client/' + this.client.id,this.client).then(() => {
        if(this.reroute){
          this.$router.push('/client/' + this.client.id);
        }
        else{
          this.resetForm();
        }
      });
    },
    resetForm(){
      this.client = {
        id: null,
        client_type_id: null,
        name: null,
        billing_property_id: null,
        billing_contact_id: null,
        referred_by: '',
      };
      this.contact = {
        id: null,
        name: null,
        contact_method_id: this.settings.default_contact_method_id
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
        description: null,
        date: this.today
      };
      this.task= {
        id: null,
        labor_type_id: 2,
        labor_assignment_id: this.settings.default_billing_labor_assignment_id,
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
      
      this.order.service_window = this.$store.state.user.default_service_window;
      
      
      this.task.labor_assignment_id = this.settings.default_billing_labor_assignment_id
      this.task.task_status_id = this.settings.default_billing_task_status_id
      this.task.task_action_id = this.settings.default_billing_task_action_id
      this.lastContactName = null;
    },
    contactNameChanged() {
      if(this.client.name === this.lastContactName){
        var names = this.contact.name.split(/\s+/);
        if(names.length > 1){
          this.client.name = names[names.length - 1] + ', ' + names[0];
          if(this.property.property_type_id == 1){
            this.property.name = names[names.length - 1] + ' Residence';
          }
        }
        this.lastContactName = this.client.name;
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
  updated() {
    if(!this.first_update){
      return;
    }
  }
}

</script>