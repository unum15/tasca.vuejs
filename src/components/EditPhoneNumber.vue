<template>
    <b-row>
        <b-col>
            <b-form-group label="Phone Number Type">
              <b-form-select
                :options="phone_number_types"
                value-field="id"
                text-field="name"
                v-model="phone_number.phone_number_type_id">
              </b-form-select>
            </b-form-group>
        </b-col>
        <b-col>
            <b-form-group label="Phone Number">
              <b-form-input
                type="text"
                v-model="phone_number.phone_number"
                required
                placeholder="5555555555">
              </b-form-input>
            </b-form-group>
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
  },
  watch: {
    my_phone_number:{
      handler(new_number, old_number) {
        if(this.my_phone_number.phone_number === null){
          return;
        }
        if(this.my_phone_number.id === null){
          console.log('post phone number');
          this.$http.post('/phone_number',this.my_phone_number)
            .then((results) => {
              this.my_phone_number.id = results.data.id;
            })
            .catch(error => {
              console.log(error);
            });
        }
        else{
          if(old_number.id === undefined){
            return;
          }
          console.log('patch phone number' + this.my_phone_number.id);
          this.$http.patch('/phone_number/' + this.my_phone_number.id,this.my_phone_number);
        }
      },
      deep: true
    }
  }
}

</script>