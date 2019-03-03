<template>
  <div>
    <b-tabs vertical pills v-model="current_tab">
      <b-tab v-for="property in my_properties" :key="property.id" :title="property.name==null?'New Property':property.name">
        <template slot="title" style="text-align:left">
          <div style="text-align:left">
            {{ property.name==null?'New Property':property.name }}
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
        change_tab: false
    }
  },
  created() {
    this.$http.get('/property_types').then(response => {
      this.property_types = response.data
    })
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
        contacts: []
      };
      this.my_properties.push(property);
      this.change_tab = true;
    },
    removeProperty(property){
      this.my_properties = this.my_properties.filter(p => p.id !== property.id);
    }
  },
  updated() {
		if(this.change_tab){
			this.current_tab = this.properties.length-1;
			this.change_tab =  false;
		}
  },
}

</script>