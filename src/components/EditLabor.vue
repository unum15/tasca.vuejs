<template>
  <div>
    <TopMenu></TopMenu>
    <header>
        Labor Assignments and Activities
    </header>
    <main>
      <b-tabs>
        <b-tab v-for="type in labor_types" :title="type.name" :key="type.id">
          <EditLaborTab :labor_type="type" :operator_projects="operator_projects">
          </EditLaborTab>
        </b-tab>
      </b-tabs>
    </main>
  </div>
</template>
<script>
import TopMenu from './TopMenu';
import EditLaborTab from './EditLaborTab';
import { mapState } from 'vuex';
export default {
  name: 'EditLabor',
  components: {
    TopMenu,
    EditLaborTab,
  },
  data () {
    return {
      labor_types: [],
      operator_projects: []
    }
  },
  created () {
    this.getLaborTypes();
    this.getOperatorProjects();
  },
  methods: {
    getLaborTypes(){
      this.$http.get('/labor_types').then(response => {
        this.labor_types = response.data.data;
      });
    },
    getOperatorProjects(){
      if(!this.operator_id){
        return;
      }
      this.$http.get('/projects?client_id=' + this.operator_id).then(response => {
        this.operator_projects = response.data;
      });
    },
  },
  computed:{
    ...mapState({
      operator_id: state => state.settings.operating_company_client_id
    }),
  },
  watch:{
    operator_id (){
      this.getOperatorProjects();
    }
  }
}
</script>
