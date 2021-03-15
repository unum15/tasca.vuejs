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
                      <el-select
                        v-model="contact.contact_type_id"
                        filterable
                        placeholder="Select Contact Type"
                        default-first-option
                       >
                        <el-option
                          v-for="contact_type in contact_types"
                              :key="contact_type.id"
                              :label="contact_type.name"
                              :value="contact_type.id"
                              >
                            </el-option>
                        </el-select>
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
                      <el-select
                          v-model="contact.contact_method_id"
                          filterable
                          placeholder="Select Contact Method"
                          default-first-option
                         >
                          <el-option
                            v-for="contact_method in contact_methods"
                                :key="contact_method.id"
                                :label="contact_method.name"
                                :value="contact_method.id"
                                >
                        </el-option>
                      </el-select>
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
                    <el-select
                      v-model="client.client_type_id"
                      filterable
                      placeholder="Select Client Type"
                      default-first-option>
                      <el-option
                        v-for="client_type in client_types"
                        :key="client_type.id"
                        :label="client_type.name"
                        :value="client_type.id">
                      </el-option>
                    </el-select>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Property Type">
                     <el-select
                       v-model="property.property_type_id"
                       filterable
                       placeholder="Select Property Type"
                       default-first-option>
                       <el-option
                         v-for="property_type in property_types"
                         :key="property_type.id"
                         :label="property_type.name"
                         :value="property_type.id">
                       </el-option>
                     </el-select>
                   </b-form-group>
                </b-col>
              </b-row>
              <b-row>
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
                  <b-col>
                      <b-form-group label="Property Name">
                        <b-form-input
                          type="text"
                          v-model="property.name"
                          placeholder="Home">
                        </b-form-input>
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
              </b-row>
              <b-row>
                  <b-col>
                      <b-form-group label="Address Line 1">
                        <b-form-input
                          type="text"
                          v-model="property.address1">
                        </b-form-input>
                      </b-form-group>
                  </b-col>
                  <b-col>
                      <b-form-group label="Address Line 2">
                        <b-form-input
                          type="text"
                          v-model="property.address2">
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
                <b-col>
                  <b-form-group label="Task Name">
                    <b-form-input
                        type="text"
                        v-model="task.name"
                        required
                        :state="order.name != null"
                        placeholder="New Task Name"
                        >
                    </b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
                <b-row>
                   <b-col>
                       <b-form-group label="Order Description">
                           <b-form-textarea
                               v-model="order.description"
                               placeholder="What needs to be done?"
                               required
                               ref='description'
                               :state="order.description != null"
                               >
                           </b-form-textarea>
                       </b-form-group>
                   </b-col>
                   <b-col>
                       <b-form-group label="Task Description">
                           <b-form-textarea
                               v-model="task.description"
                               placeholder="What needs to be done?"
                               required
                               :state="task.description != null"
                               >
                           </b-form-textarea>
                       </b-form-group>
                   </b-col>
               </b-row>
               <b-row>
                <b-col>
                  <b-container>
               <b-row>
                   <b-col>
                      <b-form-group label="Category">
                        <el-select
                          v-model="order.order_category_id"
                          filterable
                          placeholder="Select Category"
                          default-first-option>
                          <el-option
                            v-for="order_category in order_categories"
                            :key="order_category.id"
                            :label="order_category.name"
                            :value="order_category.id">
                          </el-option>
                        </el-select>
                      </b-form-group>
                   </b-col>
                   </b-row>
               <b-row>
                   <b-col>
                       <b-form-group label="Priority">
                        <el-select
                          v-model="order.order_priority_id"
                          filterable
                          placeholder="Select Priority"
                          default-first-option>
                          <el-option
                            v-for="order_priority in order_priorities"
                            :key="order_priority.id"
                            :label="order_priority.name"
                            :value="order_priority.id">
                          </el-option>
                        </el-select>
                       </b-form-group>
                   </b-col>
                   </b-row>
               <b-row>
                   <b-col>
                       <b-form-group label="Type">
                        <el-select
                          v-model="order.order_type_id"
                          filterable
                          placeholder="Select Type"
                          default-first-option>
                          <el-option
                            v-for="order_type in order_types"
                            :key="order_type.id"
                            :label="order_type.name"
                            :value="order_type.id">
                          </el-option>
                        </el-select>
                       </b-form-group>
                   </b-col>
               </b-row>
               </b-container>
               </b-col>
               <b-col style="text-align:left;" md="auto">
                 <b-form-group label="Labor Types" v-slot="{ ariaDescribedby }">
                  <b-form-radio-group
                    v-model="task.labor_type_id"
                    :options="labor_types"
                    :aria-describedby="ariaDescribedby"
                    value-field="id"
                    text-field="name"
                    stacked
                    @change="laborTypeChanged"
                  ></b-form-radio-group>
                </b-form-group>
               </b-col>
               <b-col>
               <b-container>
               <b-row>
                  <b-col>
                      <b-form-group label="Assignment">
                        <el-select
                          v-model="task.labor_assignment_id"
                          filterable
                          placeholder="Select Assignment"
                          default-first-option>
                          <el-option
                            v-for="labor_assignment in current_assignments"
                            :key="labor_assignment.id"
                            :label="labor_assignment.name"
                            :value="labor_assignment.id">
                          </el-option>
                        </el-select>
                      </b-form-group>
                  </b-col>
                  </b-row>
               <b-row>
                  <b-col>
                      <b-form-group label="Status">
                        <el-select
                          v-model="task.task_status_id"
                          filterable
                          placeholder="Select Status"
                          default-first-option>
                          <el-option
                            v-for="task_status in current_statuses"
                            :key="task_status.id"
                            :label="task_status.name"
                            :value="task_status.id">
                          </el-option>
                        </el-select>
                      </b-form-group>
                  </b-col>
                  </b-row>
               <b-row>
                  <b-col>
                      <b-form-group label="Action">
                        <el-select
                          v-model="task.task_action_id"
                          filterable
                          placeholder="Select Action"
                          default-first-option>
                          <el-option
                            v-for="task_action in current_actions"
                            :key="task_action.id"
                            :label="task_action.name"
                            :value="task_action.id">
                          </el-option>
                        </el-select>
                      </b-form-group>
                  </b-col>
              </b-row>
              </b-container>
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
                       <b-form-group label="Approval Date">
                           <b-form-input
                               type="date"
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
                <b-form-group label="Appointment Date">
                  <b-form-input
                      type="date"
                      v-model="appointment.date"
                  >
                  </b-form-input>
                </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Sort Order">
                      <b-form-input
                          type="text"
                          v-model="appointment.sort_order"
                      >
                      </b-form-input>
                      </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Time">
                      <b-form-input
                          type="time"
                          v-model="appointment.time"
                      >
                      </b-form-input>
                      </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group label="Crew">
                        <b-form-select
                            :options="crews"
                            value-field="id"
                            text-field="name"
                            v-model="task.crew_id"
                            >
                        </b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Crew Hours">
                      <b-form-input
                          type="text"
                          v-model="task.crew_hours"
                      >
                      </b-form-input>
                      </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Man Hours">
                      <b-form-input
                          type="text"
                          v-model="task.task_hours"
                      >
                      </b-form-input>
                      </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Budget">
                      <b-form-input
                          type="text"
                          v-model="order.budget"
                      >
                      </b-form-input>
                      </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Budget +/-">
                      <b-form-input
                          type="number"
                          v-model="order.budget_plus_minus"
                      >
                      </b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                <b-col>
                  <b-form-group label="Order Location">
                      <b-form-textarea
                          type="text"
                          v-model="order.location"
                      >
                      </b-form-textarea>
                      </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Order Instructions">
                      <b-form-textarea
                          v-model="order.instructions"
                      >
                      </b-form-textarea>
                      </b-form-group>
                  </b-col>
                  </b-row>
                  <b-row>
                  <b-col>
                    <b-form-group label="Order Notes">
                      <b-form-textarea
                          v-model="order.notes"
                      >
                      </b-form-textarea>
                      </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Appointment Notes">
                      <b-form-textarea
                          v-model="appointment.notes"
                      >
                      </b-form-textarea>
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
import { mapState } from 'vuex';
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
      labor_types: [],
      crews: [],
      contact_methods_loading: true,
      contact_types_loading: true,
      client_types_loading: true,
      property_types_loading: true,
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
        id: null,
        contact_type_id: null
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
      },
      appointment: {
        id: null
      }
    }
  },
  created () {
    this.$http.get('/client_types').then(response => {
      this.client_types = response.data;
      this.client_types_loading = false;
    });
    this.$http.get('/contact_methods').then(response => {
      this.contact_methods = response.data;
      this.contact_methods_loading = false;
    });
    this.$http.get('/contact_types').then(response => {
      this.contact_types = response.data;
      this.contact_types_loading = false;
    });
    this.$http.get('/property_types').then(response => {
      this.property_types = response.data;
      this.property_types_loading = false;
    });
    this.$http.get('/order_categories').then(response => {
      this.order_categories = response.data;
    });
    this.$http.get('/order_priorities').then(response => {
      this.order_priorities = response.data;
    });
    this.$http.get('/order_types').then(response => {
      this.order_types = response.data;
    });
    this.$http.get('/labor_types').then(response => {
      this.labor_types = response.data.data;
    });
    this.$http.get('/labor_assignments').then(response => {
      this.labor_assignments = response.data.data;
    });
    this.$http.get('/task_statuses').then(response => {
      this.task_statuses = response.data;
    });
    this.$http.get('/task_actions').then(response => {
      this.task_actions = response.data;
    });
    this.$http.get('/crews').then(response => {
      this.crews = response.data;
    });
    this.$http.get('/activity_levels').then(response => {
      this.activity_levels = response.data;
      this.activity_levels_loading = false;
    });
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
      this.task.crew_id = this.settings.default_crew_id;
      if(this.task.id === null){
        this.$http.post('/task',this.task)
          .then((results) => {
            this.task.id = results.data.data.id;
            this.saveAppointment();
          })
      }
      else{
        this.$http.patch('/task/' + this.task.id,this.task)
        .then(() => {this.saveAppointment();})
      }
    },
    saveAppointment() {
      this.appointment.task_id = this.task.id;
      if(this.appointment.id === null){
        this.$http.post('/appointment',this.appointment)
          .then((results) => {
            this.appointment.id = results.data.data.id;
            this.nextTask();
          })
      }
      else{
        this.$http.patch('/appointment/' + this.appointment.id,this.appointment)
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
        name: null,
        billing_property_id: null,
        billing_contact_id: null,
        referred_by: '',
        client_type_id: parseInt(this.settings.default_client_type_id),
        activity_level_id: parseInt(this.settings.default_activity_level_id),
        contact_method_id: parseInt(this.settings.default_contact_method_id)
      };
      this.contact = {
        id: null,
        name: null,
        contact_method_id: parseInt(this.settings.default_contact_method_id),
        contact_type_id: parseInt(this.settings.default_contact_type_id),
        activity_level_id: parseInt(this.settings.default_activity_level_id)
      };
      this.property = {
        id: null,
        name: 'Home',
        billing_property: true,
        work_property: true,
        state: this.settings.default_state,
        property_type_id: parseInt(this.settings.default_property_type_id),
        activity_level_id: parseInt(this.settings.default_activity_level_id)
      };
      this.order = {
        id: null,
        name: null,
        description: null,
        date: this.order.date? this.order.date : this.today,
        order_category_id: parseInt(this.settings.default_order_category_id),
        order_priority_id: parseInt(this.settings.default_order_priority_id),
        order_type_id: parseInt(this.settings.default_order_type_id),
        order_status_id: parseInt(this.settings.default_order_status_id),
        order_action_id: parseInt(this.settings.default_order_action_id),
        approval_date: this.order.approval_date ? this.order.approval_date : this.today,
        start_date: this.order.start_date ? this.order.start_date : this.today,
        service_window: this.$store.state.user.default_service_window,
        budget: null,
        budget_plus_minus: null
      };
      this.task = {
        id: null,
        name: null,
        description: null,
        labor_type_id: this.settings.default_labor_type_id,
        labor_assignment_id: parseInt(this.settings['default_labor_assignment_id-labor_type_id-' + this.settings.default_labor_type_id]),
        task_status_id : parseInt(this.settings['default_task_status_id-labor_type_id-' + this.settings.default_labor_type_id]),
        task_action_id : parseInt(this.settings['default_task_action_id-labor_type_id-' + this.settings.default_labor_type_id]),
        task_hours: null
      };
      this.appointment = {
        id: null,
        date: null,
        time: null,
        sort_order: null
      }
      this.project = {
        id: null
      };
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
      if(this.task.name === null){
        this.task.name = this.order.name;
      }
      if(this.task.description === null){
        this.task.description = this.order.description;
      }
    },
    laborTypeChanged(){
			this.task.labor_assignment_id = this.settings['default_labor_assignment_id-labor_type_id-' + this.task.labor_type_id];
			this.task.task_status_id = this.settings['default_task_status_id-labor_type_id-' + this.task.labor_type_id];
			this.task.task_action_id = this.settings['default_task_action_id-labor_type_id-' + this.task.labor_type_id];
		},
  },
  computed: {
    today() {
			return moment().format('YYYY-MM-DD');
		},
    ...mapState({
      settings: state => state.settings
    }),
    current_assignments() {
			return this.labor_assignments.filter(a =>(a.labor_type_id == this.task.labor_type_id));
		},
		current_statuses() {
			return this.task_statuses.filter(status => {
                for (var i=0; i < status.labor_types.length; i++) {
                    if (status.labor_types[i].id == this.task.labor_type_id) {
                        return true;
                    }
                }
				return false;
			})
		},
		current_actions() {
			return this.task_actions.filter(action => {
                for (var i=0; i < action.labor_types.length; i++) {
                    if (action.labor_types[i].id == this.task.labor_type_id) {
                        return true;
                    }
                }
				return false;
			})
		}
  },
  watch:{
    settings(){
      this.resetForm();
    }
  },
  updated() {
    if(!this.first_update){
      return;
    }
  }
}

</script>