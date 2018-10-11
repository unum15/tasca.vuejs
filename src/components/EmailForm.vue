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
        showSaveFailed: false,
        showSaveSuccess: false
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
          console.log('post email');
          this.$http.post('/email',this.my_email)
            .then((results) => {
              this.showSaveFailed = false;
              this.showSaveSuccess = true;
              this.my_email.id = results.data.id;
            })
            .catch(error => {
              this.showSaveFailed = true;
              this.showSaveSuccess = false;
            });
        }
        else{
          console.log('patch email' + this.my_email.id);
          this.$http.patch('/email/' + this.my_email.id,this.my_email)
            .catch(error => {
              this.showSaveSuccess = false;
              this.showSaveFailed = true;
            });
        }
      },
      deep: true
    }
  }
}

</script>