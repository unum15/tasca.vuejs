<template>
<div>
  <b-row>
      <b-col>{{ my_clock_in.contact.name }}</b-col>
      <b-col class="label">Clock In</b-col>
      <b-col class="data" cols="3"><b-form-input v-model="my_clock_in.clock_in" @input="save()"></b-form-input></b-col>
      <b-col class="label">Clock Out</b-col>
      <b-col class="data" cols="3"><b-form-input v-model="my_clock_in.clock_out" @input="save()"></b-form-input></b-col>
      <b-col>{{ total }}</b-col>
      <b-col></b-col>
  </b-row>
  <b-row>
      <b-col class="label">Notes For The Day</b-col>
      <b-col class="data" cols="8"><b-form-input v-model="my_clock_in.notes" @input="save()"></b-form-input></b-col>
  </b-row>
</div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'EditClockInModule',
  components: {
  },
  props: {
    clock_in: {required: true}
  },
  data: function () {
    return {
        my_clock_in: {
          id: null,
          clock_in: null,
          clock_out: null,
          notes: null
        }
    }
  },
  created() {
    Object.assign(this.my_clock_in, this.clock_in);
  },
  mounted(){
  },
  methods: {
    save(){
      this.$http.patch('/clock_in/' + this.my_clock_in.id,this.my_clock_in)
    }
  },
  computed: {
    total(){
      var start = moment(this.my_clock_in.clock_in)
      var stop = moment();
      if(this.my_clock_in.clock_out){
          stop = moment(this.my_clock_in.clock_out)
      }
      var diff = Math.round(stop.diff(start)/36000)/100
      
      return diff
    }
  }
}

</script>