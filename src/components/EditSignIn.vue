<template>
<div>
  <b-row>
      <b-col>{{ my_sign_in.contact.name }}</b-col>
      <b-col class="label">Sign In</b-col>
      <b-col class="data" cols="3"><b-form-input v-model="my_sign_in.sign_in" @input="save()"></b-form-input></b-col>
      <b-col class="label">Sign Out</b-col>
      <b-col class="data" cols="3"><b-form-input v-model="my_sign_in.sign_out" @input="save()"></b-form-input></b-col>
      <b-col>{{ total }}</b-col>
      <b-col></b-col>
  </b-row>
  <b-row>
      <b-col class="label">Notes For The Day</b-col>
      <b-col class="data" cols="8"><b-form-input v-model="my_sign_in.notes" @input="save()"></b-form-input></b-col>
  </b-row>
</div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'EditSignIn',
  components: {
  },
  props: {
    sign_in: {required: true}
  },
  data: function () {
    return {
        my_sign_in: {
          id: null,
          sign_in: null,
          sign_out: null,
          notes: null
        }
    }
  },
  created() {
    Object.assign(this.my_sign_in, this.sign_in);
  },
  mounted(){
  },
  methods: {
    save(){
      this.$http.patch('/sign_in/' + this.my_sign_in.id,this.my_sign_in)
    }
  },
  computed: {
    total(){
      var start = moment(this.my_sign_in.sign_in)
      var stop = moment();
      if(this.my_sign_in.sign_out){
          stop = moment(this.my_sign_in.sign_out)
      }
      var diff = Math.round(stop.diff(start)/36000)/100
      
      return diff
    }
  }
}

</script>