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
          <b-row>
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
              <b-form-input
                type="text"
                v-model="system.notes"
                @change="save(system)"
                />
            </b-col>
          </b-row>
        </b-container>
        <b-tabs vertical pills :key="system.irrigation_controllers.length"  v-model="system.current_controller_tab">
          <b-tab
            v-for="(controller) in system.irrigation_controllers"
            :key="controller.id"
            >
              <template slot="title" style="text-align:left">
                <div style="text-align:left">
                  {{ controller.name }}
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
                      v-model="controller.name"
                      @change="saveController(controller)"
                      />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Location
                  </b-col>
                  <b-col>
                    <b-form-select
                      :options="locations"
                      value-field="id"
                      text-field="name"
                      v-model="controller.irrigation_controller_location_id"
                      @input="saveController(controller)"
                    />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Placement
                  </b-col>
                  <b-col>
                    <b-form-input
                      type="text"
                      v-model="controller.placement"
                      @change="saveController(controller)"
                      />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Model
                  </b-col>
                  <b-col>
                    <b-form-input
                      type="text"
                      v-model="controller.model"
                      @change="saveController(controller)"
                      />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Zones
                  </b-col>
                  <b-col>
                    <b-form-input
                      type="number"
                      v-model="controller.zones"
                      @change="saveController(controller)"
                    />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Unit
                  </b-col>
                  <b-col>
                    <b-form-select
                      :options="units"
                      value-field="id"
                      text-field="name"
                      v-model="controller.property_unit_id"
                      @input="saveController(controller)"
                    />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Have Access
                  </b-col>
                  <b-col style="text-align:left;">
                    <b-form-checkbox
                      v-model="controller.accessible"
                      @input="saveController(controller)"
                    />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Username
                  </b-col>
                  <b-col>
                    <b-form-input
                      type="text"
                      v-model="controller.username"
                      @change="saveController(controller)"
                    />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Password
                  </b-col>
                  <b-col>
                    <b-form-input
                      type="text"
                      v-model="controller.password"
                      @change="saveController(controller)"
                    />
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    Notes
                  </b-col>
                  <b-col>
                    <b-form-input
                      type="text"
                      v-model="controller.notes"
                      @change="saveController(controller)"
                    />
                  </b-col>
                </b-row>
              </b-container>
          </b-tab>
        </b-tabs>
        <b-button variant="secondary" @click="newController(system)">Add New Controller</b-button>
      </b-tab>
    </b-tabs>
    <b-button variant="secondary" @click="newSystem">Add New System</b-button>
  </div>
</template>
<script>
export default {
  name: 'ViewPropertyIrrigationSystemsTab',
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
    this.$http.get('/irrigation_systems?includes=irrigation_controllers&property_id=' + this.property_id).then(response => {
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
        name:this.property_name,
        irrigation_controllers:[]
      });
      this.save(this.systems[this.systems.length-1]);
      this.current_tab = this.systems.length-1;
    },
    newController(system){
      system.irrigation_controllers.push({
        irrigation_system_id:system.id,
        name:this.property_name
      });
      this.saveController(system.irrigation_controllers[system.irrigation_controllers.length-1]);
      system.current_controller_tab = system.irrigation_controllers.length-1;
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