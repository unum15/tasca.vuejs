<template>
<div>
  <b-row>
     <b-col>
        <b-form-group label="Day">
            <b-form-input
              type="text"
              @change="save"
              v-model="my_date.day"
            >
            </b-form-input>
        </b-form-group>
    </b-col>
    <b-col>
        <b-form-group label="Date">
            <b-form-input
              type="date"
              @change="save"
              v-model="my_date.date"
            >
            </b-form-input>
        </b-form-group>
    </b-col>
    <b-col>
        <b-form-group label="Time">
            <b-form-input
              type="time"
              @change="save"
              v-model="my_date.time"
            >
            </b-form-input>
        </b-form-group>
    </b-col>
    <b-col>
      <b-button variant="danger" size="sm" @click="deleteDate">Delete</b-button>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <b-form-group label="Day Notes">
          <b-form-input
            type="text"
            @change="save"
            v-model="my_date.notes"
          >
          </b-form-input>
      </b-form-group>
    </b-col>
  </b-row>
</div>
</template>
<script>
export default {
  name: 'EditTaskDate',
  components: {
  },
  props: {
    date: {required: true}
  },
  data: function () {
    return {
        my_date: {
          date: null,
          time: null,
          day: null
        }
    }
  },
  created () {
    this.my_date = this.date;
  },
  methods: {
    deleteDate(){
      this.$http.delete('/task_date/' + this.my_date.id);
      this.$emit('remove-task-date', this.my_date);
    },
    save(){
      if(this.my_date.id === null){
          this.$http.post('/task_date',this.my_date)
            .then((results) => {
              this.my_date.id = results.data.id;
            })
      }
      else{
        this.$http.patch('/task_date/' + this.my_date.id,this.my_date)
      }
    }
  }
}

</script>