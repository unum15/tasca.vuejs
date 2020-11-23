<template>
  <div>
    <b-tabs vertical pills v-model="current_tab" :key="my_properties.length">
      <b-tab
        v-for="(property, index) in my_properties"
        :key="property.id"
        :active="isActive(index)"
        >
        <template slot="title" style="text-align:left">
          <div style="text-align:left">
            {{ property.name }}
          </div>
        </template>
        <ViewPropertyBackflowsTab v-if="property.id != null" :property_id="property.id" @include-backflow="includeBackflowAssembly">
        </ViewPropertyBackflowsTab>
      </b-tab>
    </b-tabs>
    <b-button @click="pdfTag" v-if="included_backflow_assemblies.length">PDF Tag</b-button>
    <b-button @click="pdfReport" v-if="included_backflow_assemblies.length">PDF Report</b-button>
  </div>
</template>
<script>
import ViewPropertyBackflowsTab from './ViewPropertyBackflowsTab'
export default {
  name: 'ViewClientBackflowsTab',
  components: {
    'ViewPropertyBackflowsTab': ViewPropertyBackflowsTab
  },
  props: {
    properties: {required: true}
  },
  data() {
    return {
        property_types: [],
        my_properties: [],
        current_tab: 0,
        change_tab: false,
        included_backflow_assemblies: []
    }
  },
  created() {
    this.my_properties = this.properties;
  },
  methods: {
    isActive (index) {
      if((this.change_tab)&&(index == this.properties.length -1)){
        return true
      }
      return false
    },
    pdfTag(){
      let url = '/api/backflow_assemblies/tags/pdf?';
      this.included_backflow_assemblies.map(a => {
          url += 'backflow_assembly_id[]='+a.id+'&';
       });
      window.open(url, 'backflow_tag_pdf');
    },
    pdfReport(){
        let url = '/api/backflow_test_reports/pdf?';
        this.included_backflow_assemblies.map(a => {
          url += 'backflow_test_report_id[]='+a.backflow_test_reports[0].id+'&';
        });
        window.open(url, 'backflow_pdf');
    },
    includeBackflowAssembly(backflow){
      let others = this.included_backflow_assemblies.filter(a => a.id != backflow.id);
      if(others.length == this.included_backflow_assemblies.length){
        this.included_backflow_assemblies.push(backflow);
      }
      else{
        this.included_backflow_assemblies = others;
      }
    }
  }
}

</script>