<template>
  <div>
    <b-tabs v-model="current_tab" :key="systems.length">
      <b-tab
        v-for="(system, index) in systems"
        :key="system.id"
        :active="isActive(index)"
        >
        <template slot="title" style="text-align:left">
          <div style="text-align:left">
            {{ system.name }}
          </div>
        </template>
        <EditIrrigationSystem
          :system="system"
          :backflows="backflows"
          :units="units"
          :irrigation_water_types="irrigation_water_types"
          :locations="locations"
        >
        </EditIrrigationSystem>
      </b-tab>
    </b-tabs>
    <b-button variant="secondary" @click="newSystem">Add New System</b-button>
  </div>
</template>
<script>
import EditIrrigationSystem from './EditIrrigationSystem'
export default {
  name: 'ViewPropertyIrrigationSystemsTab',
  components: {
    'EditIrrigationSystem': EditIrrigationSystem
  },
  props: {
    property_id: {required: true},
    property_name: {required: true}
  },
  data() {
    return {
        systems: [],
        backflows: [],
        units: [],
        current_tab: 0,
        change_tab: false,
        irrigation_water_types: [],
        locations: []
    }
  },
  created() {
    this.$http.get('/irrigation_water_types').then(response => {
      this.irrigation_water_types = response.data.data
    });
    this.$http.get('/backflow_assemblies?includes=backflow_manufacturer,backflow_size,backflow_model&property_id='+this.property_id).then(response => {
      this.backflows = response.data.data
    });
    this.$http.get('/property_units?property_id='+this.property_id).then(response => {
      this.units = response.data.data
    });
    this.$http.get('/irrigation_controller_locations').then(response => {
      this.locations = response.data.data
    });
    this.$http.get('/irrigation_systems?includes=irrigation_controllers,irrigation_system_others,irrigation_controllers.irrigation_controller_others,irrigation_controllers.irrigation_zones&property_id=' + this.property_id).then(response => {
      this.systems = response.data.data
    });
  },
  methods: {
    isActive(index) {
      if((this.change_tab)&&(index == this.properties.length -1)){
        return true;
      }
      return false;
    },
    newSystem() {
      this.systems.push({
        id: null,
        property_id:this.property_id,
        name:this.property_name + " System",
        irrigation_controllers:[],
        irrigation_system_others:[]
      });
      this.save(this.systems[this.systems.length-1]);
      this.current_tab = this.systems.length-1;
    },
    newController(system){
      system.irrigation_controllers.push({
        id:null,
        irrigation_system_id:system.id,
        name:'Controller',
        irrigation_controller_others:[]
      });
      this.saveController(system.irrigation_controllers[system.irrigation_controllers.length-1]);
      system.current_controller_tab = system.irrigation_controllers.length-1;
    },
    newOther(system){
      system.irrigation_system_others.push({
        id:null,
        irrigation_system_id:system.id,
      });
    },
    newControllerOther(controller){
      controller.irrigation_controller_others.push({
        id:null,
        irrigation_controller_id:controller.id,
      });
    },
    save(system) {
      if(system.id == null){
          this.$http.post('/irrigation_system',system).then(response => {
          system.id = response.data.data.id;
        })
      }
      else{
        this.$http.patch('/irrigation_system/' + system.id, system)
      }
    },
    saveController(controller) {
      if(controller.id == null){
          this.$http.post('/irrigation_controller',controller).then(response => {
          controller.id = response.data.data.id;
        })
      }
      else{
        this.$http.patch('/irrigation_controller/' + controller.id, controller)
      }
    },
    saveOther(other) {
      if(!other.name){
        return;
      }
      if(other.id == null){
          this.$http.post('/irrigation_system_other', other).then(response => {
          other.id = response.data.data.id;
        })
      }
      else{
        this.$http.patch('/irrigation_system_other/' + other.id, other)
      }
    },
    saveControllerOther(other) {
      if(!other.name){
        return;
      }
      if(other.id == null){
          this.$http.post('/irrigation_controller_other', other).then(response => {
          other.id = response.data.data.id;
        })
      }
      else{
        this.$http.patch('/irrigation_controller_other/' + other.id, other)
      }
    },
    getBackflowData(id){
      let backflow = this.backflows.filter(b => (b.id===id));
      if(backflow.length){
        return backflow[0].backflow_manufacturer.name + " " + backflow[0].backflow_size.name + " " + backflow[0].backflow_model.name;
      }
      return null;
    }
  },
}

</script>