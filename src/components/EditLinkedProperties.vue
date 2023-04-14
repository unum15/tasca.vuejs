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
            {{ property.name==null?'New Property':property.name }}
          </div>
        </template>
        <EditProperty
          :property="property"
          :activity_levels="activity_levels"
          :settings="settings"
          :property_types="property_types"
          :contacts="contacts"
          :remove_type="'detach'"
          @remove-property="removeProperty"
        ></EditProperty>
      </b-tab>
    </b-tabs>
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
    properties: {required: true},
  },
  data() {
    return {
        property_types: [],
        my_properties: [],
        current_tab: 0,
        change_tab: false,
        all_properties: [],
        linked_property_id: null
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
    removeProperty(property){
      this.$http.delete('/client/' + this.client_id + '/property/' + property.id).then(()=>{
        this.my_properties = this.my_properties.filter(p => p.id !== property.id);
      });
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