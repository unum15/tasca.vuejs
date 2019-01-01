<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col>
          <b-form-group horizontal label="Show Completed">
            <b-form-checkbox
              @input="getProjects"
              v-model="filter.completed"
            >
            </b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group horizontal label="Filter">
            <b-form-input
                    type="text"
                    v-model="filter.name"
                >
              </b-form-input>
           </b-form-group>
          </b-col>
        </b-row>
    </b-container>
    <b-tabs vertical pills v-model="current_tab">
      <b-tab
        v-for="project,index in projects"
        :key="project.id"
        :title="project.name===null?'New project':project.name.substr(0,20)"
        v-if="showTab(index)"
      >
      <template slot="title" style="text-align:left">
        <div style="text-align:left">
          {{ project.name === null ? 'New project' : project.name.substr(0,20) }}
        </div>
      </template>
        <EditProject
            v-if="index == current_tab"
            :project="project"
            :contacts="contacts"
            :properties="properties"
            :settings="settings"
            :order_priorities="order_priorities"
						:order_types="order_types"
						:order_statuses="order_statuses"
						:order_actions="order_actions"
						:order_categories="order_categories"
						:task_categories="task_categories"
						:task_statuses="task_statuses"
						:task_actions="task_actions"
						:task_types="task_types"
            :order_billing_types="order_billing_types"
            @remove-project="removeProject"
        ></EditProject>
      </b-tab>
    </b-tabs>
    <b-button variant="secondary" @click="newProject">Add New Project</b-button>
  </div>
</template>
<script>
import moment from 'moment'
import EditProject from './EditProject';
export default {
  name: 'EditProjects',
  components: {
    'EditProject': EditProject,
  },
  props: {
    client_id: {required: true},
    settings: {required: true},
    contacts: {required: true},
    properties: {required: true}
  },
  data () {
    return {
      projects: [],
      current_tab: 0,
      change_tab: false,
      order_types: [],
			order_priorities: [],
			order_actions: [],
			order_statuses: [],
			order_categories: [],
			task_categories: [],
			task_statuses: [],
			task_actions: [],
			task_types: [],
      order_billing_types: [],
      filter: {
        completed : false,
        name: null,
        client_id: this.client_id
      }
    }
  },
  created () {
    this.$http.get('/order_billing_types').then(response => {
			this.order_billing_types = response.data;
		});
    this.$http.get('/order_priorities').then(response => {
			this.order_priorities = response.data;
		});
		this.$http.get('/order_types').then(response => {
			this.order_types = response.data;
		});
		this.$http.get('/order_statuses').then(response => {
			this.order_statuses = response.data;
		});
		this.$http.get('/order_actions').then(response => {
			this.order_actions = response.data;
		});
		this.$http.get('/order_categories').then(response => {
			this.order_categories = response.data;
		});
		this.$http.get('/task_categories').then(response => {
			this.task_categories = response.data;
		});
		this.$http.get('/task_statuses').then(response => {
			this.task_statuses = response.data;
		});
		this.$http.get('/task_actions').then(response => {
			this.task_actions = response.data;
		});
		this.$http.get('/task_types').then(response => {
			this.task_types = response.data;
		});
    this.getProjects()
  },
  methods: {
    newProject () {
      var project = {
        id: null,
        name: null,
        property_id: null,
        contact_id: null,
        notes: null,
        open_date: moment().format('YYYY-MM-DD')
      };
      this.projects.push(project);
      this.change_tab = true;
    },
    getProjects(){
      this.projects = [];
      this.$http.get('/projects?client_id=' + this.client_id+ '&completed=' + this.filter.completed).then(response => {
        this.projects = response.data
      })
    },
    showTab (index) {
      if((this.filter.name ==  null) || (this.filter.name == "")){
        return true;
      }
      if(this.projects[index].name.toLowerCase().includes(this.filter.name.toLowerCase()) !==  false){
        return true;
      }
      return false;
    },
    removeProject (project) {
      this.projects = this.projects.filter(p => p.id !== project.id);
    }
  },
  updated() {
		if(this.change_tab){
			this.current_tab = this.projects.length-1;
			this.change_tab =  false;
		}
  },
}

</script>