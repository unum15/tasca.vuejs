<template>
    <b-card title="Clock Ins" class="mb-2">
        <div v-for="clock_in in clock_ins" :key="clock_in.id">
            <EditClockInModule
                :clock_in="clock_in"
                @remove-clock-in="removeClockIn"
            >
            </EditClockInModule>
        </div>
        <b-button variant="secondary" @click="newClockIn()" v-if="false">Add Clock In</b-button>
    </b-card>
</template>
<script>
import EditClockInModule from './EditClockInModule';
export default {
  name: 'EditClockInsModule',
  components: {
    'EditClockInModule': EditClockInModule
  },
  props: {
    appointment_id: {required: true}
  },
  data() {
    return {
        clock_ins: [],
    }
  },
  created() {
    this.$http.get('/clock_ins?appointment_id=' + this.appointment_id).then(response => {
      this.clock_ins = response.data
    })
  },
  methods: {
    newClockIn: function(){
      var clock_in = {
        id: null,
        clock_in: null,
        clock_out: null,
        notes: null,
        appointment_id: this.appointment_id
      };
      this.clock_ins.push(clock_in);
    },
    removeClockIn (clock_in) {
      this.clock_ins = this.clock_ins.filter(d => d.id !== clock_in.id);
    },
  }
}

</script>