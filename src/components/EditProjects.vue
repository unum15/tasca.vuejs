<template>
  <div>
    <b-tabs vertical pills v-model="current_tab">
      <b-tab v-for="project in projects" :key="project.id" :title="project.name===null?'New project':project.name">
        <EditProject
            :project="project"
            :contacts="contacts"
            :properties="properties"
            :settings="settings"
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
      current_tab: 0
    }
  },
  created () {
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
    if((this.projects.length>0) && (this.projects[this.projects.length-1].name === null)){
      this.current_tab = this.projects.length-1;
    }
  },
  watch: {
  }
}

</script>