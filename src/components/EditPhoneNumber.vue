<template>
    <b-row>
        <b-col>
            <b-form-group label="Type">
              <b-form-select
                @change="save"
                :options="phone_number_types"
                value-field="id"
                text-field="name"
                :state="my_phone_number.phone_number_type_id != null"
                v-model="my_phone_number.phone_number_type_id"
              >
              </b-form-select>
            </b-form-group>
        </b-col>
        <b-col>
            <b-form-group label="Phone Number">
              <b-form-input
                type="tel"
                @change="save"
                :state="verifyPhoneNumber"
                v-model="my_phone_number.phone_number"
                required
                placeholder="555-555-5555"
                :formatter="formatPhoneNumber"
                >
              </b-form-input>
            </b-form-group>
        </b-col>
        <b-col>
          <b-button variant="danger" size="sm" @click="deletePhoneNumber">Delete</b-button>
        </b-col>
    </b-row>
</template>
<script>
export default {
  name: 'PhoneNumberForm',
  components: {
  },
  props: {
    phone_number: {required: true},
    settings: {required: true},
    phone_number_types: {required: true},
  },
  data: function () {
    return {
        my_phone_number: {}
    }
  },
  created () {
    this.my_phone_number = this.phone_number;
  },
  methods: {
    save () {
      if(!this.verify_phone_number){
        return;
      }
      if(this.my_phone_number.id === null){
        this.$http.post('/phone_number',this.my_phone_number)
          .then((results) => {
            this.my_phone_number.id = results.data.id;
          })
      }
      else{
        this.$http.patch('/phone_number/' + this.my_phone_number.id,this.my_phone_number);
      }
    },
    deletePhoneNumber () {
      this.$http.delete('/phone_number/' + this.my_phone_number.id);
      this.$emit('remove-phone_number', this.my_phone_number);
    },
    formatPhoneNumber (value, event) {
      value = value.replace(/[A-Za-z]/g, '');
      //value = value.replace(/^\d{3}/g, '$1-');
      return value;
    },
  },
  computed: {
    verifyPhoneNumber () {
      var regex = /^\d\d\d-\d\d\d-\d\d\d\d$/;
      return regex.test(this.my_phone_number.phone_number);
    }
  }
}

</script>