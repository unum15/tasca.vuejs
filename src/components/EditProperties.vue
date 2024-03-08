<template>
  <div>
    <b-tabs vertical pills v-model="current_tab" :key="my_properties.length">
      <b-tab
        v-for="(property, index) in my_properties"
        :key="property.id"
        :active="isActive(index)"
        >
        <template slot="title" style="text-align:left" :title="property.client ? property.client.name : ''">
          <div v-b-tooltip.hover style="text-align:left" :id="`property-title-${property.id}`">
            {{ property.name==null?'New Property':property.name }}
            <img v-if="property.client" src="@/assets/linked.png" alt="linked" style="width:24px"/>
          </div>
        </template>
        <EditProperty
          :property="property"
          :activity_levels="activity_levels"
          :settings="settings"
          :property_types="property_types"
          :contacts="contacts"
          @remove-property="removeProperty"
        ></EditProperty>
      </b-tab>
    </b-tabs>
    <b-button variant="secondary" @click="newProperty">Add New Property</b-button>
    <b-button variant="secondary" v-b-modal.existing-properties>Add Linked Property</b-button>
    <b-modal id="existing-properties" title="Select Property" @ok="linkedProperty">
      <b-form-group label="Linked Property">
          <el-select
                v-model="linked_property_id"
                filterable
                default-first-option
                placeholder="Select Property"
                clearable
            >
            <el-option
              v-for="property in all_properties"
              :key="property.id"
              :label="property.client.name + ' - ' + property.name + ' - ' + property.address1"
              :value="property.id"
              >
            </el-option>
          </el-select>
        </b-form-group>
    </b-modal>
  </div>
</template>
<script>
import EditProperty from './EditProperty';
export default {
  name: 'EditProperties',
  components: {
    'EditProperty': EditProperty,
  },
  props: {
    client_id: {default: null},
    activity_levels: {required: true},
    contacts: {required: true},
    settings: {required: true},
    properties: {required: true}
  },
  data() {
    return {
        property_types: [],
        my_properties: [],
        current_tab: 0,
        change_tab: false,
        all_properties: [],
        linked_property_id: null,
    }
  },
  created() {
    this.$http.get('/property_types').then(response => {
      this.property_types = response.data
    })
    this.$http.get('/properties').then(response => {
      this.all_properties = response.data;
    });
    this.my_properties = this.properties;
    
  },
  methods: {
    newProperty() {
      var property = {
        id: null,
        client_id: this.client_id,
        name: null,
        activity_level_id: null,
        property_type_id: null,
        primary_contact_id: null,
        work_property: true,
        billing_property: true,
        phone_number: null,
        address1: null,
        address2: null,
        city: null,
        state: null,
        zip: null,
        notes: null,
        contacts: [],
        property_units: []
      };
      this.my_properties.push(property);
      this.change_tab = true;
    },
    removeProperty(property){
      this.my_properties = this.my_properties.filter(p => p.id !== property.id);
    },
    isActive (index) {
      if((this.change_tab)&&(index == this.properties.length -1)){
        return true
      }
      return false
    },
    linkedProperty () {
      let id = this.linked_property_id;
      this.$http.post('/client/' + this.client_id + '/properties',{property_id: id})
        .then(() => {
          let properties = this.all_properties.filter(p => p.id == id);
          let property = properties[0];
          this.my_properties.push(property);
          this.linked_property_id = null;
      });
    }
  }
}

</script>