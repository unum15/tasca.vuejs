<template>
  <div>
    <b-tabs vertical pills :key="controllers.length"  v-model="current_tab">
      <b-tab
        v-for="(controller) in controllers"
        :key="controller.id"
        >
          <template slot="title" style="text-align:left">
            <div style="text-align:left">
              {{ controller.name }}
            </div>
          </template>
          <b-tabs>
            <b-tab title="General">
              <b-container>
                <b-row>
                  <b-col>
                    Name
                  </b-col>
                  <b-col>
                    <b-form-input
                      type="text"
                      v-model="controller.name"
                      @change="save(controller)"
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
                      @input="save(controller)"
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
                      @change="save(controller)"
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
                      @change="save(controller)"
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
                      @change="changeZoneCount(controller);"
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
                      @input="save(controller)"
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
                      @input="save(controller)"
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
                      @change="save(controller)"
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
                      @change="save(controller)"
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
                      @change="save(controller)"
                    />
                  </b-col>
                </b-row>
                <div v-if="controller.irrigation_controller_others.length">
                  <b-row>
                    <b-col>
                      Name
                    </b-col>
                    <b-col>
                      Description
                    </b-col>
                  </b-row>
                  <b-row
                    v-for="(other) in controller.irrigation_controller_others"
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
                <b-row>
                  <b-col>
                    <b-button variant="secondary" @click="newOther(controller)">Add New Controller Field</b-button>
                  </b-col>
                </b-row>
              </b-container>
            </b-tab>
            <b-tab title="Zones">
              <b-table
                :items="controller.irrigation_zones"
                :fields="irrigation_zone_fields"
              >
                <template v-slot:cell(number)="data">
                    <b-form-input
                        type="number"
                        @change="saveZone(data.item)"
                        v-model="data.item.number"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(name)="data">
                    <b-form-input
                        type="text"
                        @change="saveZone(data.item)"
                        v-model="data.item.name"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(plant_type)="data">
                    <b-form-input
                        type="text"
                        @change="saveZone(data.item)"
                        v-model="data.item.plant_type"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(head_type)="data">
                    <b-form-input
                        type="text"
                        @change="saveZone(data.item)"
                        v-model="data.item.head_type"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(gallons_per_minute)="data">
                    <b-form-input
                        type="number"
                        @change="saveZone(data.item)"
                        v-model="data.item.gallons_per_minute"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(application_rate)="data">
                    <b-form-input
                        type="number"
                        @change="saveZone(data.item)"
                        v-model="data.item.application_rate"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(heads)="data">
                    <b-form-input
                        type="number"
                        @change="saveZone(data.item)"
                        v-model="data.item.heads"
                    >
                    </b-form-input>
                </template>
              </b-table>
            </b-tab>
            <b-tab title="Programs">
              Coming Soon
            </b-tab>
        </b-tabs>
      </b-tab>
    </b-tabs>
    <b-button variant="secondary" @click="newController()">Add New Controller</b-button>
  </div>
</template>
<script>
export default {
  name: 'EditIrrigationControllers',
  props: {
    controllers: {required: true},
    units: {required: true},
    locations: {required: true},
    system_id: {required: true}
  },
  data() {
    return {
        my_controllers: {},
        current_tab: 0,
        irrigation_zone_fields: [
          {
            key: 'number',
            label: 'Number',
            sortable: true,
          },
          {
            key: 'name',
            label: 'Name',
            sortable: true,
          },
          {
            key: 'plant_type',
            label: 'Plant Type',
            sortable: true,
          },
          {
            key: 'head_type',
            label: 'Head Type',
            sortable: true,
          },
          {
            key: 'gallons_per_minute',
            label: 'GPM',
            sortable: true,
          },
          {
            key: 'application_rate',
            label: 'Rate',
            sortable: true,
          },
          {
            key: 'heads',
            label: 'Heads',
            sortable: true,
          },
        ]
    }
  },
  created() {
    this.my_controllers = this.controllers;
  },
  methods: {
    newController(){
      this.my_controllers.push({
        id:null,
        irrigation_system_id:this.system_id,
        name:'Controller',
        irrigation_controller_others:[]
      });
      this.save(this.my_controllers[this.my_controllers.length-1]);
      this.current_tab = this.my_controllers.length-1;
    },
    newOther(controller){
      controller.irrigation_controller_others.push({
        id:null,
        irrigation_controller_id:controller.id,
      });
    },
    save(controller) {
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
          this.$http.post('/irrigation_controller_other', other).then(response => {
          other.id = response.data.data.id;
        })
      }
      else{
        this.$http.patch('/irrigation_controller_other/' + other.id, other)
      }
    },
    saveZone(zone) {
      if(!zone.number){
        return;
      }
      if(zone.id == null){
        this.$http.post('/irrigation_zone', zone).then(response => {
          zone.id = response.data.data.id;
        })
      }
      else{
        this.$http.patch('/irrigation_zone/' + zone.id, zone)
      }
    },
    changeZoneCount(controller) {
      if(!controller.irrigation_zones){
        controller.irrigation_zones = [];
      }
      if(controller.irrigation_zones.length > controller.zones){
        for(let x = controller.irrigation_zones.length;x>=controller.zones;x--){
          let zone = controller.irrigation_zones.pop();
          this.$http.delete('/irrigation_zone/' + zone.id);
        }
      }
      else{
        for(let x = controller.irrigation_zones.length;x<controller.zones;x++){
          let zone = {irrigation_controller_id: controller.id, number: x+1};
          this.$http.post('/irrigation_zone', zone).then(response => {
            zone.id = response.data.data.id;
            controller.irrigation_zones.push(zone);
            controller.irrigation_zones.sort((a, b) => {return a.number > b.number;});
          });
        }
      }
      this.save(controller);
    }
  },
}

</script>