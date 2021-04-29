<template>
  <div>
    <b-tabs v-model="current_tab">
      <b-tab>
        <template slot="title">
          <div style="text-align:left">
            General
          </div>
        </template>
        <b-container>
          <b-row>
            <b-col>
              Name
            </b-col>
            <b-col>
              <b-form-input
                type="text"
                v-model="system.name"
                @change="save(system)"
                />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              Type
            </b-col>
            <b-col>
              <b-form-select
                :options="irrigation_water_types"
                value-field="id"
                text-field="name"
                v-model="system.irrigation_water_type_id"
                @input="save(system);"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              Point of Connection Location
            </b-col>
            <b-col>
              <b-form-input
                type="text"
                v-model="system.point_of_connection_location"
                @change="save(system)"
                />
            </b-col>
          </b-row>
          <b-row v-if="system.irrigation_water_type_id==1 || system.irrigation_water_type_id==3">
            <b-col>
              Backflow
            </b-col>
            <b-col>
              <b-form-select
                :options="backflows"
                value-field="id"
                text-field="placement"
                v-model="system.backflow_assembly_id"
                @input="save(system)"
              />
            </b-col>
          </b-row>
          <b-row v-if="system.backflow_assembly_id">
            <b-col>
            </b-col>
            <b-col>
              {{ getBackflowData(system.backflow_assembly_id) }}
            </b-col>
          </b-row>
          <b-row v-if="system.irrigation_water_type_id==2 || system.irrigation_water_type_id==3">
            <b-col>
              Filter Model
            </b-col>
            <b-col>
              <b-form-input
                type="text"
                v-model="system.filter_model"
                @change="save(system)"
                />
            </b-col>
          </b-row>
          <b-row v-if="system.irrigation_water_type_id==2 || system.irrigation_water_type_id==3">
            <b-col>
              Filter Location
            </b-col>
            <b-col>
              <b-form-input
                type="text"
                v-model="system.filter_location"
                @change="save(system)"
                />
            </b-col>
          </b-row>
          <b-row v-if="units.length">
            <b-col>
              Unit
            </b-col>
            <b-col>
              <b-form-select
                :options="units"
                value-field="id"
                text-field="name"
                v-model="system.property_unit_id"
                @input="save(system)"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              Notes
            </b-col>
            <b-col>
              <b-form-textarea
                v-model="system.notes"
                @change="save(system)"
                />
            </b-col>
          </b-row>
          <div v-if="system.irrigation_system_others.length">
            <b-row>
              <b-col>
                Name
              </b-col>
              <b-col>
                Description
              </b-col>
            </b-row>
            <b-row
              v-for="(other) in system.irrigation_system_others"
              :key="other.id"
            >
              <b-col>
                <b-form-input
                  type="text"
                  v-model="other.name"
                  @change="saveOther(other)"
                  />
              </b-col>
              <b-col>
                <b-form-input
                  type="text"
                  v-model="other.value"
                  @change="saveOther(other)"
                  />
              </b-col>
            </b-row>
          </div>
        </b-container>
        <b-button variant="secondary" @click="newOther(system)">Add New System Field</b-button>
      </b-tab>
      <b-tab>
        <template slot="title">
          <div style="text-align:left">
            Controllers
          </div>
        </template>
        <EditIrrigationControllers
          :controllers="my_system.irrigation_controllers"
          :units="units"
          :locations="locations"
          :system_id="my_system.id"
        >
        </EditIrrigationControllers>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import EditIrrigationControllers from './EditIrrigationControllers'
export default {
  name: 'EditIrrigationSystem',
  components: {
    'EditIrrigationControllers': EditIrrigationControllers
  },
  props: {
    system: {required: true},
    backflows: {required: true},
    units: {required: true},
    irrigation_water_types: {required: true},
    locations: {required: true},
  },
  data() {
    return {
        my_system: {},
        current_tab: 0,
    }
  },
  created() {
    this.my_system = this.system;
  },
  methods: {
    newController(){
      this.my_system.irrigation_controllers.push({
        id:null,
        irrigation_system_id:this.my_system.id,
        name:'Controller',
        irrigation_controller_others:[]
      });
      this.saveController(this.my_system.irrigation_controllers[this.my_system.irrigation_controllers.length-1]);
      this.my_system.current_controller_tab = this.my_system.irrigation_controllers.length-1;
    },
    newOther(){
      this.my_system.irrigation_system_others.push({
        id:null,
        irrigation_system_id:this.my_system.id,
      });
    },
    newControllerOther(controller){
      controller.irrigation_controller_others.push({
        id:null,
        irrigation_controller_id:controller.id,
      });
    },
    save() {
      if(this.system.id == null){
          this.$http.post('/irrigation_system',this.my_system).then(response => {
          this.my_system.id = response.data.data.id;
        })
      }
      else{
        this.$http.patch('/irrigation_system/' + this.my_system.id, this.my_system)
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