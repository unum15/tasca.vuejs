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
              Number Of Stops
            </b-col>
            <b-col>
              <b-form-input
                type="number"
                v-model="system.stops"
                @change="save(system)"
                />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              Number Of POC
            </b-col>
            <b-col>
              <b-form-input
                type="number"
                v-model="system.points_of_connection"
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
                @input="save(system)"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              Filters
            </b-col>
            <b-col>
              <b-form-input
                v-model="system.filters"
                type="number"
                @change="save(system)"
                />
            </b-col>
          </b-row>
        </b-container>
        <b-tabs :key="system.irrigation_controllers.length">
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
        current_tab: 0,
        change_tab: false,
        irrigation_water_types: []
    }
  },
  created() {
    this.$http.get('/irrigation_water_types').then(response => {
      this.irrigation_water_types = response.data.data
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
        property_id:this.property_id,
        name:this.property_name,
        irrigation_controllers:[]
      });
    },
    newController(system){
      system.irrigation_controllers.push({
        irrigation_system_id:system.id,
        name:this.property_name
      });
    },
    save(system) {
      console.log(system);
      if(system.id == null){
          this.$http.post('/irrigation_system',system).then(response => {
          system.id = response.data.id;
        })
      }
      else{
        this.$http.patch('/irrigation_system/' + system.id, system)
      }
    },
    saveController(controller) {
      console.log(controller);
      if(controller.id == null){
          this.$http.post('/irrigation_controller',controller).then(response => {
          controller.id = response.data.id;
        })
      }
      else{
        this.$http.patch('/irrigation_controller/' + controller.id, controller)
      }
    },
  },
}

</script>