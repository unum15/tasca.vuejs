<template>
    <b-card title="Phone Number" class="mb-2">
    <div v-for="phone_number in phone_numbers" :key="phone_number.id" class="row">
        <EditPhoneNumber
                :settings="settings"
                :phone_number_types="phone_number_types"
                :phone_number="phone_number"
            >
        </EditPhoneNumber>
       </div>
      <b-button variant="secondary" @click="newPhoneNumber()">Add Phone Number</b-button>
    </b-card>
</template>
<script>
import EditPhoneNumber from './EditPhoneNumber';
export default {
  name: 'EditPhoneNumbers',
  components: {
    'EditPhoneNumber': EditPhoneNumber
  },
  props: {
    contact_id: {required: true},
    settings: {required: true}
  },
  data: function () {
    return {
        phone_numbers: []
    }
  },
  created () {
    this.$http.get('/phone_number_types').then(response => {
        this.phone_number_types = response.data
        if(this.contact_id !== null){
          this.$http.get('/phone_numbers?contact_id=' + this.contact_id).
          then( results => { this.phone_numbers = results.data })
        }
    })
    
  },
  methods: {
    newPhoneNumber: function() {
      var phone_number = {
        id: null,
        phone_number_type_id: null,
        phone_number: null,
        contact_id: this.contact_id
      };
      this.phone_numbers.push(phone_number);
    },
    removePhoneNumber() {
    },
  },
  watch: {
  }
}

</script>