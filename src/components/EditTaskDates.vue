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
import moment from 'moment'
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
    if(this.task_id == null){
      this.newDate();
      return;
    }
    this.$http.get('/task_dates?min_date='+ this.today +'&task_id=' + this.task_id).then(response => {
        if(response.data.length > 0){
          this.dates = response.data
        }
        else{
          this.newDate();
        }
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
  },
  computed:{
    today() {
			return moment().format('YYYY-MM-DD');
		},
  }
}

</script>