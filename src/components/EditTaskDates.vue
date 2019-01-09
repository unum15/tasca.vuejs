<template>
    <b-card title="Dates" class="mb-2">
        <div v-for="date in dates" :key="date.id">
            <EditTaskDate
                :date="date"
                @remove-date="removeDate"
            >
            </EditTaskDate>
        </div>
        <b-button variant="secondary" @click="newDate()">Add Date</b-button>
    </b-card>
</template>
<script>
import EditTaskDate from './EditTaskDate';
export default {
  name: 'EditTaskDates',
  components: {
    'EditTaskDate': EditTaskDate
  },
  props: {
    task_id: {required: true}
  },
  data() {
    return {
        dates: [],
    }
  },
  created() {
    this.$http.get('/task_dates?task_id=' + this.task_id).then(response => {
        this.dates = response.data
    })
  },
  methods: {
    newDate: function(){
      var date = {
        id: null,
        date: null,
        task_id: this.task_id
      };
      this.dates.push(date);
    },
    removeDate (date) {
      this.dates = this.dates.filter(d => d.id !== date.id);
    },
  }
}

</script>