<template>
<div>
  <b-row>
    <b-col>{{ clock_in.contact.name }}</b-col>
  </b-row>
  <b-row>
    <b-col>
      <b-form-group label="Client">
        <el-select
          v-model="client_id"
          filterable
          default-first-option
          placeholder="Select Client"
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
        v-model="project_id"
        filterable
        default-first-option
        placeholder="Select Project"
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
        v-model="order_id"
        filterable
        default-first-option
        placeholder="Select Order"
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
        v-model="client_id"
        filterable
        default-first-option
        placeholder="Select Task"
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
        v-model="appointment_id"
        filterable
        default-first-option
        placeholder="Select Appointment"
        >
          <el-option
            v-for="appointment in appointments"
            :key="appointment.id"
            :label="appointment.name"
            :value="appointment.id">
          </el-option>
        </el-select>
      </b-form-group>
    </b-col>
    <b-col>
      <b-button>New Appointment</b-button>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <b-form-group label="Labor Type">
       <el-select
        v-model="client_id"
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
       <el-select
        v-model="project_id"
        filterable
        default-first-option
        placeholder="Select Assignment"
        >
          <el-option
            v-for="assignment in labor_assignments"
            :key="assignment.id"
            :label="assignment.name"
            :value="assignment.id">
          </el-option>
        </el-select>
      </b-form-group>
    </b-col>
    <b-col>
      <b-form-group label="Labor Activity">
       <el-select
        v-model="activity_id"
        filterable
        default-first-option
        placeholder="Select Activity"
        >
          <el-option
            v-for="activity in labor_activities"
            :key="activity.id"
            :label="activity.name"
            :value="activity.id">
          </el-option>
        </el-select>
      </b-form-group>
    </b-col>
  </b-row>
  <b-row>
    <b-col class="data">
      <b-form-group label="Clock In Time">
        <b-form-input v-model="clock_in.clock_in"></b-form-input>
      </b-form-group>
    </b-col>
    <b-col class="data">
      <b-form-group label="Clock OutTime">
        <b-form-input v-model="clock_in.clock_out" @input="save()"></b-form-input>
      </b-form-group>
    </b-col>
  </b-row>
  <b-row>
    <b-col class="label">Notes For The Day</b-col>
    <b-col class="data" cols="8"><b-form-input v-model="clock_in.notes" @input="save()"></b-form-input></b-col>
  </b-row>
</div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'EditClockInModule',
  components: {
  },
  props: {
    clock_in: {required: true}
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
    }
  },
  created() {
  this.$http.get('/clients').then(response => {
      this.clients = response.data
    });
    this.$http.get('/labor_assignments').then(response => {
      this.labor_assignments = response.data.data
    });
    this.$http.get('/labor_types').then(response => {
      this.labor_types = response.data.data
    });

  },
  mounted(){
  },
  methods: {
  },
  computed: {
  }
}

</script>