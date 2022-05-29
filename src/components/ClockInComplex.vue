<template>
<div>
  <b-row>
    <b-col v-if="clock_in.id">{{ my_clock_in.contact ? my_clock_in.contact.name : '' }}</b-col>
    <b-col v-else><b-form-group label="Employee">
        <b-form-select
            :options="contacts"
            value-field="id"
            text-field="name"
            v-model="my_clock_in.contact_id"
            >
          </b-form-select>
      </b-form-group></b-col>
  </b-row>
  <b-row>
    <b-col>
      <b-form-group label="Client">
        <el-select
          v-model="my_clock_in.appointment.task.order.project.client_id"
          filterable
          default-first-option
          placeholder="Select Client"
          @change="getProjects"
        >
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
      <b-form-group label="Project">
      <el-select
        v-model="my_clock_in.appointment.task.order.project_id"
        filterable
        default-first-option
        placeholder="Select Project"
        @change="getOrders"
      >
          <el-option
            v-for="project in projects"
            :key="project.id"
            :label="project.name"
            :value="project.id">
          </el-option>
        </el-select>
      </b-form-group>
    </b-col>
    <b-col>
      <b-form-group label="Order">
        <el-select
        v-model="my_clock_in.appointment.task.order_id"
        filterable
        default-first-option
        placeholder="Select Order"
        @change="getTasks"
        >
          <el-option
            v-for="order in orders"
            :key="order.id"
            :label="order.name"
            :value="order.id">
          </el-option>
        </el-select>
      </b-form-group>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <b-form-group label="Task">
       <el-select
        v-model="my_clock_in.appointment.task_id"
        filterable
        default-first-option
        placeholder="Select Task"
        @change="getAppointments"
        >
          <el-option
            v-for="task in tasks"
            :key="task.id"
            :label="task.name"
            :value="task.id">
          </el-option>
        </el-select>
      </b-form-group>
    </b-col>
    <b-col>
      <b-form-group label="Appointment">
       <el-select
        v-model="my_clock_in.appointment_id"
        filterable
        default-first-option
        placeholder="Select Appointment"
        >
          <el-option
            v-for="appointment in appointments"
            :key="appointment.id"
            :label="appointment.date + ' ' +appointment.time"
            :value="appointment.id">
          </el-option>
        </el-select>
      </b-form-group>
    </b-col>
    <b-col>
      <b-button v-b-modal.modalEditAppointment>New Appointment</b-button>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <b-form-group label="Labor Type">
       <el-select
        v-model="my_clock_in.appointment.task.labor_type_id"
        filterable
        default-first-option
        placeholder="Select Type"
        >
          <el-option
            v-for="type in labor_types"
            :key="type.id"
            :label="type.name"
            :value="type.id">
          </el-option>
        </el-select>
      </b-form-group>
    </b-col>
    <b-col>
      <b-form-group label="Labor Assignment">
              <Treeselect :options="labor_assignments" :normalizer="treeNormalizer" v-model="my_clock_in.appointment.task.labor_assignment_id"/>
          </b-form-group>
      </b-col>
      <b-col>
          <b-form-group label="Labor Activity">
              <Treeselect :options="filtered_labor_activities" :normalizer="treeNormalizer" v-model="my_clock_in.labor_activity_id"/>
          </b-form-group>
      </b-col>
  </b-row>
  <b-row>
    <b-col class="data">
      <b-form-group label="Clock In Time">
        <b-form-input v-model="my_clock_in.clock_in"></b-form-input>
      </b-form-group>
    </b-col>
    <b-col class="data">
      <b-form-group label="Clock Out Time">
        <b-form-input v-model="my_clock_in.clock_out"></b-form-input>
      </b-form-group>
    </b-col>
  </b-row>
  <b-row>
    <b-col class="label">Notes For The Day</b-col>
    <b-col class="data" cols="8"><b-form-input v-model="my_clock_in.notes" ></b-form-input></b-col>
  </b-row>
  <b-modal size="m" scrollable ref="modalEditAppointment" id="modalEditAppointment" title="New Appointment">
    <EditAppointment></EditAppointment>
  </b-modal>
</div>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import treeNormalizer from '../common/TreeNormalizer.js';
import treeFilter from '../common/TreeFilter.js';
import EditAppointment from './EditAppointment';
export default {
  name: 'EditClockInModule',
  components: {
    Treeselect,
    EditAppointment
  },
  props: {
    clock_in: {default: {}},
    contacts: {default: []}
  },
  data: function () {
    return {
      clients: [],
      projects: [],
      orders: [],
      tasks: [],
      appointments: [],
      labor_types: [],
      labor_assignments: [],
      labor_activities: [],
      client_id: null,
      project_id: null,
      order_id: null,
      my_clock_in: {
        appointment: {
          task: {
            order: {
              project: {
              
              }
            }
          }
        }
      }
    }
  },
  mounted() {
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
      if((modalId == "modalEditClockIn")&&(bvEvent.trigger == "ok")){
        console.log(this.my_clock_in);
        if(this.my_clock_in.id){
          this.$http.patch('/clock_in/' + this.clock_in.id,this.my_clock_in);
        }
        else{
        console.log('post');
          this.$http.post('/clock_in',this.my_clock_in);
        }
      }
    })
  },
  created() {
    if(this.clock_in.id){
      this.$http.get('/clock_in/' + this.clock_in.id ).then(response => {
        this.my_clock_in = response.data
        this.getProjects();
        this.getOrders();
        this.getTasks();
        this.getAppointments();
      });
    }
    this.$http.get('/clients').then(response => {
      this.clients = response.data
    });
    this.$http.get('/clients').then(response => {
      this.clients = response.data
    });
    this.$http.get('/labor_assignments').then(response => {
      this.labor_assignments = response.data.data
    });
    this.$http.get('/labor_types').then(response => {
      this.labor_types = response.data.data
    });
    this.$http.get('/labor_activities').then(response => {
      this.labor_activities = response.data.data
    });
  },
  methods: {
   treeFilter,
    treeNormalizer,
    getProjects(){
      this.$http.get('/projects?client_id=' + this.my_clock_in.appointment.task.order.project.client_id).then(response => {
        this.projects = response.data;
      });
    },
    getOrders(){
      this.$http.get('/orders?project_id=' + this.my_clock_in.appointment.task.order.project_id).then(response => {
        this.orders = response.data;
      });
    },
    getTasks(){
      this.$http.get('/tasks?order_id=' + this.my_clock_in.appointment.task.order_id).then(response => {
        this.tasks = response.data;
      });
    },
    getAppointments(){
      this.$http.get('/appointments?task_id=' + this.my_clock_in.appointment.task_id).then(response => {
        this.appointments = response.data;
      });
    },    
  },
  computed: {
    filtered_labor_activities(){
        if(this.my_clock_in.appointment.task.labor_assignment_id){
            return this.treeFilter(this.my_clock_in.appointment.task.labor_assignment_id,this.labor_activities);
        }
        return [];
    },
  }
}

</script>