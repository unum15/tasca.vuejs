<template>
  <div>
    <TopMenu v-if="this.client_id === null"></TopMenu>
    <b-container fluid>
      <b-row>
        <b-col>
          <b-form-group label="Show Completed">
            <b-form-checkbox
              @input="getProjects"
              v-model="filter.completed"
            >
            </b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Filter">
            <b-form-input
                    type="text"
                    v-model="filter.name"
                >
              </b-form-input>
           </b-form-group>
          </b-col>
        </b-row>
    </b-container>
    <b-tabs vertical pills v-model="current_tab" :key="projects.length">
      <b-tab
        v-for="(project,index) in filtered_projects"
        :key="project.id"
        :active="isActive(index)"
      >
      <template slot="title" style="text-align:left">
        <div style="text-align:left" v-if="client_id">
          {{ project.name === null ? 'New project' : project.name.substr(0,20) }}
        </div>
        <div v-b-popover.hover="project.name.substr(0,20)" style="text-align:left" v-else>
          {{ project.client.name }}
        </div>
      </template>
        <EditProject
            v-if="index == current_tab"
            :project="project"
            :contacts="contacts"
            :crews="crews"
            :properties="properties"
            :settings="my_settings"
            :order_priorities="order_priorities"
						:order_types="order_types"
						:order_statuses="order_statuses"
						:order_actions="order_actions"
						:order_categories="order_categories"
						:labor_assignments="labor_assignments"
						:task_statuses="task_statuses"
						:task_actions="task_actions"
						:labor_types="labor_types"
            :order_status_types="order_status_types"
            :default_property_id="default_property_id"
            :order_id="order_id"
            :task_id="task_id"
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
import TopMenu from './TopMenu'
export default {
  name: 'EditProjects',
  components: {
    'EditProject': EditProject,
    'TopMenu': TopMenu
  },
  props: {
    client_id: {default: null},
    settings: {default: () => {}},
    contacts: {default: () => []},
    properties: {default: () => []},
    contact_id: {default: null},
    default_property_id: {default: null},
    project_id: {default: null},
    order_id: {default: null},
    task_id: {default: null},
  },
  data () {
    return {
      projects: [],
      current_tab: 0,
      change_tab: false,
      crews: [],
      order_types: [],
			order_priorities: [],
			order_actions: [],
			order_statuses: [],
			order_categories: [],
			labor_assignments: [],
			task_statuses: [],
			task_actions: [],
			labor_types: [],
      order_status_types: [],
      my_settings: null,
      selected_project_id: null,
      filter: {
        completed : false,
        name: null,
        client_id: this.client_id
      }
    }
  },
  created () {
    this.$http.get('/crews').then(response => {
			this.crews = response.data;
		});
    this.$http.get('/order_status_types').then(response => {
			this.order_status_types = response.data;
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
		this.$http.get('/labor_assignments').then(response => {
			this.labor_assignments = response.data.data;
		});
		this.$http.get('/task_statuses').then(response => {
			this.task_statuses = response.data;
		});
		this.$http.get('/task_actions').then(response => {
			this.task_actions = response.data;
		});
		this.$http.get('/labor_types').then(response => {
			this.labor_types = response.data.data;
		});
    this.selected_project_id = this.project_id;
    this.getProjects()
  },
  methods: {
    newProject () {
      var project = {
        id: null,
        name: null,
        client_id: this.client_id,
        contact_id: this.contact_id,
        notes: null,
        open_date: moment().format('YYYY-MM-DD'),
        client: {}
      };
      this.projects.push(project);
      this.change_tab = true;
    },
    getProjects(){
      this.projects = [];
      if(this.client_id){
        this.my_settings = this.settings
        this.$http.get('/projects?client_id=' + this.client_id+ '&completed=' + this.filter.completed).then(response => {
          this.projects = response.data
        })
      }
      else{
        this.$http.get('/settings').then(response => {
          this.my_settings = response.data
        })
        this.$http.get('/projects?completed=' + this.filter.completed).then(response => {
          this.projects = response.data
          this.projects.sort((a, b) => (a.client.name.toLowerCase() > b.client.name.toLowerCase()))
        })
      }
    },
    isActive (index) {
      if((this.change_tab)&&(index == this.projects.length -1)){
        return true
      }
      if(this.selected_project_id == this.projects[index].id){
        return true
      }
      return false
    },
    removeProject (project) {
      this.projects = this.projects.filter(p => p.id !== project.id);
    },
  },
  computed: {
    filtered_projects(){
      return this.projects.filter(p => {
        if((this.filter.name ==  null) || (this.filter.name == "")){
          return true;
        }
        if(this.client_id){
          if(p.name.toLowerCase().includes(this.filter.name.toLowerCase()) !==  false){
            return true;
          }
        }
        else{
          if(p.client.name.toLowerCase().includes(this.filter.name.toLowerCase()) !==  false){
            return true;
          }
        }
        return false;
      });
    }
  }
}

</script>