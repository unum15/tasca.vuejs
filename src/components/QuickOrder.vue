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
        New Order
    </header>
    <main>
            <b-container :fluid="true">
            <b-row>
            <b-col cols="8">
            <b-container>
              <b-row>
                <b-col>
                    <b-form-group label="Client">
                     <el-select v-model="client_id" filterable default-first-option placeholder="Select Client" @change="getProperties();getProjects();">
                        <el-option
                          v-for="client in clients"
                          :key="client.id"
                          :label="client.name"
                          :value="client.id">
                        </el-option>
                      </el-select>
                    </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Property">
                      <b-form-select
                        :options="properties"
                        value-field="id"
                        text-field="name"
                        required
                        :state="order.property != null"
                        v-model="order.property">
                      </b-form-select>
                    </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-form-group label="Project">
                      <b-form-select
                        :options="projects"
                        value-field="id"
                        text-field="name"
                        v-model="project.id">
                      </b-form-select>
                    </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Project Name" v-if="!project.id">
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
                   <b-col>
                       <b-form-group label="Task Date">
                           <b-form-input
                               type="date"
                               v-model="appointment.date"
                           >
                           </b-form-input>
                       </b-form-group>
                   </b-col>
                   <b-col>
                       <b-form-group label="Sort order">
                           <b-form-input
                               type="text"
                               v-model="appointment.sort_order"
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
              <b-button @click="saveProject();">New</b-button>
              <b-button @click="reroute=true;saveProject();">Edit</b-button>
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
import moment from 'moment';
import TopMenu from './TopMenu';
import { mapState } from 'vuex';
export default {
  name: 'QuickOrder',
  components: {
    'TopMenu': TopMenu,
  },
  data () {
    return {
      clients: [],
      contact_methods: [],
      activity_levels: [],
      properties: [],
      projects: [ {id: null, name: 'New Project'}],
      order_categories: [],
      order_priorities: [],
      order_types: [],
      labor_assignments: [],
      task_statuses: [],
      task_actions: [],
      showSaveFailed: false,
      showSaveSuccess: false,
      reroute: false,
      client_id: null,
      order: {
        id: null,
        name: null,
        description: null,
        property: null
      },
      task: {
        id: null,
        task_billing_type_id: 1
      },
      appointment: {
        id: null,
        date: null,
        sort_order: null
      },
      project: {
        id: null
      }
    }
  },
  created () {
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
    getProperties() {
      if(this.client_id){
        this.$http.get('/properties?client_id=' + this.client_id).then(response => {
          this.properties = response.data
          if(this.properties.length == 1){
             this.order.property = this.properties[0].id;
          }
        })
      }
      else{
        this.properties = []
      }
    },
    getProjects() {
      if(this.client_id){
        this.$http.get('/projects?client_id=' + this.client_id + '&completed=false').then(response => {
          this.projects = response.data
          this.projects.unshift({id: null, name: 'New Project'})
        })
      }
      else{
        this.projects = [{id: null, name: 'New Project'}]
      }
    },
    saveProject() {
      if(this.order.name === null){
        return;
      }
      if(this.project.id){
        this.saveOrder();
        return;
      }
      this.project.client_id = this.client_id;
      var client = this.clients.filter(c => c.id == this.client_id);
      this.project.contact_id = client[0].billing_contact_id;
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
      this.order.date = this.today;
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
            this.saveAppointment();
          })
      }
      else{
        this.$http.patch('/task/' + this.task.id,this.task)
        .then(() => {this.nextTask()})
      }
    },
    saveAppointment() {
      this.appointment.task_id = this.task.id;
      if(this.appointment.id === null){
        this.$http.post('/appointment',this.appointment)
          .then((results) => {
            this.appointment.id = results.data.id;
            this.nextTask();
          })
      }
      else{
        this.$http.patch('/appointment/' + this.appointment.id,this.appointment)
        .then(() => {this.nextTask()})
      }
    },
    nextTask(){
      if(this.reroute){
        this.$router.push('/client/' + this.client_id + '/project/' + this.project.id + '/order/' + this.order.id);
      }
      else{
        this.resetForm();
      }
    },
    resetForm(){
      this.order = {
        id: null,
        name: null,
        description: null,
        order_category_id: this.settings.default_order_category_id,
        order_priority_id: this.settings.default_order_priority_id,
        order_type_id: this.settings.default_order_type_id,      
        order_status_id: this.settings.default_order_status_id,
        order_action_id: this.settings.default_order_action_id,
        approval_date: this.today,
        start_date: this.today,
        order_date: this.today,
        service_window: this.$store.state.user.default_service_window
      };
      this.task = {
        id: null,
        labor_type_id: this.settings.default_labor_type_id,
        labor_assignment_id: parseInt(this.settings['default_labor_assignment_id-labor_type_id-' + this.settings.default_labor_type_id]),
        task_status_id: parseInt(this.settings['default_task_status_id-labor_type_id-' + this.settings.default_labor_type_id]),
        task_action_id: parseInt(this.settings['default_task_action_id-labor_type_id-' + this.settings.default_labor_type_id]),
      };
      this.appointment = {
        id: null,
        date: null,
        sort_order: null
      };
      this.project = {
        id: null,
        contact_id: null
      };
      this.client_id = null;
      
      
      
      
      
 
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
    ...mapState({
      settings: state => state.settings
    }),
    current_assignments() {
			return this.labor_assignments.filter(a => {
                for (var i=0; i < a.labor_types.length; i++) {
                  if (a.labor_types[i].id == this.task.labor_type_id) {
                        return true;
                    }
                }
				return false;
			})
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
}

</script>