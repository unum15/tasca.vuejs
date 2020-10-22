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
            {{ property.name }}
          </div>
        </template>
        <ViewPropertyIrrigationSystemsTab v-if="property.id != null" :property_id="property.id" :property_name="property.name">
        </ViewPropertyIrrigationSystemsTab>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import ViewPropertyIrrigationSystemsTab from './ViewPropertyIrrigationSystemsTab'
export default {
  name: 'ViewClientIrrigationSystemsTab',
  components: {
    'ViewPropertyIrrigationSystemsTab': ViewPropertyIrrigationSystemsTab
  },
  props: {
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
    this.my_properties = this.properties;
  },
  methods: {
    isActive (index) {
      if((this.change_tab)&&(index == this.properties.length -1)){
        return true
      }
      return false
    },
  }
}

</script>