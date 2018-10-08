<template>
  <div>
    <b-alert variant="danger"
             dismissible
             max="5"
             @dismissed="showSaveFailed=false">
      Save Failed!
    </b-alert>
    <b-alert variant="success"
             dismissible
             :show="showSaveSuccess"
             @dismissed="showSaveSuccess=false">
      Saved!
    </b-alert>
    <b-tabs vertical pills v-model="property_tab_index">
      <b-tab v-for="property in properties" :key="property.id" :title="property.name==''?'New Property':property.name">
        <EditProperty :property="property" :activity_levels="activity_levels" :settings="settings" :property_types="property_types"></EditProperty>
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
    settings: {required: true}
  },
  data () {
    return {
        contacts: [],
        property_types: [],
        showSaveFailed: false,
        showSaveSuccess: false,
        properties: [],
        property_tab_index: 0
    }
  },
  created () {
    this.$http.get('/property_types').then(response => {
      this.property_types = response.data
    })
    if (this.client_id !== null) {
      console.log('/properties/' + this.client_id);
      this.$http.get('/properties?client_id=' + this.client_id).then(response => {
        this.properties = response.data
      })
    }
  },
  methods: {
    newProperty: function(){
      var property = {
        id: null,
        name: null,
        activity_level_id: null,
        property_type_id: null,
        primary_contact_id: null,
        work_property: true,
        phone_number: null,
        address1: null,
        address2: null,
        city: null,
        state: null,
        zip: null,
        notes: null
      };
      this.properties.push(property);
    },
  },
}

</script>