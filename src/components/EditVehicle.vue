<template>
  <div>
    <TopMenu></TopMenu>
    <h1>
      {{ vehicle.name }}
    </h1>
    <main>
      <b-container>
        <b-row>
          <b-col>
            <b-form-group label="Vehicle Name">
              <b-form-input
                type="text"
                @change="save"
                v-model="vehicle.name"
                :state="vehicle.name != null"
                required
              >
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Vehicle Type">
              <b-form-select
                @change="save"
                :options="vehicle_types"
                value-field="id"
                text-field="name"
                :state="vehicle.vehicle_type_id != null"
                required
                v-model="vehicle.vehicle_type_id">
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Year">
              <b-form-input
                @change="save"
                type="text"
                v-model="vehicle.year"
              >
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Make">
              <b-form-input
                @change="save"
                type="text"
                v-model="vehicle.make"
              >
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Model">
              <b-form-input
                @change="save"
                type="text"
                v-model="vehicle.model"
              >
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Trim">
              <b-form-input
                @change="save"
                type="text"
                v-model="vehicle.trim"
              >
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="VIN">
              <b-form-input
                @change="save"
                type="text"
                v-model="vehicle.vin"
              >
              </b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
          <b-form-group label="Notes">
            <b-form-textarea
              @input="save"
              v-model="vehicle.notes"
              :rows="3"
              :max-rows="6"
            >
            </b-form-textarea>
          </b-form-group>
          </b-col>
        </b-row>
      </b-container>
    </main>
  </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
  name: 'EditVehicle',
  components: {
    'TopMenu': TopMenu
  },
  props: {
    vehicle_id: {default: null}
  },
  data () {
    return {
      vehicle_types: [],
      vehicle: { id: null }
    };
  },
  created () {
    this.$http.get('/vehicle_types').then(response => {
    console.log(response);
      this.vehicle_types = response.data.data;
    })
    if(this.vehicle_id !== null) {
      this.$http.get('/vehicle/' + this.vehicle_id).then(response => {
        this.vehicle = response.data.data;
      })
    }    
  },
  methods: {
    save () {
      if(this.vehicle.id === null){
        console.log('post');
        this.$http.post('/vehicle',this.vehicle)
          .then((results) => {
            this.vehicle.id = results.data.data.id;
          })
      }
      else{
        console.log('patch');
        this.$http.patch('/vehicle/' + this.vehicle.id, this.vehicle);
      }
    }
  }
};
</script>