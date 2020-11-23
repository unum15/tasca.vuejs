<template>
    <b-card title="Clock Ins" class="mb-2">
        <div v-for="clock_in in clock_ins" :key="clock_in.id">
            <EditClockIn
                :clock_in="clock_in"
                @remove-clock-in="removeClockIn"
            >
            </EditClockIn>
        </div>
        <b-button variant="secondary" @click="newClockIn()" v-if="false">Add Clock In</b-button>
    </b-card>
</template>
<script>
import EditClockIn from './EditClockIn';
export default {
  name: 'EditClockIns',
  components: {
    'EditClockIn': EditClockIn
  },
  props: {
    task_date_id: {required: true}
  },
  data() {
    return {
        clock_ins: [],
    }
  },
  created() {
    this.$http.get('/clock_ins?task_date_id=' + this.task_date_id).then(response => {
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
        task_date_id: this.task_date_id
      };
      this.clock_ins.push(clock_in);
    },
    removeClockIn (clock_in) {
      this.clock_ins = this.clock_ins.filter(d => d.id !== clock_in.id);
    },
  }
}

</script>