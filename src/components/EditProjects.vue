<template>
  <div>
    <b-tabs vertical pills v-model="current_tab">
      <b-tab v-for="project in projects" :key="project.id" :title="project.name===null?'New project':project.name">
        <EditProject
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
      order_types: [],
			order_priorities: [],
			order_actions: [],
			order_statuses: [],
			order_categories: [],
			task_categories: [],
			task_statuses: [],
			task_actions: [],
			task_types: [],
      order_billing_types: []
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
    this.$http.get('/projects?client_id=' + this.client_id).then(response => {
      this.projects = response.data
    })
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
    }
  },
  updated: function() {
    if((this.projects.length>0) && (this.projects[this.projects.length-1].name === null) && (this.current_tab != this.projects.length-1)){
      //this.current_tab = this.projects.length-1;
    }
  },
  watch: {
  }
}

</script>