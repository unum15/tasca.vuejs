<template>
<div>
  <b-row>
    <b-col>
        <b-form-group label="Type">
            <b-form-select
              @change="save"
              :options="email_types"
              value-field="id"
              text-field="name"
              :state="my_email.email_type_id != null"
              v-model="my_email.email_type_id">
            </b-form-select>
        </b-form-group>
    </b-col>
    <b-col>
        <b-form-group label="Email">
            <b-form-input
              type="email"
              @change="save"
              :state="verifyEmail"
              v-model="my_email.email"
              required
              placeholder="admin@truecomputing.biz">
            </b-form-input>
        </b-form-group>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <b-button variant="danger" size="sm" @click="deleteEmail">Delete</b-button>
    </b-col>
  </b-row>
</div>
</template>
<script>
export default {
  name: 'EmailForm',
  components: {
  },
  props: {
    email: {required: true},
    settings: {required: true},
    email_types: {required: true},
    contact_id: {default: null}
  },
  data: function () {
    return {
        my_email: {},
    }
  },
  created () {
    this.my_email = this.email;
  },
  methods: {
    deleteEmail(){
      this.$http.delete('/email/' + this.my_email.id);
      this.$emit('remove-email', this.my_email);
    },
    save(){
      if(!this.verifyEmail){
        return;
      }
      if(!this.my_email.contact_id){
        return;
      }
      if(this.my_email.id === null){
          this.$http.post('/email',this.my_email)
            .then((results) => {
              this.my_email.id = results.data.id;
            })
      }
      else{
        this.$http.patch('/email/' + this.my_email.id,this.my_email)
      }
    }
  },
  computed: {
    verifyEmail () {
      var regex = /[\w-]+@[-\w]+\.\w+/;
      return regex.test(this.my_email.email);
    }
  },
  watch: {
    contact_id(){
      this.my_email.contact_id = this.contact_id;
      this.save();
    }
  }
}

</script>