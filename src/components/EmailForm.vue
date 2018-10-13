<template>
  <b-row>
    <b-col>
        <b-form-group label="Email Type">
            <b-form-select
              :options="email_types"
              value-field="id"
              text-field="name"
              v-model="my_email.email_type_id">
            </b-form-select>
        </b-form-group>
    </b-col>
    <b-col>
        <b-form-group label="Email">
            <b-form-input
              type="text"
              v-model="my_email.email"
              required
              placeholder="admin@truecomputing.biz">
            </b-form-input>
        </b-form-group>
    </b-col>
  </b-row>
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
  },
  watch: {
    my_email:{
      handler:function(){
        if(this.my_email.email === null){
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
      },
      deep: true
    }
  }
}

</script>